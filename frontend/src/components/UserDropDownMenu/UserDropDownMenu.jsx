import React, { useState,useRef,useEffect } from 'react'
import {useDetectOutClickOrEsc} from "../../hooks/outside-clickorescape.hook";
import "./ClickedUserDropDown.css"
import {Link} from "react-router-dom";
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";
import UserRESTAPI from "../../restAPI/UserAPI";
import UserRelationPermsFSM from "./MenuItems"


const UserDropDownMenu = ({triggerMenuMarkup,otherUserUid}) => {
    const dropDownRef = useRef(null);
    const [isToggled, setIsToggled] = useDetectOutClickOrEsc(dropDownRef,false);

    const onClick = (e) => {
        setIsToggled(!isToggled);
    };
    // if(window.localStorage.getItem('userType') != null){
    //     const userType = window.localStorage.getItem('userType').toUpperCase().trim();
    //     const isAnotherUser = (userEmail != window.localStorage.getItem('email'))
    //
    // }
    if (otherUserUid != window.localStorage.getItem('uid')){ //TODO URGENT !!!!!!!!!
        throw new Error("User API get all user info not working yet asynchronously and safely... useEffect and useState may be cool")
    }
    let user = UserRESTAPI.parseCurrentUserObjFromCookies()
    let permissionBasedMenuOptionsMarkup = UserRelationPermsFSM(user,user);
    // await UserRESTAPI.parseUserFromUidBackendRequest(otherUserUid,(otherUserObj) => {
    //     // console.log("DATA:")
    //     // console.log(data)
    //
    //     permissionBasedMenuOptionsMarkup = UserRelationPermsFSM(UserRESTAPI.parseCurrentUserObjFromCookies(),otherUserObj)
    //
    // })
    // console.log("CURRENT")
    // console.log(currentUserObj)
    // console.log("OTHER")
    // console.log(otherUserObj)
    console.log(permissionBasedMenuOptionsMarkup)

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
                {permissionBasedMenuOptionsMarkup}
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