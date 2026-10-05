import Home from "./pages/home";
import About from "./pages/about";
import SWGoHUpdates from "./pages/swgoh-updates";
import PortraitMaker from "./pages/portrait-maker";
import LocBundle from "./pages/loc-bundle";
import Terms from "./pages/terms";
import AssetExtractorWeb from "./pages/asset-extractor-web";
import NotFound from "./pages/not-found";

export type PageDefinition = {
    PageName: string;
    PageTitle: string;
    PageElement: React.ComponentType;
    PageMainPath: string;
    PageAliasPaths: string[];
    PageMetaTags: React.ReactElement[];
}

const SiteLink = "https://Lego-Fan9.github.io";
const FaviconLink = SiteLink + "/favicon.ico";
const SiteShortLink = "Lego-Fan9.github.io";

const defaultMeta: React.ReactElement[] = [
    <meta key="charset" charSet="UTF-8" />,
    <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />,
    <meta key="robots" name="robots" content="index, follow" />,
    <link key="favicon-link" rel="icon" type="image/svg+xml" href={`${FaviconLink}`} />,
];

export const Pages: PageDefinition[] = [
    {
        PageName: "Home",
        PageTitle: `Home - ${SiteShortLink}`,
        PageElement: Home,
        PageMainPath: "/",
        PageAliasPaths: [],
        PageMetaTags: [
            ...defaultMeta,
            ...GenPageMetaTags("Free Star Wars: Galaxy of Heroes Tools - Homepage", "Home", "/"),
        ],
    },
    {
        PageName: "About",
        PageTitle: `About - ${SiteShortLink}`,
        PageElement: About,
        PageMainPath: "/about",
        PageAliasPaths: [],
        PageMetaTags: [
            ...defaultMeta,
            ...GenPageMetaTags("Free Star Wars: Galaxy of Heroes Tools - About", "About", "/about"),
        ],
    },
    {
        PageName: "SWGoH Updates",
        PageTitle: `SWGoH Updates - ${SiteShortLink}`,
        PageElement: SWGoHUpdates,
        PageMainPath: "/swgoh-updates",
        PageAliasPaths: [],
        PageMetaTags: [
            ...defaultMeta,
            ...GenPageMetaTags("SWGoH Updates - Automatic Star Wars: Galaxy of Heroes Datamines", "SWGoH Updates", "/swgoh-updates"),
        ],
    },
    {
        PageName: "SWGoH Portrait Maker",
        PageTitle: `SWGoH Portrait Maker - ${SiteShortLink}`,
        PageElement: PortraitMaker,
        PageMainPath: "/swgoh-portrait-maker",
        PageAliasPaths: [],
        PageMetaTags: [
            ...defaultMeta,
            ...GenPageMetaTags("Star Wars: Galaxy of Heroes Portrait Maker", "SWGoH Portrait Maker", "/swgoh-portrait-maker"),
        ],
    },
    {
        PageName: "SWGoH Loc Bundle Formatter",
        PageTitle: `SWGoH Loc Bundle Formatter - ${SiteShortLink}`,
        PageElement: LocBundle,
        PageMainPath: "/loc-bundle-format",
        PageAliasPaths: [
            "/swgoh-updates/loc-bundle-format"
        ],
        PageMetaTags: [
            ...defaultMeta,
            ...GenPageMetaTags("Star Wars: Galaxy of Heroes Loc Bundle Formatter", "SWGoH Loc Bundle Formatter", "/loc-bundle-format"),
        ],
    },
    {
        PageName: "Terms",
        PageTitle: `Terms - ${SiteShortLink}`,
        PageElement: Terms,
        PageMainPath: "/terms",
        PageAliasPaths: [],
        PageMetaTags: [
            ...defaultMeta,
            ...GenPageMetaTags("Free Star Wars: Galaxy of Heroes Tools - Tools", "Terms", "/terms"),
        ],
    },
    {
        PageName: "Asset Extractor Web",
        PageTitle: `Asset Extractor Web - ${SiteShortLink}`,
        PageElement: AssetExtractorWeb,
        PageMainPath: "/asset-extractor-web",
        PageAliasPaths: [],
        PageMetaTags: [
            ...defaultMeta,
            ...GenPageMetaTags("Star Wars: Galaxy of Heroes Web base Asset Extractor", "Asset Extractor Web", "/asset-extractor-web"),
        ],
    },
    {
        PageName: "404",
        PageTitle: `404 - ${SiteShortLink}`,
        PageElement: NotFound,
        PageMainPath: "*",
        PageAliasPaths: [],
        PageMetaTags: [
            <meta key="charset" charSet="UTF-8" />,
            <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />,
            <meta key="robots" name="robots" content="noindex, follow" />,

            <meta key="og-title" property="og:title" content={`Page Not Found — ${SiteShortLink}`} />,
            <meta key="og-prop" property="og:description" content="The page you're looking for could not be found." />,
            <meta key="og-type" property="og:type" content="website" />,
        ],
    },
] as const;

function GenPageMetaTags(desc: string, pageName: string, pagePath: string): React.JSX.Element[] {
    return [
        <meta key="desc" name="description" content={`${SiteShortLink} - ${desc}`} />,
        <link key="canonical" rel="canonical" href={`${SiteLink}${pagePath}`} />,

        <meta key="og-title" property="og:title" content={`${pageName} - ${SiteShortLink}`} />,
        <meta key="og-desc" property="og:description" content={`${SiteShortLink} - ${desc}`} />,
        <meta key="og-url" property="og:url" content={`${SiteLink}${pagePath}`} />,
        <meta key="og-type" property="og:type" content="website" />,
        <meta key="og-image" property="og:image" content={`${FaviconLink}`} />,

        <meta key="twitter-card" name="twitter:card" content="summary" />,
        <meta key="twitter-title" name="twitter:title" content={`${pageName} - ${SiteShortLink}`} />,
        <meta key="twitter-desc" name="twitter:description" content={`${SiteShortLink} - ${desc}`} />,
        <meta key="twitter-image" name="twitter:image" content={`${FaviconLink}`} />,
    ]
}