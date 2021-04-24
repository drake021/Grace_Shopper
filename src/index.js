import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";


import {
  // App
} from './components';

const App = () => {

  //user object passed around when user is logged in
  const [user, setUser] = useState(null);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    if (!!localUser) {
      setUser(localUser);
    }
  }, [setUser])

  return (
    <>
      <Header user={user} setUser={setUser} />
      <Route path='/login'>
        <Login setUser={setUser} user={user} />
      </Route>
      <Route path='/logout'>
        <Logout user={user} setUser={setUser} />
      </Route>
      <Route path='/register'>
        <Register setUser={setUser} user={user} />
      </Route>
      <Route exact path='/'>
        <Home />
      </Route>
      <Route exact path='/catalog'>
        <Catalog setUser={setUser} user={user} />
      </Route>
      <Route exact path='/cart'>
        <Cart setUser={setUser} user={user} />
      </Route>
      <Route exact path='/admin'>
        <Admin setUser={setUser} user={user} />
      </Route>
    </>
  )
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('app')
);