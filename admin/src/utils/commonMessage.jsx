import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

function CommonMessage(props) {
  const { message } = props;
  const [open, setOpen] = useState(true)
  const handleOk = () => {
    setOpen(false)
    window.location?.replace("/");
  }
  return (
    <>
      <Dialog
        open={open}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: "black" }}
          >
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* <Button
            className="btn btn-btn btn-secondary text-dark"
            onClick={handleClose}
          >
            NO
          </Button> */}
          <Button
            className="btn btn-btn btn-primary text-white"
            onClick={handleOk}
            autoFocus
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CommonMessage;
