import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import styled from "styled-components";

import Navbar from "./components/navbar.tsx";
import Footer from "./components/footer.tsx";

import Home from "./pages/home.tsx";
import About from "./pages/about.tsx";
import SWGoHUpdates from "./pages/swgoh-updates.tsx";
import PortraitMaker from "./pages/portrait-maker.tsx";
import LocBundle from "./pages/loc-bundle.tsx";
import Terms from "./pages/terms.tsx";
import AssetExtractorWeb from "./pages/asset-extractor-web.tsx";

export default function App() {
	return (
		<Layout>
			<Router>
				<Navbar />

				<Main>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
						<Route path="/swgoh-updates" element={<SWGoHUpdates />} />
						<Route path="/swgoh-portrait-maker" element={<PortraitMaker />} />
						<Route path="/loc-bundle-format" element={<LocBundle />} />
						<Route path="/terms" element={<Terms />} />
						<Route path="/asset-extractor-web" element={<AssetExtractorWeb />} />

						<Route path="/swgoh-updates/loc-bundle-format" element={<Navigate to="/loc-bundle-format" replace />} />
					</Routes>
				</Main>

				<Footer />
			</Router>
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