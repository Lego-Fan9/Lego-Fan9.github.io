import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { Card, CardRow } from "./page.tsx";

export default function LoadingAssets() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        setSeconds(0);

        const interval = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Overlay>
            <Modal>
                <Spinner />

                <Card>
                    <CardRow>
                        <Title>Loading assets</Title>

                        <Subtitle>
                            Fetching your data. This may take a moment...
                        </Subtitle>

                        <Timer>
                            {formatTime(seconds)}
                        </Timer>
                    </CardRow>
                </Card>
            </Modal>
        </Overlay>
    );
}

function formatTime(totalSeconds: number) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;

    if (m === 0) return `${s}s`;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
}

const Timer = styled.div`
    margin-top: 8px;
    font-size: 13px;
    color: var(--text-secondary-dark);
`;

const fadeIn = keyframes`
    from { opacity: 0; transform: scale(0.98); }
    to { opacity: 1; transform: scale(1); }
`;

const spin = keyframes`
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
`;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(6px);
`;

const Modal = styled.div`
    width: min(420px, 90vw);
    padding: 24px;
    border-radius: 12px;

    background: var(--card-background-dark);
    border: 1px solid var(--border-dark);

    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);

    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    animation: ${fadeIn} 0.18s ease-out;
`;

const Spinner = styled.div`
    width: 42px;
    height: 42px;
    border-radius: 50%;

    border: 3px solid var(--border-dark);
    border-top: 3px solid var(--text-dark);

    animation: ${spin} 0.9s linear infinite;
`;

const Title = styled.h2`
    margin: 0;
    color: var(--text-dark);
    font-size: 18px;
    font-weight: 600;
`;

const Subtitle = styled.p`
    margin: 6px 0 0;
    color: var(--text-secondary-dark);
    font-size: 14px;
    line-height: 1.4;
    text-align: center;
`;