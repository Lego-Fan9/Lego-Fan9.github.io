import type { EventRecord } from "../../components/update-freq/grapher";

const workerUrl = "https://swgoh-assets.lego-fan9.workers.dev/updates";

const displayOrder = [
    "latestGamedataVersion",
    "assetVersion",
    "latestLocalizationBundleVersion",
    "serverVersion",
];

interface GetUpdatesResponse {
    versionNames: string[]
    versions: Record<string, EventRecord[]>
}

export default async function GetUpdates(): Promise<GetUpdatesResponse> {
    const resp: GetUpdatesResponse = {
        versionNames: [],
        versions: {},
    };

    try {
        const response = await fetch(workerUrl);
        if (!response.ok) {
            console.error(`Non ok status getting updates log: ${response.status}, ${response.text}`);

            return resp
        }

        const csv = await response.text();

        const [_, ...rows] = csv.trim().split(/\r?\n/);

        for (const row of rows) {
            const [type, version, timestamp] = row.split(",");

            const event: EventRecord = {
                type,
                version: version || undefined,
                timestamp: Number(timestamp),
            };

            if (!resp.versions[type]) {
                resp.versions[type] = [];
            }

            resp.versions[type].push(event);
        }

        resp.versionNames = Object.keys(resp.versions);

        resp.versionNames = Object.keys(resp.versions).sort((a, b) => {
            const aIndex = displayOrder.indexOf(a);
            const bIndex = displayOrder.indexOf(b);

            return (aIndex === -1 ? Infinity : aIndex) -
                (bIndex === -1 ? Infinity : bIndex);
        });

    } catch (e) {
        console.error(`Had an exception fetching updates: ${e}`);

        return resp;
    }

    console.log(`Fetched ${Object.values(resp.versions).flat().length} updates, under ${resp.versionNames.length} types`);

    return resp
}