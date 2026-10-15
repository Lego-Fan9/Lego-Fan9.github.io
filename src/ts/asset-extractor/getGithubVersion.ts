

export default async function getGithubVersion(): Promise<string> {
    const resp = await fetch("https://raw.githubusercontent.com/swgoh-utils/gamedata/refs/heads/main/meta.json");
    if (!resp.ok) {
        throw new Error(`Bad call to get version: ${resp.status}`);
    }

    const respJson = await resp.json();

    return respJson.data.assetVersion;
}