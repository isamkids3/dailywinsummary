import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Disable SSR to enable SPA mode for static hosting like GitHub Pages
  ssr: false,
  // Use BASE_PATH injected by GitHub Actions for subdirectory hosting
  basename: process.env.BASE_PATH || "/",
} satisfies Config;
