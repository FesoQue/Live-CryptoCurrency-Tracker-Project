import React, { useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { useCryptoContext } from '../../CryptoContext';
import { auth } from '../../Firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, alert, setAlert } = useCryptoContext();

  const handleSubmit = async () => {
    if (!email || !password) {
      setAlert({
        ...alert,
        open: true,
        message: 'Please fill all the fields',
        type: 'error',
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setAlert({
        ...alert,
        open: true,
        message: `Login successful, Welcome ${result.user.email}`,
        type: 'success',
      });
      handleClose();
    } catch (error) {
      setAlert({
        ...alert,
        open: true,
        message: error.message,
        type: 'error',
      });
    }
  };

  return (
    <Box p={3} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* email */}
      <TextField
        style={{ marginBottom: '20px' }}
        variant='outlined'
        type='email'
        label='Enter Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
      />
      {/* password */}
      <TextField
        style={{ marginBottom: '20px' }}
        variant='outlined'
        type='password'
        label='Enter Password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
      />
      <Button
        className='authBtn login'
        variant='contained'
        size='large'
        style={{
          fontFamily: 'Manrope',
          fontWeight: 800,
        }}
        onClick={handleSubmit}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;
