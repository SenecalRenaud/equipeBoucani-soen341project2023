import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";

export const Nav = styled.nav`
  height: 85px;
  display: flex;
  justify-content: space-around;

  padding: 0.2rem calc((100vw - 1000px) / 2);
  z-index: 12;
`;

export const NavLink = styled(Link)`
  color: #808080;
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0 1rem;
  flex: 1;
  height: 100%;
  cursor: pointer;
  &.active {
    color: #4d4dff;
  }
  &:hover {
    color: #ff4820;
  }
`;

export const NavLinkSignIn = styled(Link)`
  color: #fff;
  font-family: var(--font-family); /*using the variable found in index.css*/
  font-weight: 500;
  font-size: 18px;
  line-height: 25px;
  text-transform: capitalize;
  white-space: nowrap;
  margin: 0 1rem;
  cursor: pointer;
`;

export const NavLinkSignUp = styled(Link)`
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  color: #fff;
  background: #ff4820;
  font-family: var(--font-family); /*using the variable found in index.css*/
  font-weight: 500;
  font-size: 18px;
  line-height: 25px;
  border-radius: 5px;
  border: 0;
  outline: none;
  cursor: pointer;
  min-height: 66px;
  min-width: 66px;
  white-space: nowrap;
`;
