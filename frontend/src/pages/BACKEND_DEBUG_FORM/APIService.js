export default class APIService{

    static async InsertArticle(request_body){
        return await fetch(`http://localhost:5000/add`,{
            //'mode': "no-cors",//remove this line if troublesome in environment where deployed
            'method':'POST',
             headers : {
            'Content-Type':'application/json',
      },
            body:JSON.stringify(request_body)
    })
    .then(response => response.json())
    .catch(error => console.log(error))
    }
}
