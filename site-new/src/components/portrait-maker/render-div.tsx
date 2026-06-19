import styled, { css } from "styled-components";

import { usePortraitMakerCtx } from "../../ts/portrait-maker/context.ts";

import SwgohPortrait from "../swgohPortrait.tsx";

export default function Renderer() {
    const ctx = usePortraitMakerCtx();

    return (
        <RenderContainerParent>
            <RenderContainer $visible={ctx.debugMode}>
                {ctx.renderContent && (
                    <div ref={ctx.renderRef}>
                        <SwgohPortrait opts={ctx.renderContent} onReady={ctx.notifyReady} />
                    </div>
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
    left:-9999px;
    top:-9999px;

    ${({ $visible }) =>
        $visible &&
        css`
        position: relative;
        left: 0px;
        top: 0px;
    `}
`;