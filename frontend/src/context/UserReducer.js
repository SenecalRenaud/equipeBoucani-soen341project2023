import React from 'react';




// export const initialState = {
//   userDetails: "" || user,
//   token: "" || token,
//   loading: false,
//   errorMessage: null
// };


//TODO: ADAPT FOR MORE STATE PROPERTY FIELDS + do ...state

export const defaultState = {
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
// export const initialState = (function () {
//     let isLoggedInBackend,backendSessionUserData;
//     UserRESTAPI.isUserLoggedInBackendSession().then(
//         (a1,a2) => {
//             isLoggedInBackend = a1;
//             backendSessionUserData = a2;
//         }
//     )
//     (async function f() {
