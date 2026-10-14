import { useEffect, useState } from "react";
import styled from "styled-components";

import { Page, Card, CardRow } from "../components/update-freq/page"

import type { UpdateFreqContext } from "../ts/update-freq/context";
import { UpdateFreqCtx } from "../ts/update-freq/context";

import type { EventRecord } from "../components/update-freq/grapher";
import GraphLoader from "../components/update-freq/graphLoader";

import GetUpdates from "../ts/update-freq/getUpdates";

export default function UpdateFrequencyPage() {
    const [versions, setVersions] = useState<Record<string, EventRecord[]>>({});
    const [versionNames, setVersionNames] = useState<string[]>([]);

    let ctx: UpdateFreqContext = {
        versionNames,
        setVersionNames,
        versions,
        setVersions,
    }

    useEffect(() => {
        async function getUpdateList() {
            const resp = await GetUpdates()
            ctx.setVersionNames(resp.versionNames);
            ctx.setVersions(resp.versions);
        }

        getUpdateList();
    }, [])
    return (
        <UpdateFreqCtx.Provider value={ctx}>
            <Page>
                <Card>
                    <CardRow>
                        <h2 style={{ color: "var(--text-dark)" }}>SWGoH Update Frequency</h2>
                    </CardRow>
                </Card>
                <Card>
                    <CardRow>
                        <Paragraph>Below are graphs of the timing of SWGoH updates, accurate to about an hour.</Paragraph>
                        <Paragraph>Data is sourced from <a href="/swgoh-updates">SWGoH Updates</a> and updates automatically.</Paragraph>
                    </CardRow>
                </Card>
                <Card>
                    <CardRow>
                        <h3 style={{ color: "var(--text-dark)" }}>The versions have different meanings</h3>
                        <ul>
                            <Li><b>Gamedata Version</b> This is the core version of the game, this is when they bump Asset and Localization versions, add new units, events, activate new features, etc. this changing is what causes your game to restart with updates</Li>
                            <Li><b>Asset Version:</b> The version of the images, character models, scenes, etc. does NOT represent when they are used in game, they add an Asset Version and it needs to populate in the cache, then at the soonest Gamedata Version it updates</Li>
                            <Li><b>Localization Version:</b> This is the version of the text strings you see around the game. You can see what changes here in <a href="/loc-bundle-format">Localization Bundle Parser</a> this usually changes at the same moment as the Gamedata Version</Li>
                            <Li><b>Server Version:</b> This is not fully understood what it does. There is some connection to some Gamedata Version updates though. Changes from this are not usually noteworthy.</Li>
                        </ul>
                    </CardRow>
                </Card>
                
                <GraphLoader />
            </Page>
        </UpdateFreqCtx.Provider>
    )
}

const Paragraph = styled.p`
    color: var(--text-dark);
    max-width: 60%;

    a {
        color: var(--text-dark);
        text-decoration: thickeness;

        &:hover {
            text-decoration: underline;
        }
    }
`;

const Li = styled.li`
    color: var(--text-dark);
    text-align: left;
    margin-bottom: 5px;

    a {
        color: var(--text-dark);

        &:hover {
            text-decoration: underline;
        }
    }
`;