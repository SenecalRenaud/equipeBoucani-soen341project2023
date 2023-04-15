import React, {useState} from "react";
import styled, { ThemeProvider } from "styled-components";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import {AvatarGroup} from "@material-ui/lab";
import { StylesProvider, useTheme } from "@material-ui/core/styles";
import UserDropDownMenu from "../UserDropDownMenu/UserDropDownMenu";
import {Button, Menu, MenuItem} from "@material-ui/core";


const AvatarContainer = styled.div`
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  background: #e0e8ef;

  & > * {
    margin: 2px;
  }
  & .MuiAvatar-root {
    width: 50px ;
    height: 50px ;
  }

`;
const AvatarContainer2 = styled.div`
  display: flex;


  background: none !important;

  & > * {
    margin: 2px;
  }
  & .MuiAvatar-root {
    width: 50px ;
    height: 50px ;
  }

`;
const GroupedAvatarContainer = styled.div`
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  border: none;
  background: antiquewhite;
  //gap: 20px;
  //margin-left: -100px;
  & > * {
    //margin: 12px;
    border: 0;
    background: none;
  }
  & .MuiAvatarGroup-root{
    background: none;
    border: none;
  }
  & .menu-trigger {
    object-fit: cover;
    background: none;
    box-shadow: none;
    margin-left: -20px;
    
    justify-content: left;
    align-items: flex-start;
  }

`;

// const SizedAvatar = styled(Avatar)`
//   ${({ size, theme }) => `
//     width: ${theme.spacing(size)}px;
//     height: ${theme.spacing(size)}px;
//   `};
// `;

const AvatarLabel = styled.div`
  display: flex;
  align-items: center;
    &:hover {
      cursor: pointer;
      div {
        border: 3px solid lightseagreen;
      }
      p {
        color: lightseagreen
      }
      
      
  }
`;

const BorderedAvatar = styled(Avatar)`
  border: 3px solid lightseagreen;
`;

function UserAvatarWithText(userObj,key=0,avatarSize=50) {

    let sizeStyle = {width: `${avatarSize}px`,height: `${avatarSize}px`}

  return (

    <AvatarContainer>
      <AvatarLabel>
        <Avatar
            key={key}
          style={{ marginRight: "14px"}}
          // size={avatarSize}
          alt={userObj.firstName + " " + userObj.lastName}
          src={userObj.photo_url}
        />
        <Typography variant="body2"> {userObj.firstName + " " + userObj.lastName}</Typography>
      </AvatarLabel>
    </AvatarContainer>

  );
}

function UserAvatarWithText2(userObj,key=0,avatarSize=50) {


    return (

        <AvatarContainer2>
            <AvatarLabel>
                <Avatar
                    key={key}
                    style={{marginRight: "14px"}}
                    // size={avatarSize}
                    alt={userObj.firstName + " " + userObj.lastName}
                    src={userObj.photo_url}
                />
                <div style={{display: 'flex', flexDirection: 'column'}}>
                <Typography variant="body1"> {userObj.email}</Typography>
                <Typography variant="body2" > {userObj.firstName + " " + userObj.lastName}</Typography>
                </div>
            </AvatarLabel>
        </AvatarContainer2>

    );
}

function UserAvatarGroup(usersList,maxNumOfUsersShown,useDropDownMenu=true) {
  return (
    <GroupedAvatarContainer>
      <AvatarGroup max={maxNumOfUsersShown}>
          {
              usersList.map((userObj,ix) =>
                  !useDropDownMenu ?
                      <Avatar
                        key={ix}
                        alt={userObj.firstName}
                        src={userObj.photo_url}
                        imgProps={{
        style: { objectFit: 'cover', width: '100%', height: '100%' },
      }}
                        />
                  :
                    <UserDropDownMenu
                    triggerMenuMarkup={
                        <Avatar
                        key={ix}
                        alt={userObj.firstName}
                        src={userObj.photo_url}
                        />}
                    triggeredUserUid={userObj.uid}
                />
              )
          }


      </AvatarGroup>
    </GroupedAvatarContainer>
  );
}

function AvatarGroupWithClickableAvatars(usersList,maxNumOfUsersShown) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleClick = (event, avatar) => {
    setAnchorEl(event.currentTarget);
    setSelectedAvatar(avatar);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedAvatar(null);
  };

  return (
     <GroupedAvatarContainer>
      <AvatarGroup max={maxNumOfUsersShown}>
        {usersList.map((avatar) => (
          <Button key={avatar.uid} onClick={(e) => handleClick(e, avatar)}>
            <Avatar alt={avatar.firstName} src={avatar.photo_url} />
          </Button>
        ))}
      </AvatarGroup>
        <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>{selectedAvatar?.firstName}</MenuItem>
        {/* Other menu items */}
      </Menu>
     </GroupedAvatarContainer>
  );
}

export {UserAvatarWithText,UserAvatarWithText2,UserAvatarGroup, AvatarGroupWithClickableAvatars}
