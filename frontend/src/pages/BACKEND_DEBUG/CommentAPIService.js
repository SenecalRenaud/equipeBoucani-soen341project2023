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
        return await fetch(`http://localhost:5000/delete/` + comment_id + '/',{
            'method':'DELETE',
            headers : {
                'Content-Type':'application/json',
            },
        })
            .then(response => response.json())
            .catch(error => console.log("API CORE EXCEPTION... " + error))
    }

    static async UpdateCommentPut(comment_id, request_body){
        return await fetch(`http://localhost:5000/update/` + comment_id + '/',{
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
                    console.log('no response after AJAX sign in CORS request to backend...');
                }

            })
            .then(data => data.json())

            .catch(error => console.log("API CORE EXCEPTION... " + error))
    }

    static async GetUserDetails(uid){
        return await fetch("http://localhost:5000/firebase-api/get-user/"
            + uid.toString() + "/",
            {
                'method': 'GET',
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
    static UserLogout(){
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('loggedin_uid');
        fetch("http://localhost:5000/firebase-api/logout", {
            credentials: "include"
        }).then(response => {
            return Promise.resolve("User logged out properly");
        });
        window.localStorage.clear()
}
}
