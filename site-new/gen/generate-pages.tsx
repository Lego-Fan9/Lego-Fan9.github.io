import fs from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { createServer } from "vite";

const vite = await createServer({
    server: {
        middlewareMode: true
    },
    appType: "custom"
});

const { Pages } = await vite.ssrLoadModule("/src/pages.tsx");

export type PageDefinition = {
    PageName: string;
    PageTitle: string;
    PageElement: React.ComponentType;
    PageMainPath: string;
    PageAliasPaths: string[];
    PageMetaTags: React.ReactElement[];
}

const DIST_DIR = path.resolve("dist");

function getOutputDirectory(pagePath: string): string {
    if (pagePath === "*") {
        return DIST_DIR;
    }

    const cleanPath = pagePath.replace(/^\/+|\/+$/g, "");

    return cleanPath
        ? path.join(DIST_DIR, cleanPath)
        : DIST_DIR;
}

function getPageHtml(page: PageDefinition): string {
    const metaTags = renderToStaticMarkup(
        <>
            <title>{page.PageTitle}</title>
            {page.PageMetaTags}
        </>
    ).replace(/></g, ">\n<");

    return `<!DOCTYPE html>
<html lang="en">
<head>
${metaTags}

<script data-goatcounter="https://lego-fan9.goatcounter.com/count"
    data-goatcounter-settings='{"no_onload": true, "allow_local": true}' async src="//gc.zgo.at/count.js"></script>

<script>
    (function () {
        var redirect = sessionStorage.redirect;
        delete sessionStorage.redirect;

        if (redirect && redirect !== location.href) {
            history.replaceState(null, null, redirect);
        }
    })();
</script>
</head>
<body>
    <div id="root"></div>

    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
`;
}

async function generatePage(page: (typeof Pages)[number]): Promise<void> {
    const outputDirectory = getOutputDirectory(page.PageMainPath);
    let outputFile
    if (page.PageName === "404") {
        outputFile = path.join(outputDirectory, "404.html");
    } else {
        outputFile = path.join(outputDirectory, "index.html");
    }

    await fs.mkdir(outputDirectory, { recursive: true });
    await fs.writeFile(outputFile, getPageHtml(page), "utf8");

    console.log(`Generated: ${path.relative(process.cwd(), outputFile)}`);
}

function getSitemapXml(): string {
    const urls = Pages
        .filter((page: PageDefinition) => page.PageMainPath !== "*")
        .map((page: PageDefinition) => {
            const url = new URL(page.PageMainPath, "https://Lego-Fan9.github.io");

            return `    <url>
        <loc>${url.href}</loc>
    </url>`;
        })
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function main(): Promise<void> {
    console.log("Deleting old dist...");

    const outputDirectory = getOutputDirectory("");
    await fs.rm(outputDirectory, { recursive: true, force: true })

    console.log("Generating page index.html files...");

    try {
        for (const page of Pages) {
            await generatePage(page);
        }

        console.log("Done.");
    } finally {
        await vite.close();
    }

    console.log("Done generating index.html...");
    console.log("Generating sitemap...");

    const sitemapFile = path.join(DIST_DIR, "sitemap.xml");

    await fs.writeFile(
        sitemapFile,
        getSitemapXml(),
        "utf8"
    );

    console.log("Done generating sitemap...")
}

main().catch((error) => {
    console.error("Failed to generate pages:");
    console.error(error);
    process.exit(1);
});
