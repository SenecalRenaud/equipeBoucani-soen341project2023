import {React, createContext, useReducer, useContext, useMemo} from "react"
import {UserReducer,defaultState} from "./UserReducer";


export const UserContext = createContext()

export function useUserContext() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserContextProvider');
    }
    return context;
}

export const UserContextProvider = ({ children }) => {
   const [state, dispatch] = useReducer(UserReducer, defaultState);


   const contextValue = useMemo(() => {
      return { state, dispatch };
   }, [state, dispatch]);


  //  function setLoggedInUser (userData) {
  //   dispatch({ type: 'SET_USER', payload: userData });
  // }
  //
  //  function clearLoggedInUser() {
  //   dispatch({ type: 'CLEAR_USER' });
  // }
  return ( //value={{ loggedInUser, setLoggedInUser, clearLoggedInUser }}>
    <UserContext.Provider value={contextValue} >
      {children}
    </UserContext.Provider>
  );
};
  // const [loggedInUser, setCurrentUser] = useState(null)
  // const fetchLoggedInUser = async () => {
  //   let response = await fetch("/firebase-api/get-user/current/")
  //   response = await response.json()
  //   setCurrentUser(response)
  // }