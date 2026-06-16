import styled from "styled-components";

import { usePortraitMakerCtx, useBooleanCtx } from "../../ts/portrait-maker/context.ts";

import SwgohPortrait from "../swgohPortrait.tsx";

export default function Renderer() {
    const ctx = usePortraitMakerCtx();

    const debugMode = useBooleanCtx(ctx.debugMode, ctx.subscribe);

    return (
        <RenderContainerParent>
            <RenderContainer ref={ctx.renderRef} $visible={debugMode}>
                {ctx.renderContent && (
                    <SwgohPortrait opts={ctx.renderContent} onReady={ctx.notifyReady} />
                )}
            </RenderContainer>
        </RenderContainerParent>
    )
}

const RenderContainerParent = styled.div`
    position: relative;
`;

const RenderContainer = styled.div<{ $visible: boolean }>`
    position: absolute;
    left: -9999px;
    top: -9999px;

    ${({ $visible }) => $visible && `
        position: relative;
        left: 0%;
        top: 50%;
    `}
`;