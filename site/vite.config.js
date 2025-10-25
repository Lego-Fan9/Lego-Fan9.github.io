import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
    base: '/',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                about: resolve(__dirname, 'about/index.html'),
                swgohPortraitMaker: resolve(__dirname, 'swgoh-portrait-maker/index.html'),
                swgohPortraitMakerTerms: resolve(__dirname, 'swgoh-portrait-maker/terms.html'),
                swgohUpdates: resolve(__dirname, 'swgoh-updates/index.html'),
                locBundleFormat: resolve(__dirname, 'swgoh-updates/loc-bundle-format/index.html'),
                spriteDownloads: resolve(__dirname, 'swgoh-updates/sprite-downloads/index.html'),
                spriteDownloadsDownload: resolve(__dirname, 'swgoh-updates/sprite-downloads/download.html'),
                accountViewer: resolve(__dirname, 'account-viewer/index.html')
            }
        }
    },
    server: {
    host: '0.0.0.0', // allow LAN access
    port: 5173,
    strictPort: true,
    cors: true,
  },
})