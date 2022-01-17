import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Button,
  Container,
  LinearProgress,
  makeStyles,
  Typography,
} from '@material-ui/core';
import CoinInfo from '../component/CoinInfo';
import { SingleCoin } from '../config/api';
import { useCryptoContext } from '../CryptoContext';
import ReactHtmlParser from 'react-html-parser';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';

const CoinPage = () => {
  const { id } = useParams();
  const [coin, setCoin] = useState();

  const { currency, symbol, user, watchlist, alert, setAlert } =
    useCryptoContext();

  // format currency with comma
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const fetchSingleCoin = async () => {
    const { data } = await axios.get(SingleCoin(id));
    setCoin(data);
  };

  useEffect(() => {
    fetchSingleCoin();
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      height: '100%',
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'center',
      },
    },
    sidebar: {
      width: '30%',
      [theme.breakpoints.down('md')]: {
        width: '100%',
        alignItems: 'center',
      },
      [theme.breakpoints.up('md')]: {
        justifyContent: 'center',
        borderRight: '2px solid grey',
      },
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      marginTop: 25,
    },
    marketData: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      maxWidth: '800px',
      [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        alignItems: 'center',
      },
      [theme.breakpoints.down('sm')]: {
        flexDirection: 'column',
        alignItems: 'flex-start',
      },
    },
    heading: {
      fontSize: 18,
      fontFamily: 'Montserrat',
      fontWeight: 800,
    },
  }));

  const inWatchList = watchlist.includes(coin?.id);

  const addToWatchlist = async () => {
    const coinRef = doc(db, 'watchlist', user.uid);

    try {
      await setDoc(coinRef, {
        coins: watchlist ? [...watchlist, coin?.id] : [coin?.id],
      });
      setAlert({
        ...alert,
        open: true,
        message: `${coin.name} Added to the Watchlist!`,
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

  const removeFromWatchlist = async () => {
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

  const classes = useStyles();

  if (!coin) {
    return (
      <LinearProgress
        style={{
          background:
            'linear-gradient(89.97deg, #ae67fa 1.84%, #f49867 102.67%), #81afdd',
        }}
      />
    );
  }

  return (
    <Container id='container'>
      <div className={classes.container}>
        <div className={classes.sidebar} id='sidebar'>
          {/* coin logo/symbol */}
          <img
            src={coin?.image.large}
            alt={coin?.name}
            height='80'
            style={{ marginBottom: 20 }}
          />
          {/* coin name */}
          <Typography
            variant='h6'
            style={{
              fontFamily: 'Montserrat',
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            {coin?.name}
          </Typography>

          {/* coin desc */}
          <Typography
            variant='subtitle1'
            style={{
              maxWidth: '800px',
              fontSize: 15,
              fontFamily: 'Manrope',
              fontWeight: 500,
              marginBottom: 20,
            }}
          >
            {ReactHtmlParser(coin?.description.en.split('. ')[0])}.
          </Typography>
          <div className={classes.marketData}>
            {/* coin rank */}
            <div style={{ display: 'flex', marginBottom: 20 }}>
              <Typography variant='h6' className={classes.heading}>
                Rank:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                style={{
                  fontSize: 18,
                  fontFamily: 'Manrope',
                  fontWeight: 600,
                  color: '#f49867',
                }}
              >
                {coin?.market_cap_rank}
              </Typography>
            </div>
            {/* current price*/}
            <div style={{ display: 'flex', marginBottom: 20 }}>
              <Typography variant='h6' className={classes.heading}>
                Current Price:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                style={{
                  fontSize: 18,
                  fontFamily: 'Manrope',
                  fontWeight: 600,
                  color: '#f49867',
                }}
              >
                {symbol}
                {numberWithCommas(
                  coin?.market_data.current_price[currency.toLowerCase()]
                )}
              </Typography>
            </div>
            {/* market cap */}
            <div style={{ display: 'flex', marginBottom: 20 }}>
              <Typography variant='h6' className={classes.heading}>
                Market Cap:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                style={{
                  fontSize: 18,
                  fontFamily: 'Manrope',
                  fontWeight: 600,
                  color: '#f49867',
                }}
              >
                {symbol}
                {numberWithCommas(
                  coin?.market_data.market_cap[currency.toLowerCase()]
                    .toString()
                    .slice(0, -6)
                )}
                M
              </Typography>
            </div>
            {user && (
              <Button
                variant='outlined'
                style={{
                  minWidth: '18ch',
                  height: 40,
                  backgroundColor: inWatchList ? '#ff0000' : '#028802',
                  color: inWatchList ? '#000' : '#fff',
                }}
                onClick={inWatchList ? removeFromWatchlist : addToWatchlist}
              >
                {inWatchList ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </Button>
            )}
          </div>
        </div>
        {/* chart */}
        <CoinInfo coin={coin} />
      </div>
    </Container>
  );
};

export default CoinPage;
