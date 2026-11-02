import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves the site from /mini-games/ (the repo name).
// Local `npm run dev` keeps using /.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/mini-games/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
}))
