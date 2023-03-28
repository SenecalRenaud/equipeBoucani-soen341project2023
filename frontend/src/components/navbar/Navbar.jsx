import React, { useState } from 'react'
import { RiMenu3Line, RiCloseLin, RiCloseLine } from 'react-icons/ri'; //might be an error here if there isnt a node_modules present...
import {Link, Route} from "react-router-dom";
import './navbar.css';
import logo2 from '../../assets/logo2.png';
import {Nav, NavLink, NavLinkSignIn, NavLinkSignUp} from "./NavElements";
import Cookies from 'js-cookie';
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";
import UserDropDownMenu from "../UserDropDownMenu/UserDropDownMenu";
import JobPostingForm from "../../pages/PostAJob/JobPostingForm";

const NavMenu = () => (
  <>
        <Nav>
		    <NavLink to="/" activeStyle>
			    Home
		    </NavLink>
            {
            window.localStorage.getItem("userType") === "EMPLOYER" &&
            		    <NavLink to="/jobposting" activeStyle>
                Post a Job
		    </NavLink>
            }
            <NavLink to="/BACKEND_DEBUG" activeStyle>
                BACKEND_CRUD_DEBUG
            </NavLink>

            <NavLink to="/viewjobposts" activeStyle>
                View Job Posts
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
            <UserDropDownMenu triggerMenuMarkup={


                <div className="loggedInUser_container"

                >
                    <div className="navbarLoggedInText">
                <span id="navbarLoggedInName">
                    {window.localStorage['firstName']} {window.localStorage['lastName']}</span>

                        <p>
                            {window.localStorage['userType']}
                        </p>
                    </div>
                    <div>
                                        <img id="navbarLoggedInPfp"
                        src={window.localStorage['photo_url']} width="50" height="50" alt={"pfp"}/>

                </div>
                    </div>
                    } triggeredUserUid={uid} />
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
