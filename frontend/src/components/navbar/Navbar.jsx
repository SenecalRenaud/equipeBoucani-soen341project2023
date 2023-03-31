import React, {useRef, useState} from 'react'
import { RiMenu3Line, RiCloseLin, RiCloseLine } from 'react-icons/ri'; //might be an error here if there isnt a node_modules present...
import {Link, Route} from "react-router-dom";
import './navbar.css';
import logo2 from '../../assets/logo2.png';
import {Nav, NavLink, NavLinkSignIn, NavLinkSignUp} from "./NavElements";
import Cookies from 'js-cookie';
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";
import UserDropDownMenu from "../UserDropDownMenu/UserDropDownMenu";
import JobPostingForm from "../../pages/PostAJob/JobPostingForm";
import {useDetectOutClickOrEsc} from "../../hooks/outside-clickorescape.hook";

const NavMenu = () => (
    //can use activestyle={{}}
  <>
        <Nav>
		    <NavLink to="/">
			    Home
		    </NavLink>
            {
            window.localStorage.getItem("userType") === "EMPLOYER" &&
            		    <NavLink to="/jobposting" >
                Post a Job
		    </NavLink>
            }
            <NavLink to="/BACKEND_DEBUG" >
                [BACKEND CRUDV2 &emsp;DEBUG ANTOINE]
            </NavLink>

            <NavLink to="/viewjobposts">
                View Job Posts
            </NavLink>

            <button onClick={(event => {
                fetch(`https://geolocation-db.com/json/`//`http://localhost:5000/firebase-api/authenticate`
                    // ,
                    // {
                    //     method: 'POST',
                    //     headers: {
                    //         'Content-Type':'application/json'
                    //     },
                    //     body: JSON.stringify({
                    //         'idToken': Cookies.get('access_token'),
                    //         'refreshToken' : Cookies.get('refresh_token')
                    //     }
                    //     )
                    // }
                    ).then(response => response.json())
                    .then(data => console.log("AUTHENTICATE DATA", data.IPv4))
                    .catch(err => console.log("AUTHENTICATE ERROR: ",err))
            })}>
                CHECK AUTHENTICATION
            </button>

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
    return (uid !== undefined && uid ?
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
  const minimizedMenuRef = useRef(null);
  const [toggleMenu, setToggleMenu] = useDetectOutClickOrEsc(minimizedMenuRef,false);
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
