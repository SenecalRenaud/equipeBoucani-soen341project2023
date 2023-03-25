import React, { useState,useRef,useEffect } from 'react'
import {useDetectOutClickOrEsc} from "../../hooks/outside-clickorescape.hook";
import "./ClickedUserDropDown.css"
import {Link} from "react-router-dom";
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";



const UserDropDownMenu = ({triggerMenuMarkup,userEmail}) => {
    const dropDownRef = useRef(null);
    const [isToggled, setIsToggled] = useDetectOutClickOrEsc(dropDownRef,false);

    const onClick = (e) => {
        setIsToggled(!isToggled);
    };
    if(window.localStorage.getItem('userType') != null){
        const userType = window.localStorage.getItem('userType').toUpperCase().trim();
        const isAnotherUser = (userEmail != window.localStorage.getItem('email'))
        let userTypeBasedOption = <> SEE THE FINITE STATE MACHINE IN MenuItem.js</>; //TODO !!!!!!!!!!
    }
    //   if (userType != "APPLICANT" ){
    //    userTypeBasedOption += <>
    //     <li> My Applications </li>
    //     <li> My Interviews </li>
    //    </>
    // } else if (userType == "EMPLOYER") {
    //     userTypeBasedOption = <>
    //     <li>  </li>
    //     <li> My Interviews </li>
    //     </>
    // }

      return (
        <div className="menu-container">
          <button onClick={onClick} className="menu-trigger">
              {triggerMenuMarkup}
          </button>
          <nav ref={dropDownRef} className={`menu ${isToggled ? 'active' : 'inactive'}`}>
            <ul>

              <li><Link to="/profile"> View Profile </Link></li>
              {/*<li><a href="/preferences"> Settings & Preferences</a></li>*/}
              <li><a onClick={(e)=>alert("Notification view page TODO!")}> Notifications </a></li>


                <li>  </li>
                <li> <hr/> <hr/> </li>
                <li>
                    <b onClick=
                        {(e)=>
                            // eslint-disable-next-line no-restricted-globals
                        {if(confirm("Are you sure want to sign out? ")){
                            CommentAPIService.UserLogout();
                            window.location.replace('http://localhost:3000')
                        }}}
                    > Log out </b>
                </li>
            </ul>
          </nav>
        </div>
      );
}


export default UserDropDownMenu;