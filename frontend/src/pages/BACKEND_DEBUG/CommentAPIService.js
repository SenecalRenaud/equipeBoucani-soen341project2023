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
}
// const formElem_onsubmit = async (e) => {
//   e.preventDefault();
//   var form = document.querySelector("#formElem");
//  // var form = document.forms[0];
//     // let data = {
//     //   title : form.querySelector('input[name="comment_title"]').value,
//     //   body : form.querySelector('input[name="comment_body"]').value
//     // }
//
// };