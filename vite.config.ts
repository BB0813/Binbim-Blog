import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  // 强制使用相对路径或基于 process.cwd() 的路径，彻底杜绝 D:\ 盘符问题
  const root = process.cwd();

  return {
    // 这里的 base 必须与你的部署子路径完全一致
    base: isProduction ? '/Binbim-Blog/' : '/',
    define: {
      global: 'globalThis',
    },
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
        '@/components': path.resolve(root, 'src/components'),
        '@/utils': path.resolve(root, 'src/utils'),
        '@/types': path.resolve(root, 'src/types'),
        'buffer': 'buffer',
      },
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true, // 确保构建前清理旧产物
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
          },
        },
      },
    },
    plugins: [
      react(),
    ],
  };
});
