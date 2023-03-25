import CommentAPIService from "../pages/BACKEND_DEBUG/CommentAPIService";

export default class UserRESTAPI  {
    //TODO: MOVE SOME THINGS FROM COMMENT POST API TO HERE
    //get UserNameSpace
    static parseCurrentUserObjFromCookies() {
        //TODO UUID ENCRYPTION SECURITY
        var userObj = {},
        keys = Object.keys(localStorage),
        i = keys.length;

        while ( i-- ) {
            userObj[keys[i]] = localStorage.getItem(keys[i]) ;
        }
        return userObj;
    }
    //get UserNameSpace
    static async parseUserFromUidBackendRequest(uid,callback) {
        //TODO To be improved with UserRESTAPI

        return await CommentAPIService.GetUserDetails(uid)
            .then(
                user_json => callback(user_json)
            )
    }
}

