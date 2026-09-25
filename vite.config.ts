/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/**
 * Says clearly in the build log whether Supabase is set up, without ever
 * printing the values. Without it the site still builds and quietly falls
 * back to iNaturalist, which is easy to miss.
 */
function checkSupabaseSettings(mode: string) {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const url = env.VITE_SUPABASE_URL ?? ''
  const key = env.VITE_SUPABASE_ANON_KEY ?? ''

  // Anything prefixed VITE_ ends up in the public JavaScript, so a secret
  // key here would be published to every visitor. Refuse to build at all.
  if (key.startsWith('sb_secret_')) {
    throw new Error(
      'VITE_SUPABASE_ANON_KEY holds a secret key. Use the publishable key: the secret one would be visible to everyone.',
    )
  }

  const problems = [
    !url && 'VITE_SUPABASE_URL is not set',
    url && !/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(url) &&
      'VITE_SUPABASE_URL should look like https://<project>.supabase.co, with nothing after it',
    !key && 'VITE_SUPABASE_ANON_KEY is not set',
    key && !/^(sb_publishable_|eyJ)/.test(key) &&
      'VITE_SUPABASE_ANON_KEY should be the publishable key, starting sb_publishable_',
  ].filter(Boolean)

  if (problems.length === 0) {
    console.log('\nSupabase: configured.\n')
  } else {
    console.warn(
      `\nSupabase: not configured, so this build will use the slower iNaturalist fallback.\n  - ${problems.join('\n  - ')}\n`,
    )
  }
}

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') checkSupabaseSettings(mode)

  return {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
    },
  }
})
