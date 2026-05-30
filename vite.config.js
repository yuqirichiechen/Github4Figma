import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// On GitHub Pages the app is served from /Github4Figma/.
// Local dev, Vercel, and Netlify all serve from root.
const base = process.env.GITHUB_PAGES ? '/Github4Figma/' : '/'

export default defineConfig({
  base,
  plugins: [react()],
})
