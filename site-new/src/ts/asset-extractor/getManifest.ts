import { RawAssetManifest } from "./manifest.ts";

export default async function getManifest(version: string, includeAudio = false): Promise<string[]> {
    const resp = await fetch(`https://swgoh-assets.lego-fan9.workers.dev/?version=${version}&item=manifest`);
    if (!resp.ok) {
        throw new Error("Bad fetch: " + resp.status);
    }

    const proto = RawAssetManifest.decode(new Uint8Array(await resp.arrayBuffer()))

    let fn_resp: string[] = []

    for (const record of proto.records) {
        if (record.name.startsWith("audio_") && !includeAudio) {
            continue;
        }
        
        fn_resp.push(record.name);
    }

    return fn_resp;
}