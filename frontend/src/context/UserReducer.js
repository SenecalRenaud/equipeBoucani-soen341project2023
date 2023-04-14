import React from 'react';



export const defaultState = {
    isAuthenticated : false,
    userData : null,
    loading : false,
    errorMsg: ""
};

export const UserReducer = (state, action) => {
  switch (action.type) {
    case 'REDUXACTION_LOGIN':
        console.log("CONTEXT REDUCER ACTION: LOGIN AND SET USER")
      return {
            ...state,
          isAuthenticated: true,
          userData: action.payload,
          loading: false,
          errorMsg: ""
      };
      //'...state.prop' unpacks previous prop field
    case 'REDUXACTION_LOGOUT':
        console.log("CONTEXT REDUCER ACTION: LOGOUT USER")
        return {
          ...state,
          isAuthenticated: false,
          userData: null
      };
      case 'REDUXACTION_REQUEST_LOGIN':
          console.log("CONTEXT REDUCER ACTION: REQUEST LOGIN")
          return {
              ...state,
              loading: true,
              errorMsg: ""
          };
      case 'REDUXACTION_LOGIN_ERROR':
          console.log("CONTEXT REDUCER ACTION: LOGIN ERROR")
          return {
              ...state,
              loading: false,
              errorMsg: action.error.message
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
