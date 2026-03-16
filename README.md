# Daily Wins Wrapped

A Spotify Wrapped-like web application that connects the GO Youth Google Sheets daily wins (From the daily wins discord bot) and uses DeepSeek's API to generate an encouraging, personalized narrative of a users wins!


## Architecture

This project is split into two halves:
1. **Frontend (React Router SPA)**: A 6-slide animated web app styled with TailwindCSS that handles taking a user's ID, passing it to the backend, and rendering the stats and AI narrative. 
2. **Backend (Google Apps Script)**: A serverless endpoint (`backend/Code.gs`) that reads your Google Sheet, counts your Physical, Mental, and Spiritual wins, calculates your longest streak, securely connects to the DeepSeek chat completions API, and heavily rate-limits requests to protect your API keys.

---

## 1. Google Apps Script Backend Setup
Your actual data and the DeepSeek API key live securely inside Google's infrastructure. 

1. Go to [Google Apps Script](https://script.google.com/) and create a new project.
2. Copy the contents of `backend/Code.gs` into the editor.
3. Click the **Gear Icon (Project Settings)** on the left rail.
4. Scroll down to **Script Properties** and add two keys:
   - `DEEPSEEK_API_KEY`: Your DeepSeek API key (or OpenRouter key if proxying).
   - `SHEET_ID`: The long ID found in your tracking Google Sheet URL.
5. Click **Deploy > New Deployment** in the top right. Select "Web App".
   - Set "Execute As" to **"Me"**.
   - Set "Who has access" to **"Anyone"**.
6. Copy the resulting **Web App URL**. This is your backend endpoint!

*(Note: Your target Google Sheet needs at least a `Date`, `User ID`, `Physical Win`, `Mental Win`, `Spiritual Win`, and `Streak Count` column to match the aggregations in `Code.gs`.)*

---

## 2. Frontend Development Setup

To run this application locally while styling or modifying it:

1. Clone this repository down to your machine.
2. Run `npm install` to install dependencies.
3. Create a `.env` file at the root of the project with your script URL:
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
   ```
4. Run `npm run dev` to start the local development server at `http://localhost:5173`.

---

## 3. GitHub Pages Deployment (Free Hosting!)
This project is configured automate its own builds and host itself for free on GitHub Pages! 

We do *not* commit the `.env` file to keep the backend URL hidden. Instead, we use GitHub settings:

1. Push your code to your GitHub Repository.
2. Open your repository on GitHub and navigate to: **Settings > Secrets and variables > Actions**.
3. Click **New repository secret**.
4. Name: `VITE_APPS_SCRIPT_URL` — Value: Your Google Apps Script Web App URL.
5. Click **Add secret**.



