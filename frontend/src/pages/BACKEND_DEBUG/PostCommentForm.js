import React, {useEffect,useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import './PostCommentForm.css';
import CoreUICard from "../../components/CoreUICard";
import CommentAPIService from "./CommentAPIService";
import SearchBar from "../../components/PostingsSearchBar/SearchBar";
import CoreUICardList from "../../components/CoreUICardList";
import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";
import {useUserContext} from "../../context/UserContext";
            // "Access-Control-Allow-Origin":  "http://localhost:3000/",
            // "Access-Control-Allow-Methods": "POST",
            // "Access-Control-Allow-Headers": "Content-Type, Authorization"
function PostCommentForm  (props)  {
    const { state } = useUserContext();

    var filteredIndicesHashSet = new Set();

    const [searchBarInput, setSearchBarInput] = useState('');

  const [commentTitle, setCommentTitle] = useState("");
  const [commentBody, setCommentBody] = useState("");

  let [data,setData] = useState([{}]);
  let [defaultData,setDefaultData] = useState([{}]);

    useEffect(() => {
        fetch("/getcomment?mapAsFields=true").then(
            response => response.json()
        ).then(
            data => {
                setData(data);
                setDefaultData(data);
                console.log(data);
            }
        )
    },[])
  const updateSearchInput = async (searchBarInput) => {

        filteredIndicesHashSet.clear();

        //TODO MAKE MORE EFFICIENT DATA-STRUCTURE WISE... THIS WORKS BUT ITS NOT QUITE SCALABLE
        for (let [fieldName,allFieldInstances] of Object.entries(defaultData)) {
            allFieldInstances.forEach(
                (fieldVal,dataIx) => {

                    if (fieldVal != null &&
                        fieldVal.toString().toLowerCase().includes(searchBarInput.toLowerCase()))
                        filteredIndicesHashSet.add(dataIx);

                }
            )
        }

     const filtered = Array.from(Object.values(defaultData)).map(
         row => row.filter(
             (fieldVal,dataIx) => filteredIndicesHashSet.has(dataIx)
     )
     );
        // console.log(filteredIndicesHashSet);
        // console.log(filtered)
     setSearchBarInput(searchBarInput);
     setData( //TODO MAKE MORE EFFICIENT DATA-STRUCTURE WISE... THIS WORKS BUT ITS NOT QUITE SCALABLE
         Object.keys(defaultData).reduce(
             (obj, key, index) => ({ ...obj, [key]: filtered[index] }), {})
     );

     document.getElementById("searchResultCount").innerText = filteredIndicesHashSet.size;
  }


  const handleSubmit = (event) => {
    event.preventDefault();

    CommentAPIService.AddCommentPost(
        {"title" : commentTitle, "body" : commentBody, "posterUid" : state.userData.uid})
      .then((response) => props.postedComment(response))
        .then((any)=> window.location.reload())
      .catch(error => console.log('Following error occured after fetching from API: ',error))

    setCommentTitle('')
    setCommentBody('')

  };

    // POLLING_DATABASE_UPDATE_INTERVAL = 5




    return (
    <div className="post-comment-container">
        <div style={{display: 'flex', justifyContent: 'space-evenly', height: "100px", background: "#f35f07",borderRadius:
                "50%",opacity: "90%",borderColor: "black",borderWidth:"8px"}}>
                    <button onClick={(event => {
                fetch(`https://geolocation-db.com/json/`
                ).then(response => response.json())
                    .then(data => {let msg = "Your IPv4: " + data.IPv4; alert(msg); return msg;})
                    .then(msg => console.log(msg))
                    .catch(err => console.log("AUTHENTICATE ERROR: ", err))

                fetch(`http://localhost:5000/firebase-api/authenticate`
                    ,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${Cookies.get('access_token')}`
                        },
                        body: JSON.stringify({
                                'idToken': Cookies.get('access_token'),
                                'refreshToken': Cookies.get('refresh_token')
                            }
                        )
                    }
                )
            })}>
                LOG IPV4
            </button>
            <button onClick={(event => {console.log(state); alert("User Hooked Context:\n" +
                Object.entries(state.userData).join("\n\r")) })}>
                TEST REDUCERCONTEXT STATE
            </button>
            <button onClick={(event =>
                {

                    console.log(jwtDecode(Cookies.get("access_token")))
                    alert("Your Decoded still valid idToken: " + JSON.stringify(jwtDecode(Cookies.get("access_token"))))
                }
            )}>
                DECODE JWT TOKEN
            </button>
            <button
                onClick={async (e)=>{
                     let decodedtoken = jwtDecode(Cookies.get("access_token"));
                     await fetch(`/firebase-api/authenticate`,{
                         method : 'GET',
                         headers: {
                             'Authorization': `Bearer ${Cookies.get('access_token')}`
                         },
                         credentials: "include"

                }).then(
                    response => response.json()
                     ).then(
                         data => {
                             console.log("TEST RESULT:")
                             console.log(data)
                         }
                     )
                }
            }
            >
                Test Backend Authorization
            </button>
            </div>
        <header className="Debug-header">
        <h1> Postings  </h1>
            <h3> Antoine C. V2 Stable   <span style={{color: 'red'}}> </span></h3>
        </header>
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignContent: 'flex-start',alignItems: 'stretch'}}>
            <section style={{display: 'flex', justifyContent:'space-between',alignItems: 'stretch', margin: '1em 0.2em'}}>
                <span> Search:&ensp; </span>
                <SearchBar
                    keyword={searchBarInput}
                    setKeyword={updateSearchInput}
                />
                &emsp;
                    <FontAwesomeIcon
                        id='postingsFilterButton'
                        style={{cursor: 'pointer'}}
                        icon={faFilter}
                        onClick={(e)=> {alert("Filters are not ready to be implemeted yet! Soon !");}}
                    />

            </section>
           <span style={{display: 'inline-block' ,fontSize: '.9em' , marginTop: "-1rem"}}>
                 <b id="searchResultCount"> Found {(data.id ? data.id.length : 0)} results.</b>
            </span>

            <hr  style={{
    color: '#000000',
    backgroundColor: '#000000',
    height: 5.5,
    borderColor : '#000000'
}}/>
            <div className="job-posts">
        <CoreUICardList data={data}/>

        </div>
        </div>
        <h3> Post a new job </h3>
        <form onSubmit={handleSubmit}>
            <label htmlFor="comment_title">Title </label>
            <input type="text" id="comment_title" name="comment_title"
                    value={commentTitle}
                    onChange={(e) => setCommentTitle(e.target.value)}
                    required
                />

                <label htmlFor="comment_body">Comment</label>
                <textarea
                    id="comment_body"
                    name="comment_body"
                    rows="4"
                    cols="50"
                    placeholder="What's on your mind?"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    required
                ></textarea>

                <div className="submit-button-wrapper">
                    <button id="submitComment" type="submit">
                        Publish
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostCommentForm;

