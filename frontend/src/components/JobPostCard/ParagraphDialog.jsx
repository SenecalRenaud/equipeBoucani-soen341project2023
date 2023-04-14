import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import cl_img from "../../assets/cover.png";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
    content: {
    padding: theme.spacing(3),
    textAlign: 'justify',
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
  },
}));


export default function ParagraphDialog({text_body}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const body = (
    <div className={classes.paper}>
      <Typography variant="h6" gutterBottom>
        Body:
      </Typography>
      <Typography variant="body1" gutterBottom>
          {text_body}
      </Typography>
    </div>
  );
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Letter: <img  className='cardimagecl' src={cl_img} alt="coverletter"/>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Applicant's Cover Letter</DialogTitle>
        <DialogContent>
            {body}
          {/*<Typography className={classes.content}>*/}
          {/*    {body}*/}
          {/*</Typography>*/}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}