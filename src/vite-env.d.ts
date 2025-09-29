/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_ANTHROPIC_API_KEY: string
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_FACEBOOK_APP_ID: string
  readonly VITE_N8N_WEBHOOK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}