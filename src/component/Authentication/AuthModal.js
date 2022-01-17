import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import { AppBar, Box, Button, Tab, Tabs } from '@material-ui/core';
import Login from './Login';
import Signup from './Signup';
import GoogleButton from 'react-google-button';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../../Firebase';
import { useCryptoContext } from '../../CryptoContext';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    // backgroundColor: theme.palette.background.paper,
    background: '#142236',
    color: 'white',
    borderRadius: 10,
  },
  google: {
    padding: 24,
    paddingTop: 0,
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    fontSize: 16,
  },
}));

export default function AuthModal() {
  const { alert, setAlert } = useCryptoContext();

  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        setAlert({
          ...alert,
          open: true,
          message: `Sign in Successful, Welcome ${result.user.email}`,
          type: 'success',
        });
        handleClose();
      })
      .catch((err) => {
        setAlert({
          ...alert,
          open: true,
          message: err.message,
          type: 'error',
        });
      });
  };

  return (
    <div>
      <Button variant='contained' className='loginBtn' onClick={handleOpen}>
        Login
      </Button>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        className={classes.modal}
        id='modal'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper} id='tabsWrapper'>
            <AppBar
              position='static'
              style={{ backgroundColor: 'transparent', color: 'white' }}
            >
              <Tabs
                value={value}
                onChange={handleChange}
                variant='fullWidth'
                style={{ borderRadius: 10 }}
              >
                <Tab label='Login' />
                <Tab label='Sign up' />
              </Tabs>
            </AppBar>
            {value === 0 && <Login handleClose={handleClose} />}
            {value === 1 && <Signup handleClose={handleClose} />}
            {/* ggogle */}
            <Box className={classes.google}>
              <span style={{ marginBottom: '20px' }}>OR</span>
              <GoogleButton
                style={{ width: '100%', outline: 'none' }}
                onClick={signInWithGoogle}
              >
                Sign in with Google
              </GoogleButton>
            </Box>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}
