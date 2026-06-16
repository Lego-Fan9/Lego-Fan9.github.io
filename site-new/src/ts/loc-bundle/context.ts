import type { RefObject } from "react";
import { createContext, useContext } from "react";

import type { LocDiff } from "./loader.ts";

export let LocBundleCtx = createContext<LocBundleContext | undefined>(undefined);

export type LocBundleContext = {
    LocVersions: LocVersion[];

    SelectedVersionOld: RefObject<LocVersion>;
    SelectedVersionNew: RefObject<LocVersion>;

    Diff: RefObject<LocDiff>;

    subscribe: (cb: () => void) => () => void;
    notify: () => void;
}

export function useLocBundleContext() {
    const ctx = useContext(LocBundleCtx);

    if (!ctx) {
        throw new Error(
            "useLocBundleCtx must be used within LocBundleProvider"
        );
    }

    return ctx;
}

export type LocVersion = {
    repoOwner: string;
    repoName: string;
    commitHash: string;
    date: string;
    version: string;
    url: string;
    includeInOld: boolean;
}

export function getEmptyVersion(): LocVersion {
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