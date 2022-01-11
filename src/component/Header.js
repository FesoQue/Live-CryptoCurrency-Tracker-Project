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

const useStyles = makeStyles(() => ({
  logoTitle: {
    flex: '1',
    color: '#fff',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    cursor: 'pointer',
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
  const { currency, setCurrency } = useCryptoContext();

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color='transparent' position='static'>
        <Container>
          <Toolbar id='rmv'>
            <Typography
              onClick={() => history.push('/')}
              className={classes.logoTitle}
              variant='h6'
              id='logoText'
            >
              CryptoVerse
            </Typography>
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
              <MenuItem value='USD'>USD </MenuItem>
              <MenuItem value='NGN'>NGN </MenuItem>
            </Select>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;
