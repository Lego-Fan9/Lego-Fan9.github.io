import type { LocVersion } from "./context.ts";

import decodeBrotli from "./brotli/wrapper.ts";

export async function Load(ver1: LocVersion, ver2: LocVersion): Promise<LocDiff> {
    const file1 = await DownloadLocFile(ver1.url);
    const file2 = await DownloadLocFile(ver2.url);

    return diffLocFiles(file1, file2);
}

export type LocFile = {
    version: string;
    data: Record<string, string>;
}

export type LocDiff = {
    inFile1Not2: Record<string, string>;
    inFile2Not1: Record<string, string>;
    inBothButDiff: Record<string, LocChanged>;
}

export type LocChanged = {
    file1: string;
    file2: string;
}

export async function DownloadLocFile(url: string): Promise<LocFile> {
    const resp = await fetch(url);

    if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
    }

    if (url.includes(".json.br")) {
        const arrayBuffer = await resp.arrayBuffer();
        const toMarshal = decodeBrotli(arrayBuffer);
        return JSON.parse(toMarshal) as LocFile;
    } else {
        return await resp.json() as LocFile;
    }
}

function diffLocFiles(file1: LocFile, file2: LocFile): LocDiff {
    const start = performance.now();

    const inFile1Not2: Record<string, string> = {};
    const inFile2Not1: Record<string, string> = {};
    const inBothButDiff: Record<string, LocChanged> = {};

    const data1 = file1.data;
    const data2 = file2.data;

    for (const key in data1) {
        if (!(key in data2)) {
            inFile1Not2[key] = data1[key];
        } else if (data1[key] !== data2[key]) {
            inBothButDiff[key] = {
                file1: data1[key],
                file2: data2[key],
            };
        }
    }

    for (const key in data2) {
        if (!(key in data1)) {
            inFile2Not1[key] = data2[key];
        }
    }

    const end = performance.now();
    console.log(`Diff took ${(end - start).toFixed(3)} ms`);

    return {
        inFile1Not2,
        inFile2Not1,
        inBothButDiff,
    };
}