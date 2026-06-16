import { useRef, useState } from "react";
import styled from "styled-components";

import domtoimage from "dom-to-image";

import type { PortraitMakerContext } from "../ts/portrait-maker/context.ts";
import { PortraitMakerCtx, usePortraitMakerCtx } from "../ts/portrait-maker/context.ts"

import type { SwgohPortraitOpts } from "../components/swgohPortrait.tsx";
import { Alignment } from "../components/swgohPortrait.tsx";

import { Card, CardRow } from "../components/portrait-maker/card.tsx";
import UploadImage from "../components/portrait-maker/upload-image.tsx";
import ConfigurePortrait from "../components/portrait-maker/configure-portrait.tsx";
import GenerateButton from "../components/portrait-maker/generate.tsx";
import CanvasView from "../components/portrait-maker/canvas-view.tsx";
import MovePanel from "../components/portrait-maker/move-panel.tsx";
import Export from "../components/portrait-maker/export.tsx";
import Renderer from "../components/portrait-maker/render-div.tsx";

export default function PortraitMaker() {
    const isGl = useRef(false);
    const alignment = useRef(Alignment.Neutral);
    const relic = useRef(0);
    const imageUrl = useRef("");
    const zetas = useRef(0);
    const omis = useRef(0);
    const zoom = useRef(0);
    const offsetX = useRef(0);
    const offsetY = useRef(0);
    const debugMode = useRef(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
    const renderRef = useRef<HTMLDivElement | null>(null);
    const [renderContent, setRenderContent] = useState<SwgohPortraitOpts | null>(null);
    const versionRef = useRef(0);

    const diffListeners = useRef(new Set<() => void>());
    const subscribe = (cb: () => void) => {
        diffListeners.current.add(cb);

        return () => {
            diffListeners.current.delete(cb);
        };
    };

    const notify = () => {
        versionRef.current++;
        for (const cb of diffListeners.current) {
            cb();
        }
    };

    const renderToCanvas = async () => {
        console.log("Got render ready");

        if (!ctx.renderRef.current || !ctx.canvasRef.current || !ctx.canvasCtxRef.current) return;
        console.log("Doing render");

        const png = await domtoimage.toPng(ctx.renderRef.current);
        console.log(png);

        const img = new Image();
        img.src = png;

        await new Promise(resolve => (img.onload = resolve));

        ctx.canvasRef.current.width = img.width;
        ctx.canvasRef.current.height = img.height;

        ctx.canvasCtxRef.current.clearRect(0, 0, ctx.canvasRef.current.width, ctx.canvasRef.current.height);
        ctx.canvasCtxRef.current.drawImage(img, 0, 0);
        console.log("Finished render")
    };

    const notifyReady = () => {
        renderToCanvas()
    }

    let ctx: PortraitMakerContext = {
        isGL: isGl,
        alignment: alignment,
        relic: relic,
        imageUrl: imageUrl,
        zetas: zetas,
        omis: omis,
        zoom: zoom,
        offsetX: offsetX,
        offsetY: offsetY,
        debugMode: debugMode,
        subscribe: subscribe,
        notify: notify,
        canvasRef: canvasRef,
        canvasCtxRef: canvasCtxRef,
        renderRef: renderRef,
        renderContent: renderContent,
        setRenderContent: setRenderContent,
        versionRef: versionRef,
        notifyReady: notifyReady,
    }

    const [showAll, setShowAll] = useState(false);

    const showAllSetter = () => {
        setShowAll(true);
    };

    return (
        <PortraitMakerCtx.Provider value={ctx}>
            <Page>
                <Card>
                    <CardRow>
                        <h2 style={{ color: "var(--text-dark)" }}>SWGoH Portrait Maker</h2>
                    </CardRow>
                </Card>
                <UploadImage />
                <ConfigurePortrait />
                <GenerateButton onAdd={showAllSetter} />

                {showAll && (
                    <>
                        <CanvasView />
                        <MovePanel />
                        <Export />
                        <DebugMode />
                        <Renderer />
                    </>
                )}

            </Page>
        </PortraitMakerCtx.Provider>
    );
}

const Page = styled.div`
    padding-top: 7px;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
`;

function DebugMode() {
    const ctx = usePortraitMakerCtx();

    function onClick() {
        ctx.debugMode.current = true;
        ctx.notify();
    }

    return (
        <button className="common-button" onClick={() => onClick()}>Debug Mode</button>
    )
}
