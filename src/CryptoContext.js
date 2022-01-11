import React, { useState, useEffect, createContext, useContext } from 'react';

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState('NGN');
  const [symbol, setSymbol] = useState('₦');

  useEffect(() => {
    if (currency === 'NGN') {
      setSymbol('₦');
    } else if (currency === 'USD') {
      setSymbol('$');
    }
  }, [currency]);

  return (
    <Crypto.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </Crypto.Provider>
  );
};
// custom context hook you can use for all components
export const useCryptoContext = () => {
  return useContext(Crypto);
};

export default CryptoContext;
