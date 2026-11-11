import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    githubPagesFallback(),
  ],
})

function githubPagesFallback() {
  return {
    name: 'github-pages-fallback',
    apply: 'build',

    closeBundle() {
      const outDir = resolve(process.cwd(), 'dist');

      copyFileSync(
        resolve(outDir, 'index.html'),
        resolve(outDir, '404.html')
      );
    }
  };
}
