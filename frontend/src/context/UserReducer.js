import React from 'react';

//TODO: https://stackoverflow.com/questions/59990636/react-login-with-usecontext-usereducer-basic-example
//TODO: https://soshace.com/react-user-login-authentication-using-usecontext-and-usereducer/


//TODO: ADAPT FOR MORE STATE PROPERTY FIELDS + do ...state

//TODO: TRANSFER COMMENTPOST_API LOGIC TO HERE !!!!


// let user = localStorage.getItem("currentUser")
//   ? JSON.parse(localStorage.getItem("currentUser")).user
//   : "";
// let token = localStorage.getItem("currentUser")
//   ? JSON.parse(localStorage.getItem("currentUser")).auth_token
//   : "";
//
// export const initialState = {
//   userDetails: "" || user,
//   token: "" || token,
//   loading: false,
//   errorMessage: null
// };
export const initialState = {
    isAuthenticated : false,
    userData : null,
};
export const UserReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
        console.log("SETTING USER")
      return {
          isAuthenticated: true,
          userData: action.payload
      };
      //'...state.prop' unpacks previous prop field
    case 'CLEAR_USER':
        console.log("CLEARING USER")
        return {
          isAuthenticated: false,
          userData: null
      };
    default:
      return state;
      //throw new Error(`Unhandled action type: ${action.type}`);
  }
};