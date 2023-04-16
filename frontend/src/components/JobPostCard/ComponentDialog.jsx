import { useState } from "react";
import { Button, Dialog, DialogContent } from "@material-ui/core";

export default function ComponentDialog({
  button_component,
  content_component,
}) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="text" color="primary" onClick={handleClickOpen}>
        {button_component}
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>{content_component}</DialogContent>
      </Dialog>
    </div>
  );
}
