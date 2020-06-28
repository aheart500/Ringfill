import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';



function getModalStyle() {
  const top = 42;
  const left = 47;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    width: 500,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

export default function SimpleModal(props) {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={props.open}
        width="auto"
        onClick={props.handleClose}
      >
        <div style={modalStyle} className={classes.paper}>
          <h2 id="simple-modal-title">Summary Order<span style={{ width: 10,cursor: "pointer",float: "right"}}>x</span></h2>
          <p><span style={{ width: "30%",float: "left"}}>Send To:</span><span style={{ width: "70%",float: "right",textAlign: "right"}}>oiu</span></p>
          <p><span style={{ width: "30%",float: "left"}}>Phone No:</span><span style={{ width: "70%",float: "right",textAlign: "right"}}>PPP</span></p>
          <p><span style={{ width: "30%",float: "left"}}>Country:</span><span style={{ width: "70%",float: "right",textAlign: "right"}}>PPP</span></p>
          <hr style={{ width: "100%",float: "left"}}/>
          <p><span style={{ width: "30%",float: "left"}}>Product :</span><span style={{ width: "70%",float: "right",textAlign: "right"}}>PPP</span></p>
          <p><span style={{ width: "30%",float: "left"}}>Operator:</span><span style={{ width: "70%",float: "right",textAlign: "right"}}>PPP</span> </p>
          <hr style={{ width: "100%",float: "left"}}/>
          <p><span style={{ width: "30%",float: "left"}}>Top-up Amount :</span> <span style={{ width: "70%",float: "right",textAlign: "right"}}>PPP</span></p>
          <p><span style={{ width: "30%",float: "left"}}>Proccesing Fee:</span><span style={{ width: "70%",float: "right",textAlign: "right"}}>PPP</span> </p>
          <p><span style={{ width: "30%",float: "left"}}>Total Paid:</span><span style={{ width: "70%",float: "right",textAlign: "right"}}>PPP</span></p>
        </div>
      </Modal>
    </div>
  );
}
