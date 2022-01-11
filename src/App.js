import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './component/Header';
import Homepage from './Pages/Homepage';
import CoinPage from './Pages/CoinPage';
import { makeStyles } from '@material-ui/core';

const App = () => {
  const useStyles = makeStyles(() => ({
    App: {
      backgroundColor: '#040c18',
      color: 'white',
      minHeight: '100vh',
    },
  }));

  const classes = useStyles();
  return (
    <main className={classes.App}>
      <Router>
        <Header />
        <Switch>
          <Route exact path='/' component={Homepage} />
          <Route exact path='/coins/:id' component={CoinPage} />
        </Switch>
      </Router>
    </main>
  );
};

export default App;
