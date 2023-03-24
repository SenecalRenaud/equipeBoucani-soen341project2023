import React, { useState } from 'react'
import { RiMenu3Line, RiCloseLin, RiCloseLine } from 'react-icons/ri'; //might be an error here if there isnt a node_modules present... 
import './navbar.css';
import logo2 from '../../assets/logo2.png';
import {Nav, NavLink, NavLinkSignIn, NavLinkSignUp} from "./NavElements";
import Cookies from 'js-cookie';
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";

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
            <NavLink to="/SESSION_COOKIES_DEBUG" activeStyle>
                SESSION_COOKIES_DEBUG
            </NavLink>
        </Nav>
  </>
)
const LoginOrSeeAccount = async () => {

    var uid = Cookies.get('loggedin_uid');
    var userRecordInfo = await CommentAPIService.GetUserDetails(uid).then(
        json =>
        {
            console.log("BBBBBBB")
            console.log(json)
            return json;
        }
    )
    console.log("ASDSAD")
    console.log(userRecordInfo)
    console.log(userRecordInfo['firstName'])
    return (uid ?
            <>
                <span>{userRecordInfo.firstName}</span>
                <img src={userRecordInfo.photo_url} width="50" height="50" alt={"pfp"}/>
            </>
            :
            <>
                <NavLinkSignIn to="/signin">
                    Sign in
                </NavLinkSignIn>
                <NavLinkSignUp to="/signup">
                    Sign up
                </NavLinkSignUp>
            </>

    )

}
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
        <LoginOrSeeAccount />
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
          <LoginOrSeeAccount />
          </div>
        </div>
        )}
      </div>
      
      
    </div>
  )
}

export default Navbar
