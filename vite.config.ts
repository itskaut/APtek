import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Если мы на GitHub (в режиме production), используем путь репозитория.
  // Если запускаем локально (npm run dev), используем корень '/'.
  base: process.env.NODE_ENV === 'production' ? '/APtek/' : '/',
})