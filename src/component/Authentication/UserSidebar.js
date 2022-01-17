import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { useCryptoContext } from '../../CryptoContext';
import { Avatar, Button, colors } from '@material-ui/core/';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../Firebase';
import { AiFillDelete } from 'react-icons/ai';
import { doc, setDoc } from 'firebase/firestore';

const useStyles = makeStyles((theme) => ({
  container: {
    width: 280,
    padding: 20,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Manrope',
    backgroundColor: '#142236',
    [theme.breakpoints.up('md')]: {
      width: 350,
    },
  },
  profile: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    height: '92%',
  },
  picture: {
    width: 100,
    height: 100,
    cursor: 'pointer',
    // backgroundColor: '#81afdd',
    objectFit: 'cover',
  },
  watchlist: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(4, 12, 24, 1)',
    borderRadius: 10,
    padding: 15,
    paddingTop: 10,
    gap: 12,
    overflow: 'scroll',
  },
  coin: {
    padding: 10,
    borderRadius: 5,
    color: 'black',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f6f6',
    marginBottom: 10,
  },
}));

function UserSidebar() {
  const { user, alert, setAlert, watchlist, coinsList, symbol } =
    useCryptoContext();

  const classes = useStyles();
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const logOut = async () => {
    signOut(auth);
    setAlert({
      ...alert,
      open: true,
      message: 'Logout Succesful',
      type: 'success',
    });
    toggleDrawer();
  };

  // format currency with comma
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const removeFromWatchlist = async (coin) => {
    const coinRef = doc(db, 'watchlist', user.uid);

    try {
      await setDoc(
        coinRef,
        {
          coins: watchlist.filter((watch) => watch !== coin?.id),
        },
        { merge: 'true' }
      );
      setAlert({
        ...alert,
        open: true,
        message: `${coin.name} Removed from the Watchlist!`,
        type: 'success',
      });
    } catch (error) {
      setAlert({
        ...alert,
        open: false,
        message: error.message,
        type: 'error',
      });
    }
  };
  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            style={{
              height: 38,
              width: 38,
              marginLeft: 15,
              cursor: 'pointer',
              backgroundColor: '#ff8a71',
            }}
            src={user.photoURL}
            alt={user.displayName || user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={classes.container}>
              <div className={classes.profile}>
                <Avatar
                  className={classes.picture}
                  id='userPic'
                  src={user.photoURL}
                  alt={user.displayName || user.email}
                />
                <span
                  style={{
                    width: '100%',
                    fontSize: 20,
                    textAlign: 'center',
                    fontWeight: 600,
                    wordWrap: 'break-word',
                    color: '#81afdd',
                    margin: '15px 0',
                  }}
                >
                  {user.displayName || user.email}
                </span>
                <div className={classes.watchlist}>
                  <span
                    style={{
                      fontSize: 18,
                      color: '#f8f6f6',
                      fontWeight: 600,
                      marginBottom: 15,
                    }}
                  >
                    <span
                      style={{ textDecoration: 'underline', color: '#ff8a71' }}
                      className='aaa'
                    >
                      {watchlist.length} coin(s)
                    </span>{' '}
                    in Watchlist
                  </span>
                  {coinsList.map((coin, idx) => {
                    if (watchlist.includes(coin.id)) {
                      return (
                        <div className={classes.coin} key={coin.id}>
                          {/* <span style={{ flexShrink: 1 }}>
                            {watchlist.length}
                          </span> */}
                          <img src={coin.image} alt={coin.name} width='25px' />
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                            }}
                          >
                            {symbol}
                            {numberWithCommas(coin.current_price.toFixed(2))}
                          </span>
                          <AiFillDelete
                            style={{ cursor: 'pointer', fontSize: '16' }}
                            onClick={() => removeFromWatchlist(coin)}
                          />
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <Button
                variant='contained'
                style={{ height: '8%', marginTop: 20, background: '#fa613e' }}
                className='logout'
                onClick={logOut}
              >
                Log Out
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

export default UserSidebar;
