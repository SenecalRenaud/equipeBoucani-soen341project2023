import React, {useState, useRef, useEffect, useCallback} from 'react'
import {useDetectOutClickOrEsc} from "../../hooks/outside-clickorescape.hook";
import "./ClickedUserDropDown.css"
import {Link} from "react-router-dom";
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";
import UserRESTAPI from "../../restAPI/UserAPI";
import UserRelationPermsFSM from "./MenuItems"


const UserDropDownMenu = ({triggerMenuMarkup,triggeredUserUid}) => {
    const dropDownRef = useRef(null);
    const [isToggled, setIsToggled] = useDetectOutClickOrEsc(dropDownRef,false);
    const [otherUser,setOtherUser] = useState([{}])


    const handleClick = useCallback( //memoizes on load the hook based on state, better sync click
        () => {
            setIsToggled(!isToggled);
        },
        [isToggled, setIsToggled]
    )
    useEffect(
        () => {
            CommentAPIService.GetUserDetails(
                triggeredUserUid
            ).then(
                (data) => {
                    // console.log(data)
                    setOtherUser(data)
                }
            )
        },
        [triggeredUserUid] //effect hook only called on mount since empty dependencies array
    )
    // if(window.localStorage.getItem('userType') != null){
    //     const userType = window.localStorage.getItem('userType').toUpperCase().trim();
    //     const isAnotherUser = (userEmail != window.localStorage.getItem('email'))
    //
    // }

    let user = UserRESTAPI.parseCurrentUserObjFromCookies()
    
    if (!UserRESTAPI.checkIfObjectIsValidUser(user)) {
        user['uid'] = "qwertyuiopasdfghjklzxcvbnm12"
        user['userType'] = "APPLICANT"
        user['email'] = "anonymous@user.boucani"
        user['firstName'] = "Anonymous"
        user['lastName'] = "User"
    }
    let permissionBasedMenuOptionsMarkup = UserRelationPermsFSM(user,otherUser);

    let isNotUndetermined = !!user.email && !!otherUser.email;

    console.log(permissionBasedMenuOptionsMarkup)

      return (
        <div className="menu-container">
          <button onClick={handleClick} className="menu-trigger">
              {triggerMenuMarkup}
          </button>
          <nav ref={dropDownRef} className={`menu ${isToggled ? 'active' : 'inactive'}`}>
            <ul>
                {
                    isNotUndetermined && <div>

              <li><Link to="/profile"> View Profile </Link></li>
              {/*<li><a href="/preferences"> Settings & Preferences</a></li>*/}
              <li><a onClick={(e)=>alert("Notification view page TODO!")}> Notifications </a></li>

                    </div>
                }
                {permissionBasedMenuOptionsMarkup}
                <LogOutTab condition={
                    isNotUndetermined &&
                    user.email === otherUser.email}/>
            </ul>
          </nav>
        </div>
      );
}
const LogOutTab = ({condition}) => {
    return condition && (
        <>
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
        </>
    )

}


export default UserDropDownMenu;