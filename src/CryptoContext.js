import React, { useState, useEffect, createContext, useContext } from 'react';
import { CoinList } from './config/api';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './Firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState('NGN');
  const [symbol, setSymbol] = useState('₦');
  const [coinsList, setCoinsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    type: 'success',
  });
  const [watchlist, setWatchList] = useState([]);

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoinsList(data);
    setLoading(false);
  };

  useEffect(() => {
    if (currency === 'NGN') {
      setSymbol('₦');
    } else if (currency === 'USD') {
      setSymbol('$');
    }
  }, [currency]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, 'watchlist', user.uid);

      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          setWatchList(coin.data().coins);
        } else {
          console.log('There is no item in the watchlist');
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  return (
    <Crypto.Provider
      value={{
        currency,
        symbol,
        setCurrency,
        loading,
        setLoading,
        coinsList,
        setCoinsList,
        fetchCoins,
        alert,
        setAlert,
        user,
        watchlist,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};
// custom context hook you can use for all components
export const useCryptoContext = () => {
  return useContext(Crypto);
};

export default CryptoContext;
