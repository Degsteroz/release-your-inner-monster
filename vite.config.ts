import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || 'https://your-domain.com').replace(/\/$/, '')
  const ogImageAbs = `${siteUrl}/og-preview.webp`

  return {
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
      {
        name: 'html-meta-site-url',
        transformIndexHtml(html) {
          return html
            .replace(/%VITE_SITE_ORIGIN%/g, siteUrl)
            .replace(/%VITE_OG_IMAGE%/g, ogImageAbs)
        },
      },
    ],
  }
})
