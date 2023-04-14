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


function Comment({ comment }) {
  const [showReplies, setShowReplies] = useState(false);
  const [newReply, setNewReply] = useState('');
  const [replies, setReplies] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setReplies([...replies, newReply]);
    setNewReply('');
  };

  return (
    <div className="comment">
      <p>{comment}</p>
      <button className="toggle-replies" onClick={() => setShowReplies(!showReplies)}>
        {showReplies ? 'Hide Replies' : 'Show Replies'}
      </button>
      {showReplies &&
        <div className="replies">
          {replies.map((reply, index) => (
            <Comment key={index} comment={reply} />
          ))}
          <form onSubmit={handleSubmit}>
            <input className="reply-input" type="text" value={newReply} onChange={(e) => setNewReply(e.target.value)} />
            <button className="reply-button" type="submit">Reply</button>
          </form>
        </div>
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
        <Comment key={index} comment={comment} />
      ))}

    </div>
  );
}
function PostACommentForm({handleNewComment}) {

  const [commentObj,setCommentObj] = useState('')

  return (
      <form onSubmit={}>
        <input name="comment-input" type="text" placeholder="Add a comment" />
        <input name="comment-button" type="submit">Comment</input>
      </form>
  )
}
function CommentSectionPage() {

  return (
    <div className="app">
      <Card
        title="Example Card"
        content="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      />
    </div>
  );
}

export default CommentSectionPage;
// function CommentSectionPage({ __comments }) {
//
//   const [comments,setComments] = useState(
//       [{
//       id: 1,
//       text: 'This is the first comment',
//       replies: [
//         {
//           id: 2,
//           text: 'This is a reply to the first comment',
//           replies: [],
//         },
//       ],
//     },
//     {
//       id: 3,
//       text: 'This is the second comment',
//       replies: [],
//     },
//   ]
//   )
//
//   const [newComment, setNewComment] = useState('');
//   const [replyTo, setReplyTo] = useState(null);
//
//   const handleNewComment = (e) => {
//     setNewComment(e.target.value);
//   };
//
//   const handleReply = (id) => {
//     if(replyTo == null)
//       setReplyTo(id);
//     else
//       setReplyTo(null)
//   };
//
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add new comment to comments list
//     const updatedComments = [
//       ...comments,
//       { id: Date.now(), text: newComment, replies: [] },
//     ];
//     setNewComment('');
//     setReplyTo(null);
//     // Update comments state with new comment
//     setComments(updatedComments)
//     // You can pass this updatedComments state to your API or store it in local storage or database
//   };
//
//   const handleReplySubmit = (e, commentId) => {
//     e.preventDefault();
//     // Add new reply to comments list
//     const updatedComments = comments.map((comment) => {
//       if (comment.id === commentId) {
//         return {
//           ...comment,
//           replies: [
//             ...comment.replies,
//             { id: Date.now(), text: newComment },
//           ],
//         };
//       }
//       return comment;
//     });
//     setNewComment('');
//     setReplyTo(null);
//     // Update comments state with new reply
//     setComments(updatedComments)
//     // You can pass this updatedComments state to your API or store it in local storage or database
//   };
//
//   return (
//     <div style={{background: "whitesmoke"}}>
//       <div className="container">
//       <h3>Comments</h3>
//       </div>
//       <hr/>
//       <ul>
//         {comments.map((comment) => (
//           <li key={comment.id}>
//             <p>{comment.text}</p>
//             <button onClick={() => handleReply(comment.id)}>Reply</button>
//             {replyTo === comment.id && (
//               <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
//                 <textarea value={newComment} onChange={handleNewComment} />
//                 <button type="submit">Submit Reply</button>
//               </form>
//             )}
//             {comment.replies.length > 0 && (
//               <ul>
//                 {comment.replies.map((reply) => (
//                   <li key={reply.id}>
//                     <p>{reply.text}</p>
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </li>
//         ))}
//       </ul>
//                  <hr  style={{
//     color: '#441f01',
//     backgroundColor: '#441f01',
//     height: 5.5,
//     borderColor : '#441f01',
//     margin: '20px 10px'
// }}/>
//       <form onSubmit={handleSubmit}>
//         <textarea value={newComment} onChange={handleNewComment} />
//         <button type="submit">Submit Comment</button>
//       </form>
//     </div>
//   );
// }
//
// export default CommentSectionPage;

