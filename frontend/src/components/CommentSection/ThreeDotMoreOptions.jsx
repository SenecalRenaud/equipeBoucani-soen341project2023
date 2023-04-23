import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faEdit, faTrashAlt,faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from "../../context/UserContext";
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";
import Modal from "react-modal";
import { SubmitCancelButton } from "../CoreUICard";
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
  },
}));

function ThreeDotMoreOptions({post_obj}) {
  const {state} = useUserContext();

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  const [isOpenEditModal,setIsOpenEditModal] = useState(false);
  const [toBeEditedData, setToBeEditedData] = useState({})
  const toggleModal = () => {
        setIsOpenEditModal(!isOpenEditModal);
    };

  const handleEdit = () => {
     CommentAPIService.UpdateCommentPut(toBeEditedData.id, {"title" : toBeEditedData.title, "body" : toBeEditedData.body})
      //.then((response) => props.postedComment(response))
      .then((any)=> window.location.reload())
      .catch(error => console.log('Following error occured after fetching from API: ',error))
    post_obj = toBeEditedData;
     setToBeEditedData({});
  }


  const handleOptionClick = (option) => {
    switch (option) {
      case "report":
        // Handle report option
        break;
      case "edit":
            setToBeEditedData(post_obj);
            toggleModal();
        break;
      case "delete":
        console.log("DELETING COMMENT #ID=" + post_obj.id)
        CommentAPIService.DeleteComment(post_obj.id)
            .then((any)=> window.location.reload())
            .catch(error => console.log('Following error occured after fetching from API: ',error))
       break;
      default:
        handleCloseMenu();
    }
  };

  return (
    <div className={classes.root}>
      <IconButton onClick={handleOpenMenu}>
        <FontAwesomeIcon icon={faEllipsisVertical} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleOptionClick.bind(null,"report")}>
            <FontAwesomeIcon icon={faFlag} style={{ marginRight: '0.5em' }} />
            Report</MenuItem>
        {(state.userData && (state.userData.uid === post_obj.posterUid ||
           state.userData.userType === "ADMIN")) && (
             [
             <MenuItem onClick={handleOptionClick.bind(null,"edit")}>
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: '0.5em' }} />
            Edit</MenuItem>,
        <MenuItem onClick={handleOptionClick.bind(null,"delete")}>
            <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: '0.5em' }} />
            Delete</MenuItem>
               ]
          )}
    <Modal isOpen={isOpenEditModal} onRequestClose={toggleModal} ariaHideApp={false}>
        <form onSubmit={() => {handleEdit(); toggleModal()}}>
            <br/><br/>
            <label>
                Title:
                <input
                    type="text"
                    name="commenttitle"
                    id="commenttitle"
                    onChange={(e) => {setToBeEditedData({...toBeEditedData,'title': e.target.value} )}}
                    value={toBeEditedData.title}
                />
            </label>
            <label>
                Body:
                <textarea
                    type="text"
                    name="commentbody"
                    id="commentbody"
                    rows="4" cols="75"
                    onChange={(e) => {setToBeEditedData({...toBeEditedData,'body': e.target.value} )}}
                    value={toBeEditedData.body}
                />
            </label>
            <SubmitCancelButton type="submit">Submit</SubmitCancelButton>
            <SubmitCancelButton onClick={() => toggleModal()}>Cancel</SubmitCancelButton>
        </form>
        <form onClose={toggleModal} />
    </Modal>
      </Menu>
    </div>
  );
}

export default ThreeDotMoreOptions;
