import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCryptoContext } from '../CryptoContext';
import { HistoricalChart } from '../config/api';
import {
  CircularProgress,
  createTheme,
  ThemeProvider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { Line } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import { chartDays } from '../config/data';
import SelectButton from './SelectButton';

const CoinInfo = ({ coin }) => {
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);

  const { currency } = useCryptoContext();

  // fetch coin history data
  const fetchHistoricalData = async () => {
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricalData(data.prices);
  };

  useEffect(() => {
    fetchHistoricalData();
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, currency]);

  const useStyles = makeStyles((theme) => ({
    container: {
      width: '75%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 25,
      paddingLeft: 40,
    },
  }));

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      type: 'dark',
    },
  });
  const classes = useStyles();

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container} id='chartContainer'>
        {!historicalData ? (
          <CircularProgress
            style={{ color: '#ff8a71' }}
            size={100}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicalData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()}PM`
                      : `${date.getHours()}:${date.getMinutes()}AM`;

                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicalData.map((coin) => coin[1]),
                    label: `Price (Past ${days} Days) in ${currency}`,
                    borderColor: '#ff8a71',
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            {/* buttons */}
            <div className='btnContainer'>
              {chartDays.map((day) => {
                const { label, value } = day;
                return (
                  <SelectButton
                    key={value}
                    onClick={() => setDays(value)}
                    selected={value === days}
                  >
                    {label}
                  </SelectButton>
                );
              })}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
