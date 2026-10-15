import { createContext, useContext } from "react";

import type { EventRecord } from "../../components/update-freq/grapher";

export let UpdateFreqCtx = createContext<UpdateFreqContext | undefined>(undefined);

export type UpdateFreqContext = {
    versionNames: string[];
    setVersionNames: React.Dispatch<React.SetStateAction<string[]>>;
    
    versions: Record<string, EventRecord[]>;
    setVersions: React.Dispatch<React.SetStateAction<Record<string, EventRecord[]>>>
}

export function useUpdateFreqCtx() {
    const ctx = useContext(UpdateFreqCtx);

    if (!ctx) {
        throw new Error(
            "useUpdateFreqCtx must be used within UpdateFreqProvider"
        );
    }

    return ctx;
}
