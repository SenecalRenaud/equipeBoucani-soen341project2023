export default class JobPostingAPIService{

    static async AddJobPosting(request_body){
        return await fetch(`http://localhost:5000/addjob`,{
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

    static async DeleteJobPosting(job_id){
        return await fetch(`http://localhost:5000/deletejob/` + job_id + '/',{
            'method':'DELETE',
            headers : {
                'Content-Type':'application/json',
            },
        })
            .then(response => response.json())
            .catch(error => console.log("API CORE EXCEPTION... " + error))
    }

    static async EditJobPosting(job_id, request_body){
        return await fetch(`http://localhost:5000/updatejob/` + job_id + '/',{
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

    static async sendNotification(job_title, email, applicant_name){
        return await fetch('http://localhost:5000/sendmail/' + email + '/' + job_title + '/' + applicant_name + '/', {
            headers : {
                'Content-Type':'application/json',
            },
        })
            .then(response => response.json())
            .catch(error => console.log("API CORE EXCEPTION... " + error))
    }
}

