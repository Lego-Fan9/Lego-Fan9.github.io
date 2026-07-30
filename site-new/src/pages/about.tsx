import styled from "styled-components";

export default function About() {
    return (
        <AboutPage>
            <p>Hi! I'm LegoFan9, I made this site originally for portrait maker, however I have since added numerous tools. Here
                are some of the ones I find most worth sharing</p>
            <ul>
                <li><a href="/swgoh-updates">Update Notifier</a> A discord based automatic datamining tool for SWGoH</li>
                <li><a href="/swgoh-portrait-maker">SWGoH Portrait Maker</a> A tool that overlays custom SWGoH style borders
                    over your images</li>
                <li><a href="https://github.com/Lego-Fan9/swgoh-assetapi">SWGoH AssetAPI</a> An asset datamining tool for SWGoH
                </li>
                <li><a href="/swgoh-updates/sprite-downloads">SWGoH Sprite Cutter</a> A tool that datamines SWGoH sprites.
                    Closed source, but you can download
                    assets</li>
                <li><a href="/loc-bundle-format">SWGoH Localization Bundle Parser</a> A tool to explore SWGoH Localization Bundles</li>
                <li><a href="/asset-extractor-web">Asset Extractor Web</a> A showcase of another project, <a href="https://www.npmjs.com/package/@lego-fan9/asset-studio-web">asset-studio-web</a></li>
            </ul>
            <p>There are more plans for the future, but for now I think thats all. MTFBWY</p>
        </AboutPage>
    )
}

const AboutPage = styled.div`
    max-width: 800px;
    margin: 40px auto;
    padding: 32px;

    background-color: var(--card-background-dark);
    border: 1px solid var(--border-card-dark);
    border-radius: 12px;

    color: var(--text-dark);
    text-align: left;
    line-height: 1.7;

    p {
        margin: 0 0 20px;
    }

    ul {
        margin: 24px 0;
        padding-left: 24px;
    }

    li {
        margin-bottom: 16px;
        color: var(--text-secondary-dark);
    }

    a {
        color: var(--text-dark);
        font-weight: bold;
        text-decoration: none;
        margin-right: 8px;

        &:hover {
            text-decoration: underline;
        }
    }

    @media (max-width: 768px) {
        margin: 20px;
        padding: 24px;
    }
`;