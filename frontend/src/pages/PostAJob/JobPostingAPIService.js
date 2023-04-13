import Cookies from "js-cookie";
export default class JobPostingAPIService{

    static async AddJobPosting(request_body){
        return await fetch(`http://localhost:5000/addjob`,{
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
                console.log("CRUD JOBPOST (ADD) API CORE EXCEPTION... ")
                console.log(error)
            })
    }

    static async DeleteJobPosting(job_id){
        return await fetch(`http://localhost:5000/deletejob/` + job_id + '/',{
            'method':'DELETE',
            headers : {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${Cookies.get('access_token')}`
            },
        })
            .then(response => response.json())
            .catch(error => {
                    console.log("CRUD JOBPOST (DEL) API CORE EXCEPTION... ")
                    console.log(error)
                }
            )
    }

    static async EditJobPosting(job_id, request_body){
        return await fetch(`http://localhost:5000/updatejob/` + job_id + '/',{
            //'mode': "no-cors",//remove this line if troublesome in environment where deployed
            'method':'PUT',
            headers : {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${Cookies.get('access_token')}`
            },
            body:JSON.stringify(request_body)
        })
            .then(response => response.json())
            .catch(error => {
                console.log("CRUD JOBPOST (EDIT) API CORE EXCEPTION... ")
                console.log(error)
            })
    }

    static async sendNotification(request_body){
        return await fetch('http://localhost:5000/sendApplicationMail/', {
            'method': 'PUT',
            headers : {
                'Content-Type':'application/json',
            },
            body:JSON.stringify(request_body)
        })
            .then(response => response.json())
            .catch(error => console.log("NOTIFICATION (SEND) API CORE EXCEPTION... " + error))
    }

    static async sendAcceptedNotification(request_body){
        return await fetch('http://localhost:5000/sendAcceptedMail/', {
            'method': 'PUT',
            headers : {
                'Content-Type':'application/json',
            },
            body:JSON.stringify(request_body)
        })
            .then(response => response.json())
            .catch(error => console.log("NOTIFICATION (SEND) API CORE EXCEPTION... " + error))
    }

    static async sendRejectedNotification(request_body){
        return await fetch('http://localhost:5000/sendRejectedMail/', {
            'method': 'PUT',
            headers : {
                'Content-Type':'application/json',
            },
            body:JSON.stringify(request_body)
        })
            .then(response => response.json())
            .catch(error => console.log("NOTIFICATION (SEND) API CORE EXCEPTION... " + error))
    }
}

