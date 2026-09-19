import type { GamedataVersion } from "./context.ts";

export async function getGamedataVersions(filename: string): Promise<GamedataVersion[]> {
    let resp: GamedataVersion[] = [];

    resp.push(await getLatest(filename));

    resp.push(...await getGitRepoCommitLogs(filename));

    const byVersion = new Map<string, GamedataVersion>();
    for (const version of resp) {
        const existing = byVersion.get(version.version);
        if (
            !existing ||
            new Date(version.date) < new Date(existing.date)
        ) {
            byVersion.set(version.version, version);
        }
    }

    return [...byVersion.values()];
}

async function getLatest(filename: string): Promise<GamedataVersion> {
    let resp: GamedataVersion = {
        repoOwner: "latest",
        repoName: "latest",
        commitHash: "latest",
        version: "Latest",
        date: "",
        url: `https://raw.githubusercontent.com/Lego-Fan9/lego-fan9.github.io-storage/main/${filename}`,
        includeInOld: false
    }

    let respJson

    try {
        const response = await fetch(`https://api.github.com/repos/Lego-Fan9/lego-fan9.github.io-storage/commits?path=${filename}`)
        if (!response.ok) {
            console.error(`Failed to get versions: ${response.status}: ${response.text}`);
            return resp;
        }

        respJson = await response.json()
    } catch (e) {
        console.error(`Failed to get gitRepoCommitLogs: ${e}`);
        return resp;;
    }

    resp.date = respJson[0]?.commit?.committer?.date;

    return resp;
}

const commitsToIgnore: string[] = []

async function getGitRepoCommitLogs(filename: string): Promise<GamedataVersion[]> {
    const url = `https://api.github.com/repos/Lego-Fan9/lego-fan9.github.io-storage/commits?path=${filename}`

    let respJson

    try {
        const response = await fetch(url)
        if (!response.ok) {
            console.error(`Failed to get versions: ${response.status}: ${response.text}`);
            return [];
        }

        respJson = await response.json()
    } catch (e) {
        console.error(`Failed to get gitRepoCommitLogs: ${e}`);
        return [];
    }

    let resp: GamedataVersion[] = []

    let firstChildMarker = true;

    for (const commit of respJson) {
        let working: GamedataVersion = {
            repoName: "lego-fan9.github.io-storage",
            repoOwner: "Lego-Fan9",
            commitHash: "",
            date: "",
            version: "",
            url: "",
            includeInOld: true,
        }

        if (commit.commit != null) {
            if (commit.commit.message != null && commit.commit.committer != null && commit.commit.committer.date != null) {
                working.commitHash = commit.sha;
                working.date = commit.commit.committer.date;
                working.version = commit.commit.message;
                if (commitsToIgnore.some(ignore => commit.commit.message.includes(ignore))) {
                    continue;
                }

                if (firstChildMarker === true) {
                    working.includeInOld = false;
                    firstChildMarker = false;
                }

                working.url = `https://raw.githubusercontent.com/Lego-Fan9/lego-fan9.github.io-storage/${working.commitHash}/${filename}`

                resp.push(working);
            } else {
                console.log(commit.commit)
            }
        } else {
            console.log(commit)
        }
    }

    return resp;
}