import CommentAPIService from "../pages/BACKEND_DEBUG/CommentAPIService";
import Cookies from "js-cookie";

export const USER_FIELDS = [
    "firstName",
    "lastName",
    "email",
    "photo_url",
    "resume_url",
    "lastSeenEpoch",
    "creationEpoch",
    "userType",
    "uid"
]

export const USER_COOKIES = [
    "access_token",
    "refresh_token",
    "loggedin_uid",
    'session' //TODO MIGHT BE CAUSING ISSUES DEPENDING ON BACKEND DEPENDENCIES
]

export default class UserRESTAPI  {

    //TODO: MOVE SOME THINGS FROM COMMENT POST API TO HERE
    //get UserNameSpace
    static parseCurrentUserObjFromFrontendCache() {
        //TODO UUID ENCRYPTION SECURITY
        var userObj = {},
        keys = USER_FIELDS,//Object.keys(localStorage),
        i = keys.length;

        while ( i-- ) {
            userObj[keys[i]] = localStorage.getItem(keys[i]) ;
            if (userObj[keys[i]] === "undefined" || userObj[keys[i]] == null) {
                return {}
            }
        }
        return userObj;
    }
    static getAllUserCookies() {
        var cookiesObj = {},
        keys = USER_COOKIES,//Object.keys(localStorage),
        i = keys.length;

        while ( i-- ) {
            cookiesObj[keys[i]] = Cookies.get(keys[i]) ;
        }
        return cookiesObj;
    }
    //get UserNameSpace
    static async parseUserFromUidBackendRequest(uid,callback) {

        return await CommentAPIService.GetUserDetails(uid)
            .then(
                user_json => callback(user_json)
            )
    }
    static checkIfObjectIsValidUser(obj) {
        for (let property of USER_FIELDS){
            if (!obj.hasOwnProperty(property) ||
                obj[property] === undefined ||
                obj[property] === 'undefined'
            ){
                return false;
            }
        }
        return true;
    }

    static userLoggedInBackendSession;


    static updateCachedFrontendUserFromBackendSession({userObj = null}){

        if (UserRESTAPI.userLoggedInBackendSession === undefined)
            UserRESTAPI.fetchCurrentUserLoggedInBackendSession();

        let _userLoggedInBackendSession = (userObj == null)
            ? UserRESTAPI.userLoggedInBackendSession : userObj

        for (let property of USER_FIELDS){
            window.localStorage.setItem(property,
                _userLoggedInBackendSession[property]
            )
        }

    }
    static async isUserLoggedInBackendSession(){
        try {
              const result = await UserRESTAPI.fetchCurrentUserLoggedInBackendSession();
              return [Object.keys(result).length !== 0, result]

            } catch (error) {
              console.error(error);
        }
    }
    static async fetchCurrentUserLoggedInBackendSession(){
        // UserRESTAPI.res = Object.keys(json).length !== 0
            try {
              const result = await CommentAPIService.GetUserDetails("current");
              UserRESTAPI.userLoggedInBackendSession = result;
              return result;
            } catch (error) {
              console.error(error);
        }
    }
    static checkIfAllUserFrontendCacheAvailable() {
        var keys = USER_FIELDS,
        i = keys.length;

        while ( i-- ) {
            if (localStorage.getItem(keys[i]) == null ||
                localStorage.getItem(keys[i]) === undefined){
                return false;
            }
        }
        return true;
    }

    //static areAllUserCookiesAvailable = UserRESTAPI.getAllUserCookies.bind(UserRESTAPI,...partialargs)
    static areAllUserCookiesAvailable() {
        var keys = USER_COOKIES,
        i = keys.length;

        while ( i-- ) {
            if (Cookies.get(keys[i]) == null ||
                Cookies.get(keys[i]) === undefined){
                return false;
            }
        }
        return true;
    }
        static areAnyUserCookiesAvailable() {
            var keys = USER_COOKIES,
            i = keys.length;

            while ( i-- ) {
                if (Cookies.get(keys[i]) != null &&
                    Cookies.get(keys[i]) !== undefined){
                    return true;
                }
            }
            return false;
    }

}

