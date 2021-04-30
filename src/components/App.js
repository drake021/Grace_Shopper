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
import ITEM1 from '../img/item1.png';
import ITEM2 from '../img/item2.png';
import ITEM3 from '../img/item3.png';
import ITEM4 from '../img/item4.png';
import ITEM5 from '../img/item5.png';
import ITEM6 from '../img/item6.png';
import ITEM7 from '../img/item7.png';
import ITEM8 from '../img/item8.png';
import ITEM9 from '../img/item9.png';
import ITEM10 from '../img/item10.png';
import ITEM11 from '../img/item11.png';
import ITEM12 from '../img/item12.png';

const App = () => {
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [allItems, setAllItems] = useState(null);
  const [itemImages, setItemImages] = useState({ITEM1, ITEM2, ITEM3, ITEM4, ITEM5, ITEM6, ITEM7, ITEM8, ITEM9, ITEM10, ITEM11, ITEM12});
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