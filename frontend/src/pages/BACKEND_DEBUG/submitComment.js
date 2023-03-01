
const formElem_onsubmit = async (e) => {
    console.log("23424234")
  e.preventDefault();
  var form = document.querySelector("#formElem");
 // var form = document.forms[0];

    let data = {
      title : form.querySelector('input[name="comment_title"]').value,
      body : form.querySelector('input[name="comment_body"]').value
    }
    console.log(data)
    let response = await fetch('http://localhost:5000/add', {
            method: 'POST', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
    })

    let text = await response.text(); // read response body as text
    document.querySelector("#decoded").innerHTML = text;
};