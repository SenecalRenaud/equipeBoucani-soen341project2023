import React, { useState } from 'react'
import { RiMenu3Line, RiCloseLin, RiCloseLine } from 'react-icons/ri'; //might be an error here if there isnt a node_modules present...
import {Link} from "react-router-dom";
import './navbar.css';
import logo2 from '../../assets/logo2.png';
import {Nav, NavLink, NavLinkSignIn, NavLinkSignUp} from "./NavElements";
import Cookies from 'js-cookie';
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";

const NavMenu = () => (
  <>
        <Nav>
		<NavLink className='whitespace' to="/" activeStyle>
			Home
		</NavLink>
		<NavLink className='whitespace' to="/jobposting" activeStyle>
			Post a Job
		</NavLink>
        <NavLink className='whitespace' to="/applyJob" activeStyle>
            Apply to a Job
        </NavLink>
        <NavLink className='whitespace' to="/BACKEND_DEBUG" activeStyle>
            BACKEND_CRUD_DEBUG
        </NavLink>
            <NavLink className='whitespace' to="/profile" activeStyle>
            My Profile
        </NavLink>
            <NavLink className='whitespace' to="/jobs" activeStyle>
            Jobs
        </NavLink>


        </Nav>
  </>
)
const LoginOrSeeAccount = () => {
    // const [userRecordInfo,setUserRecordInfo] = useState({});

    let uid = Cookies.get('loggedin_uid');
    // if(uid != null){
    //     CommentAPIService.GetUserDetails(uid).then(
    //         json =>
    //         {
    //             setUserRecordInfo(json)
    //             return json;
    //         }
    //     )
    // }

    // console.log(userRecordInfo)
    return (uid ?
            <>
                <div style={{color: 'white'}}>
                <span>{window.localStorage['firstName']} {window.localStorage['lastName']}</span>
                <img src={window.localStorage['photo_url']} width="50" height="50" alt={"pfp"}/>
                <p style={{fontSize: "0.5em"}} onClick=
                        {(e)=>
                        {CommentAPIService.UserLogout();window.location.replace('http://localhost:3000')}}>
                    Sign Out
                </p>
                </div>
                </>
            :
            <>
                <NavLinkSignIn className='whitespace' to="/signin">
                    Sign in
                </NavLinkSignIn>
                <NavLinkSignUp className='whitespace' to="/signup">
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
          <nav><NavLink to="/" activeStyle>
		<img src={logo2} alt="logo"/></NavLink></nav>
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
