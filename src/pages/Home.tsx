import styled from "styled-components";

export default function Home() {
    function redirect() {
        const newUrl = new URL(window.location.pathname + window.location.search, "https://CobbFan9.github.io");
        window.location.assign(newUrl);
    }

    return (
        <Page>
            <Card>
                <CardRow>
                    <h1 style={{ color: "var(--text-dark)" }}>We have moved!</h1>
                    <p style={{ color: "var(--text-dark)" }}>This site has been relocated to <a href="https://CobbFan9.github.io" target="_blank" rel="noopener noreferrer">CobbFan9.github.io</a> please use the new site!</p>
                    <button className="common-button" onClick={() => redirect()}>Go to the new site!</button>
                </CardRow>
            </Card>
        </Page>
    )
}

export const Page = styled.div`
    padding-top: 7px;
    min-height: 50dvh;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;

    @media (max-width: 768px) {
        min-height: 100dvh;
    }
`;

export const Card = styled.div`
    background: var(--card-background-dark);
    border: 2px solid var(--border-dark);
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    padding: 30px 24px 24px;
    width: 80%;
    height: fit-content;

    display: inline-flex;
    flex-direction: column;
    align-items: stretch;
    gap: 16px;

    transition: box-shadow 0.2s, border-color 0.2s;

    &:hover {
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.13);
        border-color: var(--border-hover-dark);
    }
`;

export const CardRow = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;