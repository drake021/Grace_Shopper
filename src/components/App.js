import React, { useState, useEffect } from 'react';
import {Route, Redirect, Switch} from 'react-router-dom';
import {AppHeader,
Nav,
Home,
ViewProduct,
Catalog,
User,
// Cart,
Checkout,
ViewOrder,
Orders,
Footer,
ApiDocuments
} from './'
import {
  getSomething
} from '../api';

const App = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);




  return <>
    <AppHeader user={user} setUser={setUser}/>
    {/* <Nav /> */}
    <Switch>
    <Route path='/api/documents'>
        <ApiDocuments />
      </Route>
      <Route path='/home'>
        <Home />
      </Route>
      <Route path='/catalog/item/:itemNumber'>
        <ViewProduct />
      </Route>
      <Route path='/catalog/category/:categoryId'>
        <Catalog />
      </Route>
      <Route path='/catalog'>
        <Redirect to="/catalog/category/featured" />
      </Route>
      <Route path='/user'>
        <User />
      </Route>
      {/* <Route path='/cart'>
        <Cart />
      </Route> */}
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