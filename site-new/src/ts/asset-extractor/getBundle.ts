

export default async function getBundle(version: string, item: string): Promise<Uint8Array> {
    const resp = await fetch(`https://swgoh-assets.lego-fan9.workers.dev/assets?version=${version}&item=${item}`);
    if (!resp.ok) {
        throw new Error("Bad fetch: " + resp.status);
    }

    return new Uint8Array(await resp.arrayBuffer());
} 