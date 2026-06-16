import type { LocVersion } from "./context.ts";

const commitsToIgnore: string[] = ["Dd3CijBEQ3KS6PSznNzAlg", "remove"]

export async function getLocalVersions(): Promise<LocVersion[]> {
    let resp: LocVersion[] = [];

    resp.push(await getLatest());

    resp.push(...await getGitRepoCommitLogsNew());

    resp.push(...await getGitRepoCommitLogsOld());

    // This is complicated because I wanted to preserve older, but deduplication is needed
    const byVersion = new Map<string, LocVersion>();
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

async function getGitRepoCommitLogsOld(): Promise<LocVersion[]> {
    const url = "https://api.github.com/repos/swgoh-utils/gamedata/commits?path=Loc_ENG_US.txt.json"

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

    let resp: LocVersion[] = []

    for (const commit of respJson) {
        let working: LocVersion = {
            repoName: "gamedata",
            repoOwner: "swgoh-utils",
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

                working.url = `https://raw.githubusercontent.com/swgoh-utils/gamedata/${working.commitHash}/Loc_ENG_US.txt.json`;

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

async function getLatest(): Promise<LocVersion> {
    let resp: LocVersion = {
        repoOwner: "latest",
        repoName: "latest",
        commitHash: "latest",
        version: "Latest",
        date: "",
        url: "https://raw.githubusercontent.com/Lego-Fan9/lego-fan9.github.io-storage/main/Loc_ENG_US.txt.json.br",
        includeInOld: false
    }

    let respJson

    try {
        const response = await fetch("https://api.github.com/repos/Lego-Fan9/lego-fan9.github.io-storage/commits?path=Loc_ENG_US.txt.json.br")
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

async function getGitRepoCommitLogsNew(): Promise<LocVersion[]> {
    const url = "https://api.github.com/repos/Lego-Fan9/lego-fan9.github.io-storage/commits?path=Loc_ENG_US.txt.json.br"

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

    let resp: LocVersion[] = []

    let firstChildMarker = true;

    for (const commit of respJson) {
        let working: LocVersion = {
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
                }

                working.url = `https://raw.githubusercontent.com/Lego-Fan9/lego-fan9.github.io-storage/${working.commitHash}/Loc_ENG_US.txt.json.br`

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
