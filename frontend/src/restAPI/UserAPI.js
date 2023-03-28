import CommentAPIService from "../pages/BACKEND_DEBUG/CommentAPIService";

    const USER_FIELDS = [
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
    static checkIfObjectIsValidUser(obj) {
        for (let property of USER_FIELDS){
            if (!obj.hasOwnProperty(property)){
                return false;
            }
        }
        return true;
    }

}

