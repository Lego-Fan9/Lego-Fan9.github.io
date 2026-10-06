export default function devHtmlPlugin() {
    return {
        name: "dev-html",

        configureServer(server) {
            server.middlewares.use(async (req, _, next) => {
                if (!req.url) {
                    next();
                    return;
                }

                const url = new URL(req.url, "http://localhost");
                const pathname = url.pathname;

                if (pathname.startsWith("/@") || pathname.startsWith("/node_modules/")) {
                    next();
                    return;
                }

                if (pathname === "/") {
                    req.url = "/html/index.html";
                } else if (pathname.endsWith("404.html")) {
                    req.url = "/html/404.html"
                } else if (!pathname.startsWith("/html/") && !pathname.includes(".")) {
                    req.url = `/html${pathname.replace(/\/$/, "")}/index.html`;
                }

                next();
            });
        }
    };
}