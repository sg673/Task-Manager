import { defineConfig, type UserConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
    plugins: [
      react(),
      tailwindcss(),
    ],
    test : {
      environment: 'jsdom',
      globals: true,
      setUpFiles: ['./src/__tests__/setup.ts'],
    }
  } as UserConfig
)
