import React, { useState } from "react";
import "./commentsection.css";

const mouseTrackerHandler = (element, event) => {};
function MouseHighlightContainer() {
  const container = document.querySelector(".container");
  const highlight = document.createElement("div");
  highlight.classList.add("highlight");
  container.appendChild(highlight);

  container.addEventListener("mousemove", function (event) {
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    const cx = w / 2;
    const cy = h / 2;
    const dx = Math.abs(x - cx);
    const dy = Math.abs(y - cy);
    const maxd = Math.sqrt(Math.pow(w / 2, 2) + Math.pow(h / 2, 2));
    const percent =
      (maxd - Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))) / maxd;
    const size = 100 + percent * 100;
    highlight.style.width = `${size}%`;
    highlight.style.height = `${size}%`;
    highlight.style.top = `${cy - size / 2}px`;
    highlight.style.left = `${cx - size / 2}px`;
  });

  container.addEventListener("mouseleave", function (event) {
    highlight.style.width = "0";
    highlight.style.height = "0";
  });
}

function CommentSection({ __comments }) {
  //TODO PASS COMMENTS DATASTRUCTURE FROM BACKEND API

  const [comments, setComments] = useState([
    {
      id: 1,
      text: "This is the first comment",
      replies: [
        {
          id: 2,
          text: "This is a reply to the first comment",
          replies: [],
        },
      ],
    },
    {
      id: 3,
      text: "This is the second comment",
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  const handleNewComment = (e) => {
    setNewComment(e.target.value);
  };

  const handleReply = (id) => {
    if (replyTo == null) setReplyTo(id);
    else setReplyTo(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add new comment to comments list
    const updatedComments = [
      ...comments,
      { id: Date.now(), text: newComment, replies: [] },
    ];
    setNewComment("");
    setReplyTo(null);
    // Update comments state with new comment
    setComments(updatedComments);
    // You can pass this updatedComments state to your API or store it in local storage or database
  };

  const handleReplySubmit = (e, commentId) => {
    e.preventDefault();
    // Add new reply to comments list
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, { id: Date.now(), text: newComment }],
        };
      }
      return comment;
    });
    setNewComment("");
    setReplyTo(null);
    // Update comments state with new reply
    setComments(updatedComments);
    // You can pass this updatedComments state to your API or store it in local storage or database
  };

  return (
    <div style={{ background: "whitesmoke" }}>
      <div className="container">
        <h3>Comments</h3>
      </div>
      <hr />
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            <p>{comment.text}</p>
            <button onClick={() => handleReply(comment.id)}>Reply</button>
            {replyTo === comment.id && (
              <form onSubmit={(e) => handleReplySubmit(e, comment.id)}>
                <textarea value={newComment} onChange={handleNewComment} />
                <button type="submit">Submit Reply</button>
              </form>
            )}
            {comment.replies.length > 0 && (
              <ul>
                {comment.replies.map((reply) => (
                  <li key={reply.id}>
                    <p>{reply.text}</p>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <hr
        style={{
          color: "#441f01",
          backgroundColor: "#441f01",
          height: 5.5,
          borderColor: "#441f01",
          margin: "20px 10px",
        }}
      />
      <form onSubmit={handleSubmit}>
        <textarea value={newComment} onChange={handleNewComment} />
        <button type="submit">Submit Comment</button>
      </form>
    </div>
  );
}

export default CommentSection;
