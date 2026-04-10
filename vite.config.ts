import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteImageOptimizer({
      includePublic: true,
      logStats: true,
      // Sharp: разумное сжатие для веба (можно подкрутить quality)
      png: {
        quality: 90,
        compressionLevel: 9,
      },
      jpeg: {
        quality: 82,
        mozjpeg: true,
      },
      jpg: {
        quality: 82,
        mozjpeg: true,
      },
      webp: {
        quality: 80,
        effort: 4,
      },
      avif: {
        quality: 72,
        effort: 4,
      },
      cache: true,
      cacheLocation: 'node_modules/.cache/vite-image-optimizer',
    }),
  ],
})
