import {React,useReducer, useState} from 'react';
import {LoggedInUserContext,userReducer} from './LoggedInUserContext';

const LoggedInUserProvider = ({ children }) => {
   const [loggedInUser, dispatch] = useReducer(userReducer, null);

   const setLoggedInUser = (userData) => {
    dispatch({ type: 'SET_USER', payload: userData });
  };

   const clearLoggedInUser = () => {
    dispatch({ type: 'CLEAR_USER' });
  };

  // const [loggedInUser, setCurrentUser] = useState(null)
  // const fetchLoggedInUser = async () => {
  //   let response = await fetch("/firebase-api/get-user/current/")
  //   response = await response.json()
  //   setCurrentUser(response)
  // }

  return ( //value={{ loggedInUser, setLoggedInUser, clearLoggedInUser }}>
    <LoggedInUserContext.Provider value={{loggedInUser, setLoggedInUser, clearLoggedInUser}} >
      {children}
    </LoggedInUserContext.Provider>
  );
};
export default LoggedInUserProvider;
