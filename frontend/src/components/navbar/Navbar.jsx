import React, { useState } from 'react'
import { RiMenu3Line, RiCloseLin, RiCloseLine } from 'react-icons/ri'; //might be an error here if there isnt a node_modules present...
import {Link} from "react-router-dom";
import './navbar.css';
import logo2 from '../../assets/logo2.png';
import {Nav, NavLink} from "./NavElements";

const NavMenu = () => (
  <>
        <Nav>
		<NavLink to="/" activeStyle>
			Home
		</NavLink>
		<NavLink to="/jobposting" activeStyle>
			Post a Job
		</NavLink>
        <NavLink to="/BACKEND_DEBUG" activeStyle>
            BACKEND_CRUD_DEBUG
        </NavLink>

        </Nav>
  </>
)

const Navbar = () => {
  //make it false in beggining, since it will cahnge to true when true
  const [toggleMenu, setToggleMenu] = useState(false);
  return (
    <div className='gpt3__navbar'>

      <div className='gpt3__navbar-links'>

        <div className='gpt3__navbar-links_logo'> 
          <img src={logo2} alt="logo"/>
        </div>

        <div className='gpt3__navbar-links_container'>
          <NavMenu />
        </div>

      </div>

      <div className="gpt3__navbar-sign">
          <p> <Link to="/signin"> Sign in </Link></p>
          <button type="button"><Link to="/signup"> Sign up </Link></button>
      </div>
      

      <div className='gpt3__navbar-menu'>
      {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
          {toggleMenu && (
        <div className="gpt3__navbar-menu_container scale-up-center">
          <div className="gpt3__navbar-menu_container-links">
          <NavMenu />
          </div>
          <div className="gpt3__navbar-menu_container-links-sign">
		  <p> <Link to="/signin"> Sign in </Link></p>
		  <button type="button"><Link to="/signup"> Sign up </Link></button>
          </div>
        </div>
        )}
      </div>
      
      
    </div>
  )
}

export default Navbar
