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
			<NavLink to="/BACKEND_DEBUG_FORM" activeStyle>
				BACKEND_DEBUG_FORM
			</NavLink>
		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;
