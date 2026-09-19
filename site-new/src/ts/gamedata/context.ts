import type { RefObject } from "react";
import { createContext, useContext } from "react";

export let GamedataCtx = createContext<GamedataContext | undefined>(undefined);

export type GamedataContext = {
    GamedataVersions: GamedataVersion[];

    SelectedVersionOld: RefObject<GamedataVersion>;
    SelectedVersionNew: RefObject<GamedataVersion>;

    SelectedFile: RefObject<string>;

    WindowState: WindowState;
}

export function useGamedataContext() {
    const ctx = useContext(GamedataCtx);

    if (!ctx) {
        throw new Error(
            "useGamedataCtx must be used within GamedataProvider"
        );
    }

    return ctx;
}

export type GamedataVersion = {
    repoOwner: string;
    repoName: string;
    commitHash: string;
    date: string;
    version: string;
    url: string;
    includeInOld: boolean;
}

export function getEmptyVersion(): GamedataVersion {
    return {
        repoOwner: "loading",
        repoName: "loading",
        commitHash: "loading",
        date: "loading",
        version: "loading",
        url: "",
        includeInOld: true,
    }
}

export enum WindowState {
    WindowState_NeedFileSelect,
    WindowState_NeedVersionSelect,
    WindowState_FullDisplay
}