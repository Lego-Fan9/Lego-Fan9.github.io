import type { Plugin } from "vite";
import fs from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve("./dist");
const HTML_DIR = path.join(DIST_DIR, "html");

export default function moveHtmlPlugin(): Plugin {
    return {
        name: "move-html",
        apply: "build",

        async closeBundle() {
            const entries = await fs.readdir(HTML_DIR, {
                withFileTypes: true
            });

            for (const entry of entries) {
                const source = path.join(HTML_DIR, entry.name);
                const destination = path.join(DIST_DIR, entry.name);

                await fs.rm(destination, {
                    recursive: true,
                    force: true
                });

                await fs.rename(source, destination);
            }

            await fs.rm(HTML_DIR, {
                recursive: true,
                force: true
            });
        }
    };
}