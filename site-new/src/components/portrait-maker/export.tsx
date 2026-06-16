import styled from "styled-components";

//import { usePortraitMakerCtx } from "../../ts/portrait-maker/context.ts";

import { Card, CardRow } from "./card.tsx";

export default function Export() {
    return (
        <Card>
            <CardRow>
                <Container>
                    <ContainerItem className="common-button">Export for PC</ContainerItem>
                    <ContainerItem className="common-button">Export for Mobile</ContainerItem>
                </Container>
            </CardRow>
        </Card>
    )
}

const Container = styled.div`
    display: flex;
    gap: 10px;
    justify-content: center;
    margin: 20px auto;
`;

const ContainerItem = styled.button`
    height: 50px;
    width: 140px;
    justify-content: center;
    align-items: center;
    display: flex;
`;