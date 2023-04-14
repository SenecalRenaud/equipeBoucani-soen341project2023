import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react'
import {useDetectOutClickOrEsc} from "../../hooks/outside-clickorescape.hook";
import "./ClickedUserDropDown.css"
import {Link} from "react-router-dom";
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";
import UserRESTAPI from "../../restAPI/UserAPI";
import UserRelationPermsFSM from "./MenuItems"
import {useUserContext} from "../../context/UserContext";


//TODO Optimization: use .bind() to bind to very user profile to result on current load !!!


/**
 * Contact author: Antoine Cantin @ChiefsBestPal
 * Before making any changes here. Report bugs immediately.
 */
const UserDropDownMenu = ({triggerMenuMarkup,triggeredUserUid}) => {
    const {state} = useUserContext();

    //const counter = useRef(0);

    const dropDownRef = useRef(null);
    const [isToggled, setIsToggled] = useDetectOutClickOrEsc(dropDownRef,false);
    const [otherUser,setOtherUser] = useState([{}])


    const handleClick = useCallback( //memoizes on load the hook based on state, better sync click
        () => {
            // console.log("AAAAAAAAA")
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


    let user = state.userData;   //UserRESTAPI.parseCurrentUserObjFromFrontendCache()
    
    if (!state.isAuthenticated) {//!UserRESTAPI.checkIfObjectIsValidUser(user)
        user = {}
        user['uid'] = "qwertyuiopasdfghjklzxcvbnm12"
        user['userType'] = "APPLICANT"
        user['email'] = "anonymous@user.boucani"
        user['firstName'] = "Anonymous"
        user['lastName'] = "User"
    }

    const permissionBasedMenuOptionsMarkup = useMemo(() =>
        UserRelationPermsFSM(user,otherUser), [user,otherUser]);


    let isNotUndetermined = !!user.email && !!otherUser.email;

    // console.log(`${user.firstName}->${otherUser.firstName} dropdownMenu.jsx count: ${counter.current++}`)

      return (
        <div className="menu-container">
          <button onClick={handleClick} className="menu-trigger">
              {triggerMenuMarkup}
          </button>
          <nav ref={dropDownRef} className={`menu ${isToggled ? 'active' : 'inactive'}`}>
            <ul>
                {
                    isNotUndetermined && <>

              <li><Link to={`/profile/${triggeredUserUid}`}> View Profile </Link></li>
              {/*<li><a href="/preferences"> Settings & Preferences</a></li>*/}
              <li><Link to={`/notifications/${triggeredUserUid}`}> Notifications </Link></li>

                    </>
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
    const {dispatch} = useUserContext();

    return condition && (
        <>
 <li> <hr/> <hr/> </li>
    <li>
      <b onClick=
          {(e)=>
              // eslint-disable-next-line no-restricted-globals
          {if(confirm("Are you sure want to sign out? ")){
              CommentAPIService.UserLogout(dispatch);
              window.location.replace('http://localhost:3000')
          }}}
      > Log out </b>
    </li>
        </>
    )

}


export default UserDropDownMenu;