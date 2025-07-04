import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'suppress-lucide-sourcemap-warnings',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (
            req.url &&
            req.url.includes('lucide-react') &&
            req.url.endsWith('.js.map')
          ) {
            res.statusCode = 204; // No Content
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    sourcemap: false, // disables sourcemap generation
  },
  server: {
    // This disables sourcemap warnings in dev (Vite 5+)
    sourcemapIgnoreList: () => false,
  },
});
