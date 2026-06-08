import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Thí nghiệm 3D (.htm) nằm trong /public/experiments và được phục vụ tĩnh,
// nhúng vào trang Bài học qua iframe.
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
