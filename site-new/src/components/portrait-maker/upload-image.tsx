import styled from "styled-components";
import { useState, useEffect } from "react";

import { usePortraitMakerCtx } from "../../ts/portrait-maker/context.ts";
import { GetAssetVersionGithub } from "../../ts/portrait-maker/assetVersion.ts"

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
    const ctx = usePortraitMakerCtx();

    type ButtonStatus = "idle" | "loading" | "loaded" | "failed";
    const buttonText = {
        idle: "Load SWGoH Asset",
        loading: "Loading...",
        loaded: "Loaded!",
        failed: "Failed!",
    };

    const AEURL = "https://legofan-swgoh-ae2.onrender.com";

    const [assets, setAssets] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState("");
    const [buttonStatus, setButtonStatus] = useState<ButtonStatus>("idle");

    useEffect(() => {
        const wakeAE = async () => {
            const assetVersion = await GetAssetVersionGithub();
            fetch(`${AEURL}/Asset/list?version=${assetVersion}`);
        }

        wakeAE();
    }, []);

    const handleFocus = async () => {
        if (loaded || loading) return;

        setLoading(true);

        try {
            const assetVersion = await GetAssetVersionGithub();
            const response = await fetch(`${AEURL}/Asset/list?version=${assetVersion}`);
            const data = await response.json();

            setAssets(data);
            setLoaded(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (selectedAsset === "") {
            alert("Please select an asset to download first...");
            return;
        }

        setButtonStatus("loading");

        try {
            const assetVersion = await GetAssetVersionGithub();
            const response = await fetch(`${AEURL}/Asset/single?version=${assetVersion}&assetName=${selectedAsset}`);
            if (!response.ok) {
                throw new Error(`Invalid status ${response.status}`);
            }
            const data = await response.blob();
            const reader = new FileReader();
            reader.onload = function (event) {
                if (!event.target || typeof event.target.result !== "string") {
                    console.error(`Invalid imageUrl onload`)
                }

                ctx.setImageUrl(event.target?.result as string);
            };

            reader.readAsDataURL(data);

            setButtonStatus("loaded");
            setTimeout(() => { setButtonStatus("idle") }, 2000);
        } catch (error) {
            console.error(error);
            setButtonStatus("failed");
            setTimeout(() => { setButtonStatus("idle") }, 2000);
        }
    }

    return (
        <CardRow>
            <InputLabel htmlFor="loadSwgohAsset">SWGoH Asset:</InputLabel>
            <InputImageSpan>
                <select id="loadSwgohAsset" className="common-button" onFocus={handleFocus} onChange={(e) => setSelectedAsset(e.target.value)}>
                    {loading ? (
                        <option>Loading...</option>
                    ) : assets.length === 0 ? (
                        <option>Click to load options...</option>
                    ) : (
                        assets.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))
                    )}
                </select>
                <HelpBtn text="Download a SWGoH Asset. Limited, may be slow." />
            </InputImageSpan>
            <button id="loadSwgohAssetBtn" className={`common-button ${buttonStatus}`} onClick={handleDownload} disabled={buttonStatus === "loading"}>{buttonText[buttonStatus]}</button>
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
    const ctx = usePortraitMakerCtx();

    type ButtonStatus = "idle" | "loading" | "loaded" | "failed";
    const buttonText = {
        idle: "Load URL Image",
        loading: "Loading...",
        loaded: "Loaded!",
        failed: "Failed!",
    };

    const [buttonStatus, setButtonStatus] = useState<ButtonStatus>("idle");
    const [inputUrl, setInputUrl] = useState("")

    const handleDownload = async () => {
        if (inputUrl === "") {
            alert("Please select an asset to download first...");
            return;
        }

        setButtonStatus("loading");

        try {
            const response = await fetch(`https://swgoh-assets.lego-fan9.workers.dev/proxy?url=${inputUrl}`);
            if (!response.ok) {
                throw new Error(`Invalid status ${response.status}`);
            }
            const data = await response.blob();
            const reader = new FileReader();
            reader.onload = function (event) {
                if (!event.target || typeof event.target.result !== "string") {
                    console.error(`Invalid imageUrl onload`)
                }

                ctx.setImageUrl(event.target?.result as string);
            };

            reader.readAsDataURL(data);

            setButtonStatus("loaded");
            setTimeout(() => { setButtonStatus("idle") }, 2000);
        } catch (error) {
            console.error(error);
            setButtonStatus("failed");
            setTimeout(() => { setButtonStatus("idle") }, 8000);
        }
    }

    return (
        <CardRow>
            <InputLabel htmlFor="urlInput">Image URL:</InputLabel>
            <InputImageSpan>
                <input type="text" id="urlInput" placeholder="https://example.com/image.png" onChange={(e) => setInputUrl(e.target.value)} />
                <HelpBtn text="Enter a direct link to an image (ending in .png, .jpg, etc)." />
            </InputImageSpan>
            <button className={`common-button ${buttonStatus}`} onClick={handleDownload} disabled={buttonStatus === "loading"}>{buttonText[buttonStatus]}</button>
        </CardRow>
    )
}