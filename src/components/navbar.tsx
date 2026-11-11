import styled from "styled-components";

export default function NavBar() {

    return (
        <Nav>
            <NavContainer>
                <Logo>SWGoH Updates</Logo>
            </NavContainer>
        </Nav>
    );
}

const Nav = styled.nav`
    background-color: var(--navbar-background-dark);
    border-bottom: 1px solid var(--navbar-border-dark);
    width: 100%;
`;

const NavContainer = styled.div`
    font-family: Arial, sans-serif;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 20px;
    max-width: 1000px;
    margin: 0 auto;
`;

const Logo = styled.div`
    font-weight: bold;
    color: var(--text-dark);
    font-size: 1.2em;
`;
