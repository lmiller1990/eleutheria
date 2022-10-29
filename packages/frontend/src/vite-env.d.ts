/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly CDN_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
