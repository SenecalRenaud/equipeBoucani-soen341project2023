import React, { useState } from 'react';
import './commentsection.css'

const mouseTrackerHandler = (element,event) => {

}
function MouseHighlightContainer(){
  var container = document.querySelector(".container");
  var highlight = document.createElement("div");
  highlight.classList.add("highlight");
  container.appendChild(highlight);

  container.addEventListener("mousemove", function(event) {
    var rect = container.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    var w = container.offsetWidth;
    var h = container.offsetHeight;
    var cx = w / 2;
    var cy = h / 2;
    var dx = Math.abs(x - cx);
    var dy = Math.abs(y - cy);
    var maxd = Math.sqrt(Math.pow(w / 2, 2) + Math.pow(h / 2, 2));
    var percent = (maxd - Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))) / maxd;
    var size = 100 + percent * 100;
    highlight.style.width = size + "%";
    highlight.style.height = size + "%";
    highlight.style.top = (cy - size / 2) + "px";
    highlight.style.left = (cx - size / 2) + "px";
});

  container.addEventListener("mouseleave", function(event) {
    highlight.style.width = "0";
    highlight.style.height = "0";
  });

}

const MAX_NESTED_LEVEL = 1;

function CommentCard({ commentObj, nestedLevel = 0 }) {

  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [replies, setReplies] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setReplies([...replies, newReply]);
    setNewReply('');
  };
  //TODO: If nestedLevel != 0, do not include a title because its a reply!!!!
  return (
    <div className={(nestedLevel !== 0 ? "reply" : "comment") + "-card"}>
      <p>{commentObj}</p>
        {
            nestedLevel < MAX_NESTED_LEVEL && ( <>

      <button className="toggle-replies" onClick={() => setShowReplies(!showReplies)}>
        {showReplies ? 'Hide Replies' : 'Show Replies'}
      </button>
      {showReplies &&
        <div className="replies">
          {replies.map((reply, index) => (
            <CommentCard key={index} commentObj={reply}
                     nestedLevel={nestedLevel + 1} />
          ))}
          <form onSubmit={handleSubmit} className="reply-form">
            <input className="reply-input" type="text" value={newReply} onChange={(e) => setNewReply(e.target.value)} />
            <button className="reply-button" type="submit">Reply</button>
          </form>
        </div>
      }
      </>)
  }
    </div>
  );
}

function Card({ title, body }) { //TODO PASS COMMENTS DATASTRUCTURE FROM BACKEND API
  const [comments,setComments] = useState(['Comment 1', 'Comment 2', 'Comment 3']);

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

  const [commentObj,setCommentObj] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault();

    //TODO  BACKEND API REQUESTS AND HANDLING HERE

    handleNewComment(commentObj) //TODO FETCH ASYNC THEN

    setCommentObj('')

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