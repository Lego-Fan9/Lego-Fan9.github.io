import styled from "styled-components";
import { useEffect, useState, useRef } from "react";

import type { LocBundleContext, LocVersion } from "../ts/loc-bundle/context.ts";
import type { LocDiff } from "../ts/loc-bundle/loader.ts";
import { LocBundleCtx, getEmptyVersion } from "../ts/loc-bundle/context.ts";
import { getLocalVersions } from "../ts/loc-bundle/getVersions.ts";

import { Page, Card, CardRow } from "../components/loc-bundle/page.tsx";
import VersionSelect from "../components/loc-bundle/version-select.tsx";
import DiffView from "../components/loc-bundle/diff-view.tsx";

export default function LocBundle() {
    const [versions, setVersions] = useState<LocVersion[]>([]);
    let oldVerRef = useRef(getEmptyVersion());
    let newVerRef = useRef(getEmptyVersion());
    let locDiff = useRef<LocDiff>({
        inFile1Not2: {},
        inFile2Not1: {},
        inBothButDiff: {}
    })

    const diffListeners = useRef(new Set<() => void>());
    const subscribe = (cb: () => void) => {
        diffListeners.current.add(cb);

        return () => {
            diffListeners.current.delete(cb);
        };
    };

    const notify = () => {
        for (const cb of diffListeners.current) {
            cb();
        }
    };

    useEffect(() => {
        async function loadVer() {
            const data = await getLocalVersions();
            setVersions(data);

            newVerRef.current = data[0];
            for (const ver of data) {
                if (ver.includeInOld === true) {
                    oldVerRef.current = ver;
                    break;
                }
            }
        }

        loadVer();
    }, []);

    let ctx: LocBundleContext = {
        LocVersions: versions,
        SelectedVersionOld: oldVerRef,
        SelectedVersionNew: newVerRef,
        Diff: locDiff,
        subscribe: subscribe,
        notify: notify,
    }

    const [showAll, setShowAll] = useState(false);

    const showAllSetter = () => {
        setShowAll(true);
    };

    return (
        <LocBundleCtx.Provider value={ctx}>
            <Page>
                <Card>
                    <CardRow>
                        <h2 style={{ color: "var(--text-dark)" }}>SWGoH Localization Bundle Parser</h2>
                    </CardRow>
                </Card>
                <Card>
                    <CardRow>
                        <Paragraph>
                            This tool downloads and parses SWGoH localization bundles. Localization bundles are files that store all in-game text and enable translation across different languages.
                        </Paragraph>
                    </CardRow>
                </Card>
                <VersionSelect onAdd={showAllSetter} />

                {showAll && (
                    <DiffView />
                )}
            </Page>
        </LocBundleCtx.Provider>
    )
}

const Paragraph = styled.p`
    color: var(--text-dark);
    max-width: 60%;
`;