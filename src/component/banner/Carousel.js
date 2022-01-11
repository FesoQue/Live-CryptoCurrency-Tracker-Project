import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import axios from 'axios';
import { TrendingCoins } from '../../config/api';
import { useCryptoContext } from '../../CryptoContext';
import AliceCarousel from 'react-alice-carousel';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  carousel: {
    height: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

// format currency with comma
const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

const Carousel = () => {
  const classes = useStyles();
  const { currency, symbol } = useCryptoContext();

  const [coins, setCoins] = useState([]);

  // get the list of trending coins
  const fetchTrendingCoins = async () => {
    const { data } = await axios.get(TrendingCoins(currency));
    setCoins(data);
  };

  useEffect(() => {
    fetchTrendingCoins();
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  // device > 0px : display 2 items on the screen
  // device > 512px : display 4  items on the screen
  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  //carousel items
  const items = coins.map((coin) => {
    let profit = coin.price_change_percentage_24h >= 0;
    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <div id='carouselCoins'>
          <img
            src={coin?.image}
            alt={coin.name}
            height='50'
            style={{ marginBottom: 8 }}
          />
          <span
            className='coin-symbol'
            style={{
              color: '#fff',
              marginBottom: 1,
              textTransform: 'uppercase',
            }}
          >
            {coin?.symbol}
            &nbsp;
            <span
              style={{ color: profit ? '#0c9b0c' : 'red', fontWeight: 500 }}
            >
              {profit && '+'} {coin?.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </span>
          <span
            className='current-price'
            style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}
          >
            {symbol} {numberWithCommas(coin?.current_price.toFixed(2))}
          </span>
        </div>
      </Link>
    );
  });

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableButtonsControls
        disableDotsControls
        responsive={responsive}
        autoPlay
        items={items}
      />
    </div>
  );
};

export default Carousel;
