import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown, faHeart, faPlus } from '@fortawesome/free-solid-svg-icons';

const useStyles = makeStyles((theme) => ({
  reactionButton: {
    marginRight: theme.spacing(1),
  },
  reactionCount: {
    marginRight: theme.spacing(2),
  },
}));

function ReactionBox() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [reactions, setReactions] = useState({
    likes: 10,
    dislikes: 2,
    favorites: 5,
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReaction = (reaction) => {
    setReactions({
      ...reactions,
      [reaction]: reactions[reaction] + 1,
    });
    handleClose();
  };

  return (
    <div className="reaction-box">
      <IconButton
        aria-controls="reaction-menu"
        aria-haspopup="true"
        className={classes.reactionButton}
        onClick={handleClick}
      >
        <FontAwesomeIcon icon={faPlus} />
      </IconButton>
      {Object.entries(reactions).map(([reaction, count]) => (
        <React.Fragment key={reaction}>
          <span className={classes.reactionCount}>{count}</span>
          {reaction === 'likes' && <FontAwesomeIcon className={classes.reactionButton} icon={faThumbsUp} />}
          {reaction === 'dislikes' && <FontAwesomeIcon className={classes.reactionButton} icon={faThumbsDown} />}
          {reaction === 'favorites' && <FontAwesomeIcon className={classes.reactionButton} icon={faHeart} />}
        </React.Fragment>
      ))}
      <Menu
        id="reaction-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => handleReaction('likes')}>
          <FontAwesomeIcon className={classes.reactionButton} icon={faThumbsUp} /> Like
        </MenuItem>
        <MenuItem onClick={() => handleReaction('dislikes')}>
          <FontAwesomeIcon className={classes.reactionButton} icon={faThumbsDown} /> Dislike
        </MenuItem>
        <MenuItem onClick={() => handleReaction('favorites')}>
          <FontAwesomeIcon className={classes.reactionButton} icon={faHeart} /> Favorite
        </MenuItem>
      </Menu>
    </div>
  );
}

export default ReactionBox;
