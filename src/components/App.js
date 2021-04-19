import React, { useState, useEffect } from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import {AppHeader,
Nav,
Home,
ViewProduct,
Catalog,
User,
Cart,
Checkout,
ViewOrder,
Orders,
Footer
} from './'
import {
  getSomething
} from '../api';

const App = () => {
  const [message, setMessage] = useState('');



  return <>
    <AppHeader />
    <Nav />
    <Switch>
      <Route path='/home'>
        <Home />
      </Route>
      <Route path='/catalog/item/:itemNumber'>
        <ViewProduct />
      </Route>
      <Route path='/catalog/category/:categoryId'>
        <Catalog />
      </Route>
      <Route path='/user'>
        <User />
      </Route>
      <Route path='/cart'>
        <Cart />
      </Route>
      <Route path='/checkout'>
        <Checkout />
      </Route>
      <Route path='/orders/:orderId'>
        <ViewOrder />
      </Route>
      <Route path='/orders'>
        <Orders />
      </Route>
      <Route path='/'>
        <Redirect to='/home' />
      </Route>
    </Switch>
    <Footer />
  </>
}

export default App;