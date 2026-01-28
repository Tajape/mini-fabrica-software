import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Adicione essa linha

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Adicione essa linha aqui
  ],
})