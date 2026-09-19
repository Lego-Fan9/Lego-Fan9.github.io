import styled from "styled-components";
import { useEffect, useState, useRef } from "react";

import type { GamedataContext, GamedataVersion } from "../ts/gamedata/context.ts";
import { GamedataCtx, getEmptyVersion, WindowState } from "../ts/gamedata/context.ts";
import { getGamedataVersions } from "../ts/gamedata/getVersions.ts";

export default function GamedataDiffPage() {
    const [versions, setVersions] = useState<GamedataVersion[]>([]);
    let oldVerRef = useRef(getEmptyVersion());
    let newVerRef = useRef(getEmptyVersion());
    let selectedFileRef = useRef("");

    useEffect(() => {
        async function loadVer() {
            const data = await getGamedataVersions(selectedFileRef.current);
            setVersions(data);

            newVerRef.current = data[0];
            for (const ver of data) {
                if (ver.includeInOld === true) {
                    oldVerRef.current = ver;
                    break;
                }
            }
        }

        if (selectedFileRef.current) {
            loadVer();
        }
    }, [selectedFileRef.current]);

    const [windowState, setWindowState] = useState<WindowState>(WindowState.WindowState_NeedFileSelect)

    let ctx: GamedataContext = {
        GamedataVersions: versions,
        SelectedVersionOld: oldVerRef,
        SelectedVersionNew: newVerRef,
        SelectedFile: selectedFileRef,
        WindowState: windowState,
    }

    return (
        <GamedataCtx.Provider value={ctx}>

        </GamedataCtx.Provider>
    )
}