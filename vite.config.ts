import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement (API_KEY) depuis Vercel ou .env
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Cette ligne est CRUCIALE : elle injecte la clé API dans le code final
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})