import React, {useRef, useState} from 'react'
import { RiMenu3Line, RiCloseLin, RiCloseLine } from 'react-icons/ri'; //might be an error here if there isnt a node_modules present...
// import {Link, Route} from "react-router-dom";
import './navbar.css';
import logo2 from '../../assets/logo3.png';
import {Nav, NavLink, NavLinkSignIn, NavLinkSignUp} from "./NavElements";
import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode'
// import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";
import UserDropDownMenu from "../UserDropDownMenu/UserDropDownMenu";
// import JobPostingForm from "../../pages/PostAJob/JobPostingForm";
import {useDetectOutClickOrEsc} from "../../hooks/outside-clickorescape.hook";
import {useUserContext} from "../../context/UserContext";
import {MouseCursorGradientTracking} from "../../utils/mouseTrackingGradient";
import {Link} from "react-router-dom";


const NavMenu = () => {
    const {state} = useUserContext();

    //can use activestyle={{}}
    return (<>
        <Nav>
		<NavLink className='whitespace' to="/" activeStyle>
			Home
		</NavLink>
		{
                (state.userData && state.userData.userType === "EMPLOYER") &&
                <NavLink className='whitespace' to="/jobposting" activeStyle>
                    Post a Job
                </NavLink>
            }
        <NavLink className='whitespace' to="/BACKEND_DEBUG" activeStyle>
            [BACKEND CRUDV2 &emsp;DEBUG ANTOINE]
        </NavLink>
            <NavLink className='whitespace' to="/profile" activeStyle>
            My Profile
        </NavLink>

            <NavLink to="/viewjobposts">
                View Job Posts
            </NavLink>

        </Nav>
    </>)
}
const LoginOrSeeAccount = () => {
    // const [userRecordInfo,setUserRecordInfo] = useState({});
    const {state} = useUserContext();

    let uid;
    try {
        uid = jwtDecode(Cookies.get("access_token")).user_id
    }catch {
        uid = undefined;
    }
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
    return (uid !== undefined && uid && state.userData ?
            <>
            <UserDropDownMenu triggerMenuMarkup={


                <div className="loggedInUser_container"

                >
                    <div className="navbarLoggedInText">
                <span id="navbarLoggedInName">
                    {state.userData.firstName} {state.userData.lastName}</span>

                        <p>
                            {state.userData.userType}
                        </p>
                    </div>
                    <div>
                                        <img id="navbarLoggedInPfp"
                        src={state.userData.photo_url} width="50" height="50" alt={"pfp"}/>

                </div>
                    </div>
                    } triggeredUserUid={uid} />
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
  const minimizedMenuRef = useRef(null);
  const [toggleMenu, setToggleMenu] = useDetectOutClickOrEsc(minimizedMenuRef,false);
  return (
    <div className='gpt3__navbar'>

    <div className='gpt3__navbar-links'>
        <MouseCursorGradientTracking markupContent={
        <div className='gpt3__navbar-links_logo'>
                     <Link to="/">
                <img src={logo2} alt="logo"/>
            </Link>

        </div>}/>
        <div className='gpt3__navbar-links_container'>
          <NavMenu />
        </div>

      </div>


      <div className="gpt3__navbar-sign">
        <LoginOrSeeAccount />
      </div>
      


      {toggleMenu
          ?
          <div ref={minimizedMenuRef} className='gpt3__navbar-menu'>
          <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
            <div className="gpt3__navbar-menu_container scale-up-center">
              <div className="gpt3__navbar-menu_container-links">
                <NavMenu />
              </div>
              <div className="gpt3__navbar-menu_container-links-sign">
                <LoginOrSeeAccount />
              </div>
            </div>
          </div>
          :
          <div className='gpt3__navbar-menu'>
          <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />
          </div>
          }
        {/*  {toggleMenu && (*/}

        {/*)}*/}

      
      
    </div>
  )
}

export default Navbar
