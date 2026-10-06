import styled from "styled-components";

export default function NotFound() {
    return (
        <Page>
            <h1>Uh oh... this page doesn't exist</h1>
        </Page>
    )
}

const Page = styled.div`
    max-width: 800px;
    margin: 40px auto;
    padding: 32px;

    background-color: var(--card-background-dark);
    border: 1px solid var(--border-card-dark);
    border-radius: 12px;

    color: var(--text-dark);
    text-align: left;
    line-height: 1.7;

    p {
        margin: 0 0 20px;
    }

    ul {
        margin: 24px 0;
        padding-left: 24px;
    }

    li {
        margin-bottom: 16px;
        color: var(--text-secondary-dark);
    }

    a {
        color: var(--text-dark);
        font-weight: bold;
        text-decoration: none;
        margin-right: 8px;

        &:hover {
            text-decoration: underline;
        }
    }

    @media (max-width: 768px) {
        margin: 20px;
        padding: 24px;
    }
`;