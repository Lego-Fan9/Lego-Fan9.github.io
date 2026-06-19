import styled from "styled-components";

import { usePortraitMakerCtx } from "../../ts/portrait-maker/context.ts";

import HelpBtn from "../help-btn.tsx";
import { Card, CardRow } from "./card.tsx"

export default function UploadImage() {
    return (
        <Card>
            <UploadFile />
            <UploadSWGoHAsset />
            <UploadUrl />
        </Card>
    );
}

function UploadFile() {
    const ctx = usePortraitMakerCtx();

    function onFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files == null || e.target.files.length < 1) return;
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (event) {
            if (!event.target || typeof event.target.result !== "string") {
                console.error(`Invalid imageUrl onload`)
            }

            ctx.setImageUrl(event.target?.result as string);
        };

        reader.readAsDataURL(file);
    }

    return (
        <CardRow>
            <label htmlFor="upload" className="common-button">Choose Image</label>
            <input type="file" id="upload" accept="image/*" style={{ display: "none" }} onChange={onFileUpload}></input>
        </CardRow>
    );
}

function UploadSWGoHAsset() {
    return (
        <CardRow>
            <InputLabel htmlFor="loadSwgohAsset">SWGoH Asset:</InputLabel>
            <InputImageSpan>
                <select id="loadSwgohAsset" className="common-button">
                    <option>Click to load options...</option>
                </select>
                <HelpBtn text="Download a SWGoH Asset. Limited, may be slow." />
            </InputImageSpan>
            <button id="loadSwgohAssetBtn" className="common-button">Load SWGoH Asset</button>
        </CardRow>
    )
}

const InputLabel = styled.label`
    margin-right: 7px;
    font-weight: 600;
    margin-bottom: 4px;
    color: var(--text-dark);
    letter-spacing: 0.01em;
`;

const InputImageSpan = styled.span`
    display: inline-flex;
    align-items: center;
    position: relative;
    gap: 4px;
    border-radius: 8px;
    padding: 2px 6px 2px 2px;

    @media (max-width: 600px) {
        width: 80%;
    }

    input[type="text"],
    input[type="number"],
    select {
        padding: 10px 14px;

        border: 2px solid var(--button-hover);
        border-radius: 6px;

        background: var(--card-background-dark);
        color: var(--text-dark);

        font-size: 16px;
        outline: none;

        transition: border-color 0.2s, box-shadow 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);

        margin: 6px 0;
    }

    input[type="text"]:focus,
    input[type="number"]:focus,
    select:focus {
        box-shadow: 0 0 0 2px var(--button-hover);
    }

    select {
        width: 225.6px;
        height: 41.6px;
    }

    @media (max-width: 600px) {
        input[type="text"],
        input[type="number"],
        select {
            width: 100%;
            box-sizing: border-box;
        }
    }
`;

function UploadUrl() {
    return (
        <CardRow>
            <InputLabel htmlFor="urlInput">Image URL:</InputLabel>
            <InputImageSpan>
                <input type="text" id="urlInput" placeholder="https://example.com/image.png" />
                <HelpBtn text="Enter a direct link to an image (ending in .png, .jpg, etc)." />
            </InputImageSpan>
            <button id="loadUrlBtn" className="common-button">Load from URL</button>
        </CardRow>
    )
}