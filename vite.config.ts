import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/LinkedIn_AI_Career_Enhancer/',  // 🔥 REQUIRED for GitHub Pages

  optimizeDeps: {
    exclude: ['lucide-react'],
  },

  server: {
    host: true,
    port: 5173,
  },
});
