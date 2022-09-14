/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GAME_DATA_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
