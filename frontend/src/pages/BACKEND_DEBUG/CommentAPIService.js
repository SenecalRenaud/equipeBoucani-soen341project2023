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
        })
            //.then(response => response.json())
            .catch(error => console.log("API CORE EXCEPTION... " + error))
    }

    static async UserSignIn(formData){
        return await fetch(`http://localhost:5000/firebase-api/signin`,{
            //'mode': "no-cors",//remove this line if troublesome in environment where deployed
            'method':'POST',
            body:formData,
        })
            //.then(response => response.json())
            .catch(error => console.log("API CORE EXCEPTION... " + error))
    }
}
