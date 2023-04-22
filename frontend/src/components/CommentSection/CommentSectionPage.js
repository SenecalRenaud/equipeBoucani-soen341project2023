import React, { useCallback, useEffect, useState } from "react";
import './commentsection.css'
import UserDropDownMenu from "../UserDropDownMenu/UserDropDownMenu";
import {UserAvatarWithText} from "../Avatars";
import {useUserContext} from "../../context/UserContext";
import ReactionBox from "./ReactionBox";
import {epochToTimeAgo} from "../../utils/async_and_time_helpers";
import ThreeDotMoreOptions from "./ThreeDotMoreOptions";
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";


function SqlDatetimeToAgoTime (sqlDatetime){
    return epochToTimeAgo(Date.parse(sqlDatetime) / 1000)
}

const MAX_NESTED_LEVEL = 1;
const MAX_NUMBER_OF_WORDS_BEFORE_HIDE = 150; //TODO
const MAX_NUMBER_OF_REPLIES_BEFORE_HIDE = 4; //TODO

  //TODO: If nestedLevel != 0, do not include a title because its a reply!!!!

function CommentCard({ commentObj, nestedLevel = 0 ,parent_card_id}) {

  const {state} = useUserContext();

  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [replies, setReplies] = useState([]);

   //TODO CACHE AND MEMOIZE WITH USEMEMO+USECALLBACK
  const [userCache, setUserCache] = useState({});
  
  useEffect(() => {
    CommentAPIService.GetUserDetails(commentObj.posterUid).then(
      data => {
        setUserCache(data)
        setReplies(commentObj.replies)
      }
    )
    
  },[commentObj.posterUid])

//   const getUserInfo = useCallback(async (uid) => {
//     if (userCache[uid]) {
//       return userCache[uid];
//     }
//
//     const userInfo = await CommentAPIService.GetUserDetails(uid);
//     setUserCache((prevCache) => ({ ...prevCache, ...userInfo }));
//
//     return userInfo;
// }, [userCache]);
  const handleSubmit = (e) => {
    e.preventDefault();
    let newReplyObj =       {
        body: newReply,
        title: null,
        posterUid : state.userData.uid,
        // date: new Date().toISOString().slice(0,19),
        post_id: parent_card_id,
        parent_id: commentObj.id
      };
    CommentAPIService.AddCommentPost(
      newReplyObj
    ).then(
      data => {
          console.log("POSTED REPLY !")
          console.log(newReplyObj)
          setNewReply('');
          setReplies([...replies, newReplyObj]);
          commentObj.replies.append(newReplyObj)

      }
    )


  };

  //getUserInfo(commentObj.posterUid)

  if (userCache == null){

    return null;
  }
  return (
    <div className={(nestedLevel !== 0 ? "reply" : "comment") + "-card"}>
      <header className="comment-header">
        <span className="comment-avatar">
          {<UserDropDownMenu
                    triggerMenuMarkup={UserAvatarWithText(
                      userCache, 0,50)}
                    triggeredUserUid={commentObj.posterUid}
                />}
        </span>
        <span className="comment-info">
          <span className="comment-date"> &bull;&nbsp;{SqlDatetimeToAgoTime(commentObj.date)}</span>
          {!isNaN(Date.parse(commentObj.editDate)) && <span className="comment-date"> &nbsp; &bull; Edited:&nbsp;
               { SqlDatetimeToAgoTime(commentObj.editDate) }</span>}

        </span>
        <span className="comment-moreoptions"> <ThreeDotMoreOptions/> </span>
      </header>
      <article className="comment-content">
        <h2 className="comment-title"> {commentObj.title} </h2>
         <p className="comment-body">{commentObj.body}</p>
        <ReactionBox/>
      </article>

      <footer className="comment-footer">
      {
        nestedLevel < MAX_NESTED_LEVEL && ( <>
          <button className="toggle-replies" onClick={() => setShowReplies(!showReplies)}>
            {showReplies ? 'Hide Replies' : 'Show Replies'}
          </button>
          {showReplies &&
            <div className="replies">
              {replies.map((reply, index) => (
                <CommentCard key={index} commentObj={reply} nestedLevel={nestedLevel + 1}
                             parent_card_id={commentObj.id} />
              ))}
              <form onSubmit={handleSubmit} className="reply-form">
                <input className="reply-input" type="text" value={newReply} onChange={(e) => setNewReply(e.target.value)} />
                <button className="reply-button" type="submit">Reply</button>
              </form>
            </div>
          }
        </>)
      }

      </footer>
    </div>
  );
}

function Card({ title, body, post_id}) {
  const [comments,setComments] = useState(
      [
          {
              title: "Comment 1",
              body:  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.".repeat(20),
              date : "2023-02-3 13:19:03",
              editDate: "2023-04-16 23:09:17",
              posterUid: "RJA0ysCVJCfd9mlFrV31zyMXftF3"
          }
          ,
            {
              title: "Comment 2",
              body:  "Lorem ipsum dolor sit amet, consectetur adipiscing elit.".repeat(3),
              date : "2022-11-6 10:56:47",
              editDate: "NULL",
              posterUid: "ahSBM7SDQ4VyKGDnZbIdj2MVbCf2"
          }]);
    useEffect(() => {
      fetch("/getcomment?ignore=replies&mapAsFields=false").then(
          response => response.json()
      ).then(
          data => {
            if (data != null && data.length > 0)
              setComments(data);

          }
      )
  },[])
  const handleNewComment = (newComment) => {
      let newComments = [...comments,newComment]
      setComments(newComments)
  }
  return (
    <div className="card">
      <h2>{title}</h2>
      <p>{body}</p>
      <h3>Comments:</h3>
      {comments.map((comment, index) => (
        <CommentCard key={index} commentObj={comment} parent_card_id={post_id} />
      ))}
      <PostACommentForm handleNewComment={handleNewComment}  parent_card_id={post_id}/>
    </div>
  );
}
function PostACommentForm({handleNewComment,parent_card_id}) {
  const {state} = useUserContext();
  const [commentTitle,setCommentTitle] = useState("")
  const [commentBody,setCommentBody] = useState("")

  const handleSubmit = (event) => {
    event.preventDefault();

    let commentObj = {
        title: commentTitle,
        body: commentBody,
        // date: new Date().toISOString().slice(0,19),
        posterUid: state.userData.uid,
        post_id: parent_card_id
      }

    CommentAPIService.AddCommentPost(
      commentObj
    ).then(
      data => {
        handleNewComment(
          commentObj
        )
      setCommentTitle("")
      setCommentBody("")
      }
    )

    document.forms[0].reset();

  }
  return (
      <form onSubmit={handleSubmit} className={'post-comment-form'}>
        <input type="text" name="post-comment-input-title"
               placeholder="Your comment title..."
               onChange={(event) => setCommentTitle(event.target.value)} required/>
        <textarea name="post-comment-input-body" placeholder="Your comment..."
        onChange={(event) => setCommentBody(event.target.value)} required/>
        <input className="post-comment-button" name="post-comment-button" type="submit"
        value="Post comment!" required/>
      </form>
  )
}

function CommentSectionPage() {

  return (
    <div className="app">
      <Card
        title="Example Card"
        body="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        post_id={2}
      />
    </div>
  );
}

export default CommentSectionPage;