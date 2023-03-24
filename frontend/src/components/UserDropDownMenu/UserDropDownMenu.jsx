import React, { useState,useRef,useEffect } from 'react'
import {useDetectOutClickOrEsc} from "../../hooks/outside-clickorescape.hook";
import "./ClickedUserDropDown.css"

                {/*    <p style={{fontSize: "0.5em"}} onClick=*/}
                {/*        {(e)=>*/}
                {/*            // eslint-disable-next-line no-restricted-globals*/}
                {/*        {if(confirm("Are you sure want to sign out? ")){*/}
                {/*            CommentAPIService.UserLogout();*/}
                {/*            window.location.replace('http://localhost:3000')*/}
                {/*        }}}>*/}
                {/*    Sign Out*/}
                {/*</p>*/}

const UserDropDownMenu = ({triggerMenuMarkup}) => {
    const dropDownRef = useRef(null);
    const [isToggled, setIsToggled] = useDetectOutClickOrEsc(dropDownRef,true);

    const onClick = (e) => {
        setIsToggled(!isToggled);
    };

      return (
        <div className="menu-container">
          <button onClick={onClick} className="menu-trigger">
              {triggerMenuMarkup}
          </button>
          <nav ref={dropDownRef} className={`menu ${isToggled ? 'active' : 'inactive'}`}>
            <ul>
              <li><a href="/messages">Messages</a></li>
              <li><a href="/trips">Trips</a></li>
              <li><a href="/saved">Saved</a></li>
            </ul>
          </nav>
        </div>
      );
}


export default UserDropDownMenu;