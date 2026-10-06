import { useState } from "react";
import styled from "styled-components";

export interface HelpBtnPrefs {
    text: string;
}

export default function HelpBtn({ text }: HelpBtnPrefs) {
    const [open, setOpen] = useState(false);

    const toggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen((v) => !v);
    };

    return (
        <HelpWrapper onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <HelpBtnInner type="button" tabIndex={0} onClick={toggle}>?</HelpBtnInner>
            {open && <HelpTooltip>{text}</HelpTooltip>}
        </HelpWrapper>
    )
}

const HelpBtnInner = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    margin-left: 6px;
    border-radius: 50%;
    border: 2px solid var(--button-hover);
    background: var(--button);
    color: white;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    padding: 0;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;

    &:hover,
    &:focus {
        background: var(--button-hover);
        box-shadow: 0 0 0 2px black;
    }
`;

const HelpTooltip = styled.span`
    position: absolute;
    right: 110%;
    top: 50%;
    transform: translateY(-50%);
    background: var(--card-background-dark);
    color: #fff;
    border: 2px solid var(--button-hover);
    border-radius: 6px;
    padding: 10px 14px;
    font-size: 14px;
    min-width: 200px;
    max-width: 200px;
    z-index: 100;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    white-space: normal;
`;

const HelpWrapper = styled.div`
    position: relative;
    display: inline-flex;
`;