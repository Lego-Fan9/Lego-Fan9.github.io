import { useEffect } from "react"

//import domtoimage from "dom-to-image";

import { usePortraitMakerCtx } from "../../ts/portrait-maker/context.ts";

import type { SwgohPortraitOpts } from "../swgohPortrait.tsx";

import { Card, CardRow } from "./card.tsx";

type GenerateButtonProps = {
    onAdd: () => void;
};

export default function GenerateButton({ onAdd }: GenerateButtonProps) {
    const ctx = usePortraitMakerCtx();

    useEffect(() => {
        const opts: SwgohPortraitOpts = {
            isGL: ctx.isGL,
            alignment: ctx.alignment,
            relic: ctx.relic,
            imageUrl: ctx.imageUrl,
            zetas: ctx.zetas,
            omis: ctx.omis,
            zoom: ctx.zoom,
            offsetX: ctx.offsetX,
            offsetY: ctx.offsetY,
        };

        ctx.setRenderContent(opts);
    }, [
        ctx.isGL,
        ctx.alignment,
        ctx.relic,
        ctx.imageUrl,
        ctx.zetas,
        ctx.omis,
        ctx.zoom,
        ctx.offsetX,
        ctx.offsetY,
    ]);

    function onClick() {
        onAdd();
    }

    return (
        <Card>
            <CardRow>
                <button className="common-button" onClick={() => onClick()}>Generate</button>
            </CardRow>
        </Card>
    )
}