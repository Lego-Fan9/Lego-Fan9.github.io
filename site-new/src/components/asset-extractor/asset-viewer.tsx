import { useEffect, useState } from "react";
import styled from "styled-components";

import { Card, CardRow } from "./page.tsx";
import Modal from "../modal.tsx";

import getBundle from "../../ts/asset-extractor/getBundle.ts";
import openBundle from "../../ts/asset-extractor/openBundle.ts";
import type { ImageType } from "../../ts/asset-extractor/imageType.ts";

export interface AssetViewerPrefs {
    assetVersion: string;
    assetName: string;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AssetViewer({ assetVersion, assetName, setLoading }: AssetViewerPrefs) {
    const [assetBundle, setAssetBundle] = useState<Uint8Array | null>(null);
    const [imageList, setImageList] = useState<ImageType[]>([]);
    const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

    useEffect(() => {
        async function loadBundle() {
            setAssetBundle(await getBundle(assetVersion, assetName));
        }

        loadBundle();

        setSelectedImage(null);
    }, [assetVersion, assetName]);

    useEffect(() => {
        async function loadImages() {
            if (assetBundle === null) {
                console.warn("Tried to load images in image useEffect with null bundle");
            } else {
                setLoading(true);

                const images = await openBundle(assetBundle, assetName);
                setImageList(images);

                setLoading(false);
            }
        }

        loadImages();
    }, [assetBundle]);

    return (
        <>
            <Card>
                <CardRow>
                    {(imageList.length > 0) ? (
                        <ImageGrid>
                            {imageList.map((item, key) => (
                                <ThumbButton key={`${item.name}_${key}`} onClick={() => setSelectedImage(item)}>
                                    <ThumbImg src={item.data} />
                                    <ThumbLabel>{item.name}</ThumbLabel>
                                </ThumbButton>
                            ))}
                        </ImageGrid>
                    ) : (
                        <p style={{ color: "var(--text-dark)" }}>No texture assets in that bundle... try another</p>
                    )}
                </CardRow>
            </Card>

            {selectedImage && (
                <Modal onClose={() => setSelectedImage(null)}>
                    <FullImage src={selectedImage.data} />
                    <p style={{ color: "var(--text-dark)", textAlign: "center" }}>
                        {selectedImage.name}
                    </p>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <a href={selectedImage.data} download={`${selectedImage.name}.png`}
                            className="common-button" style={{ textDecoration: "none" }}>
                            Download PNG
                        </a>
                    </div>
                </Modal>
            )}
        </>
    )
}

const ImageGrid = styled.div`
    width: 100%;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
`;

const ThumbButton = styled.button`
    width: 120px;

    border: none;
    background: transparent;
    padding: 0;

    cursor: pointer;

    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ThumbImg = styled.img`
    width: 100%;
    height: 100px;
    object-fit: cover;

    border-radius: 6px;
    border: 1px solid var(--border-dark);

    transition: transform 0.15s ease;
`;

const ThumbLabel = styled.div`
    font-size: 12px;
    color: var(--text-dark);
    text-align: center;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const FullImage = styled.img`
    max-width: 100%;
    max-height: 80dvh;
    display: block;
    margin: 0 auto;
    object-fit: contain;
`;