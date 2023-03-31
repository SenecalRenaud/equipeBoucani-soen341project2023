import {React,createContext} from "react"

export const LoggedInUserContext = createContext()

//TODO Better version: https://soshace.com/react-user-login-authentication-using-usecontext-and-usereducer/
export const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...action.payload };
    case 'CLEAR_USER':
      return null;
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};