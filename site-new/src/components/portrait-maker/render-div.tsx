import styled from "styled-components";

import { usePortraitMakerCtx, useBooleanCtx } from "../../ts/portrait-maker/context.ts";

import SwgohPortrait from "../swgohPortrait.tsx";

export default function Renderer() {
    const ctx = usePortraitMakerCtx();

    return (
        <RenderContainerParent>
            <RenderContainer ref={ctx.renderRef} $visible={ctx.debugMode}>
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

`;