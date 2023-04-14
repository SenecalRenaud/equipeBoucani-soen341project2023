import Cookies from "js-cookie";
import UserRESTAPI from "../../restAPI/UserAPI";

export default class CommentAPIService{

    static async AddCommentPost(request_body){
        return await fetch(`http://localhost:5000/add`,{
            //'mode': "no-cors",//remove this line if troublesome in environment where deployed
            'method':'POST',
             headers : {
            'Content-Type':'application/json',
      },
            body:JSON.stringify(request_body)
    })
    .then(response => response.json())
    .catch(error => console.log("API CORE EXCEPTION... " + error))
    }

    static async DeleteComment(comment_id){
        return await fetch(`http://localhost:5000/delete/${comment_id}/`,{
            'method':'DELETE',
            headers : {
                'Content-Type':'application/json',
            },
        })
            .then(response => response.json())
            .catch(error => console.log("API CORE EXCEPTION... " + error))
    }

    static async UpdateCommentPut(comment_id, request_body){
        return await fetch(`http://localhost:5000/update/${comment_id}/`,{
            //'mode': "no-cors",//remove this line if troublesome in environment where deployed
            'method':'PUT',
            headers : {
                'Content-Type':'application/json',
            },
            body:JSON.stringify(request_body)
        })
            .then(response => response.json())
            .catch(error => console.log("API CORE EXCEPTION... " + error))
    }

    static async AddNewUser(formData){
        return await fetch(`http://localhost:5000/firebase-api/signup`,{
            'method':'POST',
            body:formData,
            credentials: "include" // To get cookies in AJAX request from backend origin
        })
            //TODO do headers Content-Type: Mime types for form data ?
            //.then(response => response.json())
            .catch(error => console.log("API CORE EXCEPTION... " + error))
    }

