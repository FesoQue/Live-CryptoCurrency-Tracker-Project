import React from 'react';
import {
  AppBar,
  createTheme,
  MenuItem,
  Select,
  Toolbar,
  Typography,
  ThemeProvider,
  Container,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useHistory } from 'react-router-dom';
import { useCryptoContext } from '../CryptoContext';
import AuthModal from './Authentication/AuthModal';
import UserSidebar from './Authentication/UserSidebar';

const useStyles = makeStyles(() => ({
  logoTitle: {
    flex: '1',
    color: '#fff',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    cursor: 'pointer',
    lineHeight: 1.1,
  },
}));
const Header = () => {
  const classes = useStyles();

  const history = useHistory();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      type: 'dark',
    },
  });

  // state values from the context
  const { currency, setCurrency, user } = useCryptoContext();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color='transparent' position='static'>
        <Container>
          <Toolbar id='nav'>
            <div className='logo' onClick={() => history.push('/')}>
              <img src='/coinsverse.png' alt='' className='logoImg' />
              <Typography
                className={classes.logoTitle}
                // variant='h6'
                id='logoText'
              >
                Co<span>i</span>ns
                <br />
                Verse
              </Typography>
            </div>

            <Select
              variant='outlined'
              style={{
                width: 100,
                height: 40,
                marginRight: 15,
              }}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <MenuItem value='NGN'>NGN </MenuItem>
              <MenuItem value='USD'>USD </MenuItem>
            </Select>

            {/* auth modal */}
            {user ? <UserSidebar /> : <AuthModal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
