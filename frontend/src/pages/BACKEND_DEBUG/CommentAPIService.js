import Cookies from "js-cookie";

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

    static async UserSignIn(formData){
        return await fetch(`http://localhost:5000/firebase-api/signin`,{
            'method':'POST',
            body:formData,
            credentials: "include" // To get cookies in AJAX request from backend origin
        })
            .then(response => {

                if(response.ok){
                    return response;
                }else{
                    console.log('BAD SIGNIN RESPONSE AFTER AJAX FETCH !');
                    response.json().then(data => {
                        throw new Error(data.message)
                    }
                    ).catch(err => alert(err))
                }

            })
            .then(data => data.json())
            .then(auth_json => {

                let expires = new Date();
                expires.setTime(expires.getTime() + (auth_json.expires_in * 250 ));
                Cookies.set('access_token', auth_json.idToken);
                Cookies.set('refresh_token', auth_json.refreshToken);
                Cookies.set('loggedin_uid', auth_json.localId);
                // setCookie('access_token', auth_json.idToken, { path: '/',  expires})
                // setCookie('refresh_token', auth_json.refresh_token, {path: '/', expires})
                // setCookie('loggedin_uid', auth_json.localId, {path: '/', expires})
                console.log(auth_json)

                window.localStorage.setItem("firstName",auth_json.firstName)
                window.localStorage.setItem("lastName",auth_json.lastName)
                window.localStorage.setItem("email",auth_json.email)
                window.localStorage.setItem("photo_url",auth_json.photo_url)
                window.localStorage.setItem("resume_url",auth_json.resume_url)
                window.localStorage.setItem("lastSeenEpoch",auth_json.lastSeenEpoch)
                window.localStorage.setItem("creationEpoch",auth_json.creationEpoch)
                window.localStorage.setItem("userType",auth_json.userType)
                window.localStorage.setItem("uid",auth_json.localId)
                    //TODO CryptoJs. auth_json.uid


            })
            .then((any)=> window.location.replace('http://localhost:3000/'))
            .catch(error => console.log('Following error occured after fetching from API: ',error))

    };


    static async GetUserDetails(uid){
        return await fetch(
            `http://localhost:5000/firebase-api/get-user/${uid.toString()}/`,
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
            data => data.json()
        )
    }
    static UserLogout({frontend_logout_only=false} ={}){

        // Cookies.remove('BACKEND_SESSION_ENDED')

        // Backend should have dealt with them, used to ensure if synchronization errors...
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('loggedin_uid');

        window.localStorage.clear()

        if(!frontend_logout_only) {
            fetch("http://localhost:5000/firebase-api/logout", {
                credentials: "include"
            }).then(response => {
                return Promise.resolve("User logged out properly");
            });
        }






    }
}