    static async UserSignIn0(reducerDispatch,formData){
        return await fetch(`http://localhost:5000/firebase-api/signin`,{
            'method':'POST',
            body:formData,
            credentials: "include" // To get cookies in AJAX request from backend origin
        })
            .then(response => {
                reducerDispatch({ type: 'REDUXACTION_REQUEST_LOGIN' });

                if(response.ok){
                    return response.json();
                }else{
                    console.log('REFUSED SIGNIN RESPONSE AFTER AJAX FETCH !');
                    return response.json().then(data => {
                        return new Error(data.message)
                    }
                    )
                }

            })
            .then(auth_json => {
                console.log("HI")
                console.log(auth_json)
                if (auth_json instanceof Error){
                    console.log("THROWING ERROR ?")
                    reducerDispatch({ type: 'REDUXACTION_LOGIN_ERROR', error: auth_json });
                    throw auth_json;
                }

                auth_json.uid = auth_json.localId
                //delete auth_json.localId

                if (!UserRESTAPI.checkIfObjectIsValidUser(auth_json)){
                    console.log(auth_json)
                    throw new Error("Auth_json not a valid user object... bad json promise")
                }
                // let expires = new Date();
                // expires.setTime(expires.getTime() + (auth_json.expires_in * 250 ));
                Cookies.set('access_token', auth_json.idToken);
                Cookies.set('refresh_token', auth_json.refreshToken);
                // Cookies.set('loggedin_uid', auth_json.uid);
                // setCookie('access_token', auth_json.idToken, { path: '/',  expires})
                // setCookie('refresh_token', auth_json.refresh_token, {path: '/', expires})
                // setCookie('loggedin_uid', auth_json.localId, {path: '/', expires})
                console.log(auth_json)

                reducerDispatch({type: 'REDUXACTION_LOGIN', payload: auth_json})

                window.localStorage.setItem("firstName",auth_json.firstName)
                window.localStorage.setItem("lastName",auth_json.lastName)
                window.localStorage.setItem("email",auth_json.email)
                window.localStorage.setItem("photo_url",auth_json.photo_url)
                window.localStorage.setItem("resume_url",auth_json.resume_url)
                window.localStorage.setItem("lastSeenEpoch",auth_json.lastSeenEpoch)
                window.localStorage.setItem("creationEpoch",auth_json.creationEpoch)
                window.localStorage.setItem("userType",auth_json.userType)
                window.localStorage.setItem("uid",auth_json.localId)
                    // CryptoJs. auth_json.uid...

                return auth_json
            })
            .then((auth_json)=> {
                    reducerDispatch({ type: 'REDUXACTION_LOGIN_SUCCESS', payload: auth_json });

                    // window.location.replace('http://localhost:3000/')
                    return auth_json
                }
            )
            .catch(error =>
            {
                reducerDispatch({ type: 'REDUXACTION_LOGIN_ERROR', error: error });

                console.log('Following error occured after fetching from API: ',error)
            })

    };
    static async UserSignIn(reducerDispatch,formData){
        try {
            const response = await fetch(`http://localhost:5000/firebase-api/signin`, {
                'method': 'POST',
                body: formData,
                credentials: "include" // To get cookies in AJAX request from backend origin
            })
            reducerDispatch({type: 'REDUXACTION_REQUEST_LOGIN'});

            let authError = !response.ok;

            const auth_json = await response.json();

            if (authError || auth_json.hasOwnProperty('message')) {
                console.log('REFUSED SIGNIN RESPONSE AFTER AJAX FETCH !');
                throw new Error(auth_json.message);
            }

            auth_json.uid = auth_json.localId
            //delete auth_json.localId

            if (!UserRESTAPI.checkIfObjectIsValidUser(auth_json)) {
                console.log(auth_json)
                throw new Error("Auth_json not a valid user object... bad json promise")
            }
            // let expires = new Date();
            // expires.setTime(expires.getTime() + (auth_json.expires_in * 250 ));
            Cookies.set('access_token', auth_json.idToken);
            Cookies.set('refresh_token', auth_json.refreshToken);
            // Cookies.set('loggedin_uid', auth_json.uid);
            // setCookie('access_token', auth_json.idToken, { path: '/',  expires})
            // setCookie('refresh_token', auth_json.refresh_token, {path: '/', expires})
            // setCookie('loggedin_uid', auth_json.localId, {path: '/', expires})
            console.log(auth_json)

            window.localStorage.setItem("firstName", auth_json.firstName)
            window.localStorage.setItem("lastName", auth_json.lastName)
            window.localStorage.setItem("email", auth_json.email)
            window.localStorage.setItem("photo_url", auth_json.photo_url)
            window.localStorage.setItem("resume_url", auth_json.resume_url)
            window.localStorage.setItem("lastSeenEpoch", auth_json.lastSeenEpoch)
            window.localStorage.setItem("creationEpoch", auth_json.creationEpoch)
            window.localStorage.setItem("userType", auth_json.userType)
            window.localStorage.setItem("uid", auth_json.localId)
            // CryptoJs. auth_json.uid...
            reducerDispatch({type: 'REDUXACTION_LOGIN', payload: auth_json})
            window.location.replace('http://localhost:3000/')
            return auth_json;
        }
        catch (error)
            {
                await reducerDispatch({ type: 'REDUXACTION_LOGIN_ERROR', error: error });

                console.log('Following error occured after fetching from API: ',error)

                throw error;
            }


    };




    static async GetUserDetails(uid){
        return await fetch(
            `/firebase-api/get-user/${uid.toString()}/`,
            {
                'method': 'GET',
        //                  headers : {
        // //         'Content-Type':'application/json',
        // //     }
            }).then(
                response => {

                if(response.ok){
                    return response;
                }else{
                    console.log('no response after AJAX get user details CORS request to backend...');
                }

            }

        ).then(
            data => (data === undefined ? {} : data.json())
        ).catch(err =>
            console.log("SOME ERROR OCCURED WHILE FETCHING USER ",uid,"'s DATA: ", err)
        )
    }
    static async UserLogout(reducerDispatch,{frontend_logout_only=false} ={}){


        if(!frontend_logout_only) {

            await fetch(`/firebase-api/logout`, { // if fails... try: http://localhost:5000?goto=logout

            }).then(response => {
                console.log(response)
                return Promise.resolve("User logged out properly");
            }).catch(
                err => {

                    console.log("FAILED TO LOGOUT ON ONE OF THE SERVERS !")
                    console.error(err)
                    console.log(err)
                }
            );
        }

        reducerDispatch({type: 'REDUXACTION_LOGOUT'})

        window.localStorage.clear()

        // Backend should have dealt with them, used to ensure if synchronization errors...
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        // Cookies.remove('loggedin_uid');
        Cookies.remove('session');





    }
}
