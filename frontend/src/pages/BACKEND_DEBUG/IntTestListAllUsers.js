import {useState} from "react";
//import './IntTestListAllUsers.css';
//import CoreUICard from "../../components/CoreUICard";
import CommentAPIService from "./CommentAPIService";
            // "Access-Control-Allow-Origin":  "http://localhost:3000/",
            // "Access-Control-Allow-Methods": "POST",
            // "Access-Control-Allow-Headers": "Content-Type, Authorization"
const IntTestListAllUsers = (props) => {
  const [commentTitle, setCommentTitle] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const handleSubmit = async (event) => {
    event.preventDefault();

    CommentAPIService.AddCommentPost({commentTitle,commentBody})
      .then((response) => props.postedComment(response))
      .catch(error => console.log('Following error occured after fetching from API: ',error))

    setCommentTitle('')
    setCommentBody('')
  };

    // POLLING_DATABASE_UPDATE_INTERVAL = 5

    // let [data,setData] = useState([{}]);
    // useEffect(() => {
    //     fetch("/get?mapAsFields=true").then(
    //         response => response.json()
    //     ).then(
    //         data => {
    //             setData(data);
    //             console.log(data);
    //         }
    //     )
    // },[])
    return (
    <div >

        {/*<header className="Debug-header">*/}
        {/*<h1> Flask and React integration </h1>*/}
        {/*    <h3>by Antoine Cantin. TEMPORARY PAGE to test requests,routes,etc.. and api feature*/}
        {/*        /!* eslint-disable-next-line react/style-prop-object *!/*/}
        {/*        of the backend. <span style={{color: 'red'}}> DO NOT EDIT</span>.</h3>*/}
        {/*</header>*/}
{/*        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignContent: 'flex-start',alignItems: 'stretch'}}>*/}
{/*            <hr  style={{*/}
{/*    color: '#000000',*/}
{/*    backgroundColor: '#000000',*/}
{/*    height: 5.5,*/}
{/*    borderColor : '#000000'*/}
{/*}}/>*/}

{/*            {(typeof data.id === 'undefined') ? (*/}
{/*                <p>Loading... (Dont forget to launch the API/backend server !)</p>*/}

{/*            ) : (*/}
{/*                data.id.map((id,i) => (*/}
{/*                    <CoreUICard key={i}*/}
{/*                        title={data.title[i]}*/}
{/*                        body={data.body[i]}*/}
{/*                                id={id}*/}
{/*                                date={data.date[i]}*/}
{/*                    />*/}



{/*                ))*/}
{/*            )*/}

{/*            }*/}
{/*        </div>*/}
{/*        <h3> Post a new comment </h3>*/}
        <form onSubmit={handleSubmit}>
            <label htmlFor="comment_title">Title </label>
            <input type="text" id="comment_title" name="comment_title"
                    value={commentTitle}
                    onChange={(e) => setCommentTitle(e.target.value)}
                    required/>
            <label htmlFor="comment_body">Comment </label>
            <textarea id="comment_body" name="comment_body" rows="4" cols="75" placeholder="Whats on your mind?"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    required>
            </textarea>
            <label htmlFor="submitComment"></label><input id="submitComment" type="submit" value="Publish"/>

        </form>
    </div>
    );
}

export default IntTestListAllUsers;

