import styled from "styled-components";

import Navbar from "./components/navbar";
import Footer from "./components/footer";

import Home from "./pages/Home";

export default function App() {
    return (
        <Layout>
            <Navbar />

            <Main>
                <Home />
            </Main>

            <Footer />
        </Layout>
    )
}

const Layout = styled.div`
	min-height: 100dvh;
    display: flex;
    flex-direction: column;
`;

const Main = styled.main`
    flex: 1;
`;