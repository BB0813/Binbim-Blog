import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const repoName = process.env.VITE_BASE_URL;
  const customDomain = process.env.VITE_CUSTOM_DOMAIN;
  
  // 如果使用自定义域名，base 路径应该是 '/'
  // 如果使用 GitHub Pages 默认域名，base 路径应该是 '/repo-name/'
  const base = isProduction 
    ? (customDomain === 'true' ? '/' : (repoName ? `/${repoName}/` : '/'))
    : '/';

  return {
    base,
    define: {
      global: 'globalThis',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './src/components'),
        '@/utils': path.resolve(__dirname, './src/utils'),
        '@/types': path.resolve(__dirname, './src/types'),
        buffer: 'buffer',
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: 'hidden',
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['lucide-react'],
          },
        },
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
    plugins: [
      react({
        babel: {
          plugins: ['react-dev-locator'],
        },
      }),
      tsconfigPaths(),
    ],
  };
});
