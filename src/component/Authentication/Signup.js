import React, { useState } from 'react';
import { Box, Button, TextField } from '@material-ui/core';
import { useCryptoContext } from '../../CryptoContext';
import { auth } from '../../Firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = ({ handleClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { alert, setAlert } = useCryptoContext();

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setAlert({
        ...alert,
        open: true,
        message: 'Password does not match',
        type: 'error',
      });
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      setAlert({
        ...alert,
        open: true,
        message: `Sign up successful, Welcome ${result.user.email}`,
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
      {/* confirm password */}
      <TextField
        style={{ marginBottom: '20px' }}
        variant='outlined'
        type='password'
        label='Confirm Password'
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        fullWidth
      />
      <Button
        className='authBtn signup'
        variant='contained'
        size='large'
        style={{
          fontFamily: 'Manrope',
          fontWeight: 800,
        }}
        onClick={handleSubmit}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;
