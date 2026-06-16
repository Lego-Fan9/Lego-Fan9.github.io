import type { RefObject } from "react";
import React from "react";
import { createContext, useContext } from "react";

import type { SwgohPortraitOpts } from "../../components/swgohPortrait.tsx";
import { Alignment } from "../../components/swgohPortrait.tsx";

export let PortraitMakerCtx = createContext<PortraitMakerContext | undefined>(undefined);

export type PortraitMakerContext = {
    isGL: RefObject<boolean>;
    alignment: RefObject<Alignment>;
    relic: RefObject<number>;
    imageUrl: RefObject<string>;
    zetas: RefObject<number>;
    omis: RefObject<number>;
    zoom: RefObject<number>;
    offsetX: RefObject<number>;
    offsetY: RefObject<number>;
    debugMode: RefObject<boolean>;

    canvasRef: RefObject<HTMLCanvasElement | null>;
    canvasCtxRef: RefObject<CanvasRenderingContext2D | null>;
    renderRef: RefObject<HTMLDivElement | null>;

    renderContent: SwgohPortraitOpts | null;
    setRenderContent: (opts: SwgohPortraitOpts) => void;

    subscribe: (cb: () => void) => () => void;
    notify: () => void;

    versionRef: RefObject<number>;

    notifyReady: () => void;
}

export function usePortraitMakerCtx() {
    const ctx = useContext(PortraitMakerCtx);

    if (!ctx) {
        throw new Error(
            "usePortraitMakerCtx must be used within PortraitMakerProvider"
        );
    }

    return ctx;
}

export const useBooleanCtx = (ref: RefObject<boolean>, subscribe: (cb: () => void) => () => void) => {
    return React.useSyncExternalStore(
        subscribe,
        () => ref.current!
    );
};

export const useNumberCtx = (ref: RefObject<number>, subscribe: (cb: () => void) => () => void) => {
    return React.useSyncExternalStore(
        subscribe,
        () => ref.current!
    );
};

export const useStringCtx = (ref: RefObject<string>, subscribe: (cb: () => void) => () => void) => {
    return React.useSyncExternalStore(
        subscribe,
        () => ref.current!
    );
};

export const useAlignmentCtx = (ref: RefObject<Alignment>, subscribe: (cb: () => void) => () => void) => {
    return React.useSyncExternalStore(
        subscribe,
        () => ref.current!
    );
};
