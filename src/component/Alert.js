import React from 'react';
import { useCryptoContext } from '../CryptoContext';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = () => {
  const { alert, setAlert } = useCryptoContext();

  //   const handleClick = () => {
  //     setAlert({open: true });
  //   };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setAlert({ ...alert, open: false });
  };

  return (
    <Snackbar open={alert.open} autoHideDuration={3000} onClose={handleClose}>
      <MuiAlert
        onClose={handleClose}
        variant='filled'
        severity={alert.type}
        elevation={10}
      >
        {alert.message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
