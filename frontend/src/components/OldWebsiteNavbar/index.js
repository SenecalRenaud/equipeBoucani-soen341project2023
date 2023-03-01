import React from "react";
import { Nav, NavLink, NavMenu }
	from "./NavbarElements";

const Navbar = () => {
return (
	<>
	<Nav>
		<NavMenu>

		<NavLink to="/" activeStyle>
			Home
		</NavLink>
		<NavLink to="/jobposting" activeStyle>
			Post a Job
		</NavLink>
			<NavLink to="/BACKEND_DEBUG" activeStyle>
				BACKEND_DEBUG
			</NavLink>

		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;
