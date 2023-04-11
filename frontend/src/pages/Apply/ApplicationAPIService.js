import Cookies from "js-cookie";
export default class ApplicationAPIService{

    static async AddApplication(request_body){
        return await fetch(`http://localhost:5000/addapplication`,{
            //'mode': "no-cors",//remove this line if troublesome in environment where deployed
            'method':'POST',
            headers : {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${Cookies.get('access_token')}`
            },
            body:JSON.stringify(request_body)
        })
            .then(response => response.json())
            .catch(error => {
                console.log("CRUD APPLICATION (ADD) API CORE EXCEPTION... ")
                console.log(error)
            })
    }

    static async DeleteApplication(application_id){
        return await fetch(`http://localhost:5000/deleteapplication/` + application_id + '/',{
            'method':'DELETE',
            headers : {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${Cookies.get('access_token')}`
            },
        })
            .then(response => response.json())
            .catch(error => {
                    console.log("CRUD APPLICATION (DEL) API CORE EXCEPTION... ")
                    console.log(error)
                }
            )
    }
}

