import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Container, Typography } from '@material-ui/core';
import Carousel from './Carousel';

const useStyles = makeStyles(() => ({
  bannerContent: {
    height: 400,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    paddingTop: 25,
  },
  tagline: {
    height: '40%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    textAlign: 'center',
  },
}));
const Banner = () => {
  const classes = useStyles();

  return (
    <div className='banner'>
      <Container className={classes.bannerContent}>
        <div className={classes.tagline}>
          <Typography
            variant='h4'
            style={{
              fontFamily: 'Montserrat',
              fontWeight: 'bold',
              marginBottom: 15,
            }}
            id='bannerHeading'
          >
            Live Crypto <br /> Tracker
          </Typography>
          <Typography
            variant='subtitle2'
            style={{
              color: '#81afdd',
              fontFamily: 'Manrope',
              fontSize: '14px',
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            All-in-one cryptocurrency portfolio &nbsp;monitor/tracker.
          </Typography>
        </div>
        <Carousel />
      </Container>
    </div>
  );
};

export default Banner;
