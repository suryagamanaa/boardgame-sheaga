import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// ── Konfigurasi utama ──────────────────────────────────────────────────────────
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  return {
    // 🔥 INI YANG PALING PENTING UNTUK PUBLIC FOLDER
    publicDir: 'public',
    
    base: '/',
    
    build: {
      sourcemap: isDev ? 'inline' : false,
      minify: !isDev,
      copyPublicDir: true, // 🔥 PASTIKAN PUBLIC DI-COPY KE DIST
      outDir: 'dist',
    },
    
    plugins: [
      react(),
      // Tambahkan plugin Figma yang benar-benar Anda butuhkan di sini
      // figmaSiteConfiguration(siteConfiguration), // Hanya jika Anda pakai
    ],
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    server: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '5173'),
      strictPort: true,
    },
    
    preview: {
      host: '0.0.0.0',
      port: parseInt(process.env.PORT || '5173'),
    },
  }
})