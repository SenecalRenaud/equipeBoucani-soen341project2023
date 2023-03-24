import React, { useState } from 'react';
import Cookies from 'js-cookie';
const SESSION_COOKIES_DEBUG  = () => {
        function getAllCookies() {
      return fetch("http://localhost:5000/getall-cookies/", {
        credentials: "include"
      }).then(response => {
        return response.json()
      }).then(json => {
            var htmluserinfo = document.getElementById("loggedinUserInfo")
            htmluserinfo.innerText = JSON.stringify(json,null,'\t')
      });
    }

    function getACookie() {
      return fetch("http://localhost:5000/get-cookie/", {
        credentials: "include"
      }).then(response => {
        // make sure to check response.ok in the real world!
        return Promise.resolve("All good, fetch the data");
      });
    }

    function removeCookies() {
        Cookies.remove('access_token');
        Cookies.remove('refresh_token');
        Cookies.remove('loggedin_uid');
        fetch("http://localhost:5000/firebase-api/logout", {
            credentials: "include"
        }).then(response => {
            return Promise.resolve("User logged out properly");
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
            // setLoggedinUser(json);
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
            <p></p>
            <button id="ajaxFetchCookiesButton"
                    onClick=
                        {(e)=>
                        {getAllCookies()}}
                    >
                SHOW ALL COOKIES
            </button>
            <br/>
            <br/>
            <button id="removeCookies"
                    onClick=
                        {(e)=>
                        {removeCookies();window.location.replace('http://localhost:3000')}}
            >
                SignOut
            </button>
            <section style={{color: "lightblue"}}>
            <h3 > Logged In user info: {Cookies.get('loggedin_uid')}</h3>

            <article id="loggedinUserInfo">

            </article>
                </section>


        </div>
    )


}

export default SESSION_COOKIES_DEBUG;