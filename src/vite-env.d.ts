/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Публичный origin сайта без слэша в конце, например https://example.com — для canonical и og:url */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
