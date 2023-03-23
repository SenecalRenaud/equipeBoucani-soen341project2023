import React, { useState } from 'react';

const SESSION_COOKIES_DEBUG  = () => {
    const [loggedinUser, setLoggedinUser] = useState({});

    function getACookie() {
      return fetch("http://localhost:5000/get-cookie/", {
        credentials: "include"
      }).then(response => {
        // make sure to check response.ok in the real world!
        return Promise.resolve("All good, fetch the data");
      });
    }

    function getData() {
      fetch("http://localhost:5000/api/cookies_test/", {
        credentials: "include"
      })
        .then(response => {
          // make sure to check response.ok in the real world!
          return response.json();
        })
        .then(json =>
        {
            console.log(json);
            // TODO HERE: SET OR UNSET CLIENT-SIDE COOKIES
            setLoggedinUser(json);
            var htmluserinfo = document.getElementById("loggedinUserInfo")
            htmluserinfo.innerText = JSON.stringify(json,null,'\t')
        });
    }

    return (
        <div>
            <p style={{margin: "auto 5rem", color: "white"}}> We want cross origin backend to be able to give his
                user session cookies to frontend, a frontend that
                is able to AJAX request them normally and gain access
                to required headers and application/* binaries as to
                make a client-side API that allow frontend to know
                user info and log in state... locally... without
                creating vulnerabilities with localStorage since everything
                dangerous would still be in backend
            </p>
            <button id="ajaxFetchCookiesButton"
                    onClick=
                        {(e)=>
                        {getACookie().then(() => getData());}}
                    >
                FETCH
            </button>
            <section style={{color: "lightblue"}}>
            <h3 > Logged In user info: </h3>

            <article id="loggedinUserInfo">

            </article>
                </section>


        </div>
    )


}

export default SESSION_COOKIES_DEBUG;