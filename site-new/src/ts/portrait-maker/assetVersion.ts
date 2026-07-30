interface MetaResponse {
  data: {
    assetVersion: string;
  };
}

let assetVersionPromise: Promise<string> | null = null;

export async function GetAssetVersionGithub(): Promise<string> {
  // This function is slightly stolen from swgoh-ae2

  if (!assetVersionPromise) {
    assetVersionPromise = (async () => {
      const versionGetterUrl =
        "https://raw.githubusercontent.com/swgoh-utils/gamedata/refs/heads/main/meta.json";

      const response = await fetch(versionGetterUrl);

      if (!response.ok) {
        console.error("Failed to get github version");
        throw new Error("Failed to fetch asset version");
      }

      const metaData = (await response.json()) as MetaResponse;

      console.log("Found AssetVersion:", metaData.data.assetVersion);

      return metaData.data.assetVersion;
    })();
  }

  return assetVersionPromise;
}

await GetAssetVersionGithub();