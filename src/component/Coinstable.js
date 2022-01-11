import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CoinList } from '../config/api';
import { useCryptoContext } from '../CryptoContext';
import {
  Container,
  TextField,
  Typography,
  createTheme,
  ThemeProvider,
  TableContainer,
  LinearProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Pagination } from '@material-ui/lab';

const Coinstable = () => {
  const { currency } = useCryptoContext();
  const [coinsList, setCoinsList] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(1);
  const history = useHistory();

  const { symbol } = useCryptoContext();

  // format currency with comma
  const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoinsList(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
    //  eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: '#fff',
      },
      type: 'dark',
    },
  });

  const handleSearch = () => {
    return coinsList.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  const useStyles = makeStyles(() => ({
    row: {
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: '#131111',
      },
      fontFamily: 'Manrope',
    },
    tableCell1: {
      display: 'flex',
      gap: 10,
    },
    pagination: {
      '& .MuiPaginationItem-root': {
        color: '#ff8a71',
      },
    },
  }));

  const classes = useStyles();
  return (
    <ThemeProvider theme={darkTheme}>
      <Container style={{ textAlign: 'center' }}>
        <Typography
          variant='h5'
          style={{ fontFamily: 'Manrope', color: '#f49867', marginBottom: 30 }}
        >
          Cryptocurrency Prices By Market Cap
        </Typography>
        <TextField
          label='Search For a Crypto Currency...'
          variant='outlined'
          style={{ marginBottom: 30, width: '100%' }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TableContainer style={{ marginBottom: '50px' }}>
          {loading ? (
            <LinearProgress
              style={{
                background:
                  'linear-gradient(89.97deg, #ae67fa 1.84%, #f49867 102.67%), #81afdd',
              }}
            />
          ) : (
            <Table>
              {/* table head */}
              <TableHead id='tableHead'>
                <TableRow>
                  {['Coin', 'Price', '24h Change', 'Market Cap'].map(
                    (head, index) => {
                      return (
                        <TableCell
                          style={{
                            color: '#000',
                            fontSize: 16,
                            fontWeight: '700',
                            fontFamily: 'Montserrat',
                          }}
                          key={index}
                          align={head === 'Coin' ? undefined : 'right'}
                        >
                          {head}
                        </TableCell>
                      );
                    }
                  )}
                </TableRow>
              </TableHead>

              {/* tableBody */}
              <TableBody>
                {handleSearch()
                  .slice((pagination - 1) * 10, (pagination - 1) * 10 + 10)
                  .map((row, index) => {
                    const profit = row.price_change_percentage_24h > 0;

                    return (
                      <TableRow
                        className={classes.row}
                        key={index}
                        onClick={() => history.push(`/coins/${row.id}`)}
                      >
                        {/* coin */}
                        <TableCell
                          className={classes.tableCell1}
                          component='th'
                          scope='row'
                          styles={{ display: 'flex', gap: 15 }}
                        >
                          <img
                            src={row?.image}
                            alt={row.name}
                            height='40'
                            style={{ marginBottom: 10 }}
                          />
                          <div
                            style={{ display: 'flex', flexDirection: 'column' }}
                          >
                            <span
                              style={{
                                textTransform: 'uppercase',
                                fontSize: 17,
                              }}
                            >
                              {row.symbol}
                            </span>
                            <span style={{ color: 'darkgrey', fontSize: 15 }}>
                              {row.name}
                            </span>
                          </div>
                        </TableCell>
                        {/* price */}
                        <TableCell
                          className='current-price'
                          style={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: '#fff',
                          }}
                          align='right'
                        >
                          {symbol}
                          {numberWithCommas(row?.current_price.toFixed(2))}
                        </TableCell>
                        {/* 24h change */}
                        <TableCell
                          style={{
                            color: profit > 0 ? '#0c9b0c' : 'red',
                            fontSize: 15,
                            fontWeight: 500,
                          }}
                          align='right'
                        >
                          {profit && '+'}
                          {row.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        {/* market cap */}
                        <TableCell style={{ fontSize: 15 }} align='right'>
                          {symbol}
                          {numberWithCommas(
                            row.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          style={{
            padding: 20,
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
          }}
          count={Number((handleSearch()?.length / 10).toFixed(0))}
          classes={{ ul: classes.pagination }}
          onChange={(_, value) => {
            setPagination(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default Coinstable;
