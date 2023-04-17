import React, { useState } from 'react';
import './commentsection.css'
import UserDropDownMenu from "../UserDropDownMenu/UserDropDownMenu";
import {UserAvatarWithText} from "../Avatars";
import {useUserContext} from "../../context/UserContext";
import ReactionBox from "./ReactionBox";
import {epochToTimeAgo} from "../../utils/async_and_time_helpers";


function SqlDatetimeToAgoTime (sqlDatetime){
    return epochToTimeAgo(Date.parse(sqlDatetime) / 1000)
}

const MAX_NESTED_LEVEL = 1;
const MAX_NUMBER_OF_WORDS_BEFORE_HIDE = 150; //TODO
const MAX_NUMBER_OF_REPLIES_BEFORE_HIDE = 4; //TODO

  //TODO: If nestedLevel != 0, do not include a title because its a reply!!!!

function CommentCard({ commentObj, nestedLevel = 0 }) {
  const {state} = useUserContext(); // TODO ONLY FOR TESTING !!!!!

  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [replies, setReplies] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setReplies([...replies, newReply]);
    setNewReply('');
  };
  if (state.userData == null){
    return null;
  }
  return (
    <div className={(nestedLevel !== 0 ? "reply" : "comment") + "-card"}>
      <header className="comment-header">
        <span className="comment-avatar">
          {<UserDropDownMenu
                    triggerMenuMarkup={UserAvatarWithText(state.userData, 0,50)}
                    triggeredUserUid={state.userData.uid}
                />}
        </span>
        <span className="comment-info">
          <span className="comment-date"> &bull; Posted:&nbsp;{SqlDatetimeToAgoTime(commentObj.date)}</span>
          {!isNaN(Date.parse(commentObj.editDate)) && <span className="comment-date"> &nbsp; &bull; Edited:&nbsp;
               { SqlDatetimeToAgoTime(commentObj.editDate) }</span>}
        </span>
      </header>
      <article className="comment-content">
        <h2 className="comment-title"> {commentObj.title} </h2>
         <p className="comment-body">{commentObj.body}</p>
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
                <CommentCard key={index} commentObj={reply} nestedLevel={nestedLevel + 1} />
              ))}
              <form onSubmit={handleSubmit} className="reply-form">
                <input className="reply-input" type="text" value={newReply} onChange={(e) => setNewReply(e.target.value)} />
                <button className="reply-button" type="submit">Reply</button>
              </form>
            </div>
          }
        </>)
      }
      <ReactionBox/>
      </footer>
    </div>
  );
}

function Card({ title, body }) { //TODO PASS COMMENTS DATASTRUCTURE FROM BACKEND API
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
        <CommentCard key={index} commentObj={comment} />
      ))}
      <PostACommentForm handleNewComment={handleNewComment}/>
    </div>
  );
}
function PostACommentForm({handleNewComment}) {

  const [commentObj,setCommentObj] = useState(null)

  const handleSubmit = (event) => {
    event.preventDefault();

    //TODO  BACKEND API REQUESTS AND HANDLING HERE

    handleNewComment(commentObj) //TODO FETCH ASYNC THEN

    setCommentObj(null)

    document.forms[0].reset();
  }
  return (
      <form onSubmit={handleSubmit} className={'post-comment-form'}>
        <textarea name="post-comment-input" placeholder="Add a comment"
        onChange={(event) => setCommentObj(event.target.value)}/>
        <input className="post-comment-button" name="post-comment-button" type="submit"
        value="Post comment!"/>
      </form>
  )
}

function CommentSectionPage() {

  return (
    <div className="app">
      <Card
        title="Example Card"
        body="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </div>
  );
}

export default CommentSectionPage;