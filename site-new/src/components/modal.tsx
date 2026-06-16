import type { ReactNode } from "react";
import { useEffect } from "react";
import styled from "styled-components";

interface ModalProps {
    children: ReactNode;
    onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <Overlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <CloseButton onClick={onClose}>
                    ✕
                </CloseButton>

                {children}
            </ModalContent>
        </Overlay>
    );
}

const Overlay = styled.div`
    position: fixed;
    inset: 0;

    background: rgba(0, 0, 0, 0.7);

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 1000;
`;

const ModalContent = styled.div`
    position: relative;

    width: min(900px, 90dvw);
    max-height: 90dvh;

    overflow-y: auto;

    background: var(--card-background-dark);
    border: 2px solid var(--border-dark);
    border-radius: 8px;

    padding: 10px;

    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

const CloseButton = styled.button`
    position: absolute;

    top: 12px;
    right: 12px;

    width: 32px;
    height: 32px;

    border: none;
    border-radius: 50%;

    background: transparent;
    color: var(--text-dark);

    cursor: pointer;
    font-size: 18px;
    font-weight: bold;

    &:hover {
        background: var(--button-hover);
    }
`;