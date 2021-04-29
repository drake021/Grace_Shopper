import React, { useState, useEffect } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import {
  AppHeader,
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
} from '.'
import { getAllItems } from '../api/index.js';
import ITEM1 from '../img/ITEM1.jpg';
import ITEM2 from '../img/ITEM2.jpg';
import ITEM3 from '../img/ITEM3.jpg';
import ITEM5 from '../img/ITEM5.jpg';
import ITEM4 from '../img/ITEM4.jpg';

const App = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [allItems, setAllItems] = useState(null);
  const [itemImages, setItemImages] = useState({ITEM1, ITEM2, ITEM3, ITEM4, ITEM5});
  const [cart, setCart] = useState([]);


  useEffect(() => {
    //checking for user stored in localStorage
    const asyncUseEffect = async () => {

      console.log("itemImages: ", itemImages);
      const localUser = JSON.parse(localStorage.getItem('user'));
      if (!!localUser) {
        setUser(localUser);
      };
      const localCart = JSON.parse(localStorage.getItem('cart'));
      if (!!localCart) {
        setCart(localCart);
      };
      //checking for allItems in local storage; if not there fetching them from db
      const localStorageAllItems = JSON.parse(localStorage.getItem('allItems'));
      if (!!localStorageAllItems) {
        setAllItems(localStorageAllItems);
      } else {

        const gottenItems = await getAllItems();
        console.log('mapping gotten items...');
        const promisedResult = gottenItems.map(async item => {
          const newItem = { ...item }
          newItem['image'] = itemImages[item.itemNumber];
          console.log('newItem: ', newItem)
          return newItem;
        });
        const result = await Promise.all(promisedResult);
        console.log("gottenItems: ", result);
        setAllItems(result);
      }
    };
    asyncUseEffect();



  }, []);


  return <>
    <AppHeader user={user} setUser={setUser} />
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
        <Catalog allItems={allItems} itemImages={itemImages} cart={cart} setCart={setCart} />
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
        <Checkout user={user} cart={cart} />
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