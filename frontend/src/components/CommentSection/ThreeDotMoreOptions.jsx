import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton, Menu, MenuItem } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag, faEdit, faTrashAlt,faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'inline-block',
  },
}));

function ThreeDotMoreOptions() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option) => {
    switch (option) {
      case "report":
        // Handle report option

      case "edit":
        // Handle edit option

      case "delete":
        // Handle delete option

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
        <MenuItem onClick={handleOptionClick.bind(null,"edit")}>
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: '0.5em' }} />
            Edit</MenuItem>
        <MenuItem onClick={handleOptionClick.bind(null,"delete")}>
            <FontAwesomeIcon icon={faTrashAlt} style={{ marginRight: '0.5em' }} />
            Delete</MenuItem>
      </Menu>
    </div>
  );
}

export default ThreeDotMoreOptions;
