// To set properties, go to Apps Script > Project Settings > Script Properties
// Add: DEEPSEEK_API_KEY = your_key_here
// Add: SHEET_ID = your_google_sheet_id_here

function getUserIdFromUsername(username) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const sheetId = scriptProperties.getProperty('SHEET_ID');
  
  const ss = SpreadsheetApp.openById(sheetId);
  const usersSheet = ss.getSheetByName('Users'); // second tab called "Users"
  
  if (!usersSheet) return null;
  
  const data = usersSheet.getDataRange().getValues();
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0].toString().toLowerCase() === username.toLowerCase()) {
      return data[i][1].toString(); // return the Discord User ID
    }
  }
  
  return null;
}

function doPost(e) {
  try {
    const postData = JSON.parse(e.postData.contents);
    const username = postData.username;

    if (!username) {
  return createJsonResponse({ error: "Username is required" }, 400);
}
    // --- RATE LIMITING SHIELD (Runs BEFORE Spreadsheet access) ---
    const cache = CacheService.getScriptCache();
    
    // 1. Global Rate Limit (max 50 requests per 60 seconds)
    const globalKey = 'ratelimit_global';
    const globalCalls = cache.get(globalKey);
    let currentGlobal = globalCalls ? parseInt(globalCalls, 10) : 0;
    
    if (currentGlobal >= 50) {
      return createJsonResponse({ error: "System is exceptionally busy. Please try again in 60 seconds." }, 429);
    }
    // Increment cache properly (overwrites expiration, which is extremely harsh but simple for DoS protection)
    cache.put(globalKey, (currentGlobal + 1).toString(), 60);

    // 2. Individual Rate Limit (keyed by username to prevent spamming Google Sheets API)
    const userKey = `ratelimit_user_${username.toLowerCase()}`;
    const userCalls = cache.get(userKey);
    let currentUser = userCalls ? parseInt(userCalls, 10) : 0;

    if (currentUser >= 6) {
      return createJsonResponse({ error: "Rate limit exceeded for this username. Try again later." }, 429);
    }
    cache.put(userKey, (currentUser + 1).toString(), 6 * 60 * 60); // 6 hours
    // --- END RATE LIMITING SHIELD ---

    const userId = getUserIdFromUsername(username);

    if (!userId) {
      return createJsonResponse({ error: "Username not found" }, 404);
    }

    // Setup Properties
    const scriptProperties = PropertiesService.getScriptProperties();
    const sheetId = scriptProperties.getProperty('SHEET_ID');
    const deepSeekApiKey = scriptProperties.getProperty('DEEPSEEK_API_KEY');

    if (!sheetId || !deepSeekApiKey) {
      return createJsonResponse({ error: "Server configuration error. Missing API or Sheet properties." }, 500);
    }

    // Fetch and Aggregate Data
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length < 2) {
      return createJsonResponse({ error: "No data found in sheet." }, 404);
    }

    const headers = data[0].map(h => String(h).trim());
    const userIdIndex = headers.indexOf('User ID');
    const physicalIndex = headers.indexOf('Physical Win');
    const mentalIndex = headers.indexOf('Mental Win');
    const spiritualIndex = headers.indexOf('Spiritual Win');
    const streakIndex = headers.indexOf('Streak Count'); // Assuming this exists

    if (userIdIndex === -1 || physicalIndex === -1 || mentalIndex === -1 || spiritualIndex === -1) {
      return createJsonResponse({ error: "Missing required columns in sheet (User ID, Physical Win, Mental Win, Spiritual Win)." }, 500);
    }

    let stats = {
      totalWins: 0,
      physicalCount: 0,
      mentalCount: 0,
      spiritualCount: 0,
      longestStreak: 0,
      totalEntries: 0
    };

    let winTexts = [];

    const dateIndex = headers.indexOf('Date');
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const cellUserId = String(row[userIdIndex]).trim();
      const searchUserId = String(userId).trim();
      
      if (cellUserId === searchUserId && cellUserId !== "") {
        stats.totalEntries++;

        let pWin = row[physicalIndex] ? String(row[physicalIndex]).trim() : '';
        let mWin = row[mentalIndex] ? String(row[mentalIndex]).trim() : '';
        let sWin = row[spiritualIndex] ? String(row[spiritualIndex]).trim() : '';

        // BETTER - preserves context for DeepSeek
        let dateVal = '';
        if (dateIndex !== -1 && row[dateIndex]) {
          try {
            // Google Sheets returns JS Date objects for date cells by default
            const rawDate = new Date(row[dateIndex]);
            if (!isNaN(rawDate.getTime())) {
              dateVal = rawDate.toISOString().slice(0, 10); // Standard 'YYYY-MM-DD'
            } else {
              dateVal = String(row[dateIndex]); // Fallback if it's just raw text
            }
          } catch (e) {
            dateVal = String(row[dateIndex]).slice(0, 10);
          }
        }

        if (pWin) { 
          stats.physicalCount++; 
          winTexts.push(`[${dateVal}] Physical: ${pWin}`); 
        }
        if (mWin) { 
          stats.mentalCount++; 
          winTexts.push(`[${dateVal}] Mental: ${mWin}`); 
        }
        if (sWin) { 
          stats.spiritualCount++; 
          winTexts.push(`[${dateVal}] Spiritual: ${sWin}`); 
        }

        if (pWin || mWin || sWin) {
          stats.totalWins += (pWin ? 1 : 0) + (mWin ? 1 : 0) + (sWin ? 1 : 0);
        }

        if (streakIndex !== -1 && row[streakIndex]) {
          const streakVal = parseInt(row[streakIndex], 10);
          if (!isNaN(streakVal) && streakVal > stats.longestStreak) {
            stats.longestStreak = streakVal;
          }
        }
      }
    }

    if (stats.totalEntries === 0) {
      return createJsonResponse({ error: "User is not in the daily win data." }, 404);
    }

    // Clean Text Context for DeepSeek
    const cleanedContext = winTexts
      .map(text => text.replace(/^-+/g, '').replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim())
      .filter(text => text.length > 0)
      .join('\n');

    // DeepSeek Integration
    const deepSeekPrompt = `You are writing a Spotify Wrapped-style personal summary for someone's daily wins journal. 

    STRICT RULES:
    - Output ONE paragraph only. No headers, no bullet points, no lists.
    - Start IMMEDIATELY with the summary. Do NOT say "Sure", "Here is", "Based on" or any introduction.
    - Write in second person ("You showed up...", "Your biggest theme was...")
    - Be specific — reference actual things from their wins log, not generic praise
    - Tone: warm, punchy, celebratory. Like a hype friend reading back your best moments.
    - Max 150 words.

    USER WINS LOG:
    ${cleanedContext}`;

    const payload = {
      model: "deepseek-chat",
      messages: [
        { role: "system", content: "You are a helpful, enthusiastic AI analyst for a habit tracking app." },
        { role: "user", content: deepSeekPrompt }
      ],
      temperature: 0.7
    };

    const options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "Authorization": `Bearer ${deepSeekApiKey}`
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const dsResponse = UrlFetchApp.fetch("https://api.deepseek.com/chat/completions", options);
    const dsResult = JSON.parse(dsResponse.getContentText());

    let summary = "Wow, what an incredible journey you've had. Keep showing up and stacking those wins!";
    if (dsResult.choices && dsResult.choices.length > 0 && dsResult.choices[0].message) {
      summary = dsResult.choices[0].message.content;
    } else {
      console.error("DeepSeek API Error:", dsResult);
    }

    return createJsonResponse({
      stats: stats,
      summary: summary
    });

  } catch (error) {
    console.error("Error Processing Request:", error);
    return createJsonResponse({ error: "Internal Server Error: " + error.message }, 500);
  }
}

// Helper to support CORS and structured JSON response
function createJsonResponse(data, statusCode = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Note: Apps Script acts as a proxy, so standard CORS headers usually apply automatically.
  return output;
}

// Handle preflight requests for CORS if called via standard fetch from browser
function doOptions(e) {
  const output = ContentService.createTextOutput('');
  output.setMimeType(ContentService.MimeType.TEXT);
  return output;
}
