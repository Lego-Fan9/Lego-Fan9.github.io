import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import moveHtmlPlugin  from "./vite/moveHtmlPlugin";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        moveHtmlPlugin()
    ],
    build: {
        rollupOptions: {
            input: {
                "Home": "html\\index.html",
                "About": "html\\about\\index.html",
                "SWGoH Updates": "html\\swgoh-updates\\index.html",
                "SWGoH Portrait Maker": "html\\swgoh-portrait-maker\\index.html",
                "SWGoH Loc Bundle Formatter": "html\\loc-bundle-format\\index.html",
                "Terms": "html\\terms\\index.html",
                "Asset Extractor Web": "html\\asset-extractor-web\\index.html",
                "404": "html\\404.html"
            }
        }
    }
})
