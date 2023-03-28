import React from "react";
import styled, { ThemeProvider } from "styled-components";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import {AvatarGroup} from "@material-ui/lab";
import { StylesProvider, useTheme } from "@material-ui/core/styles";

const AvatarContainer = styled.div`
  display: flex;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  background: #e0e8ef;

  & > * {
    margin: 2px;
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

function UserAvatarWithText(userObj,key=0,avatarSize=6) {


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
function UserAvatarGroup(usersList,maxNumOfUsersShown) {
  return (
    <AvatarContainer>
      <AvatarGroup max={maxNumOfUsersShown}>
          {
              usersList.map((userObj,ix) =>
                  (
                      <Avatar
                        key={ix}
                        alt={userObj.firstName}
                        src={userObj.photo_url}
                        />
                  )
              )
          }


      </AvatarGroup>
    </AvatarContainer>
  );
}
export {UserAvatarWithText,UserAvatarGroup }
