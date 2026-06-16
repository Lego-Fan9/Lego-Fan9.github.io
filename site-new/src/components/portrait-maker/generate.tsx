import { useEffect, useSyncExternalStore } from "react"

//import domtoimage from "dom-to-image";

import { usePortraitMakerCtx } from "../../ts/portrait-maker/context.ts";

import type { SwgohPortraitOpts } from "../swgohPortrait.tsx";

import { Card, CardRow } from "./card.tsx";

type GenerateButtonProps = {
    onAdd: () => void;
};

export default function GenerateButton({ onAdd }: GenerateButtonProps) {
    const ctx = usePortraitMakerCtx();

    const version = useSyncExternalStore(
        ctx.subscribe,
        () => ctx.versionRef.current
    );

    useEffect(() => {
        const opts: SwgohPortraitOpts = {
            isGL: ctx.isGL.current,
            alignment: ctx.alignment.current,
            relic: ctx.relic.current,
            imageUrl: ctx.imageUrl.current,
            zetas: ctx.zetas.current,
            omis: ctx.omis.current,
            zoom: ctx.zoom.current,
            offsetX: ctx.offsetX.current,
            offsetY: ctx.offsetY.current,
        };

        ctx.setRenderContent(opts);
    }, [version]);

    /*useEffect(() => {
        console.log("Got render ready")

        async function render() {
            if (!ctx.renderRef.current || !ctx.canvasRef.current) return

            const png = await domtoimage.toPng(ctx.renderRef.current)

            const img = new Image();
            img.src = png;

            await new Promise(resolve => {
                img.onload = resolve;
            });

            ctx.canvasRef.current.width = img.width;
            ctx.canvasRef.current.height = img.height;
            let canvasCtx = ctx.canvasRef.current.getContext('2d');
            canvasCtx?.clearRect(0, 0, ctx.canvasRef.current.width, ctx.canvasRef.current.height);
            canvasCtx?.drawImage(img, 0, 0);
        }

        render();
    }, [ctx.notifyReadyVersion])*/

    function onClick() {
        onAdd();
        console.log(ctx)
    }

    return (
        <Card>
            <CardRow>
                <button className="common-button" onClick={() => onClick()}>Generate</button>
            </CardRow>
        </Card>
    )
}