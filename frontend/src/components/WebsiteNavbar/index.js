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
		<NavLink to="/DEBUG_BACKEND" activeStyle>
			DEBUG_BACKEND
		</NavLink>
			<NavLink to="/DEBUG_BACKEND_FORM" activeStyle>
				DEBUG_BACKEND_FORM
			</NavLink>
		</NavMenu>
	</Nav>
	</>
);
};

export default Navbar;
