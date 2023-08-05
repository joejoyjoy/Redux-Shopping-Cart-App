import React, { useEffect } from "react";
import "./App.css";
import Auth from "./components/Auth";
import Layout from "./components/Layout";
import { useDispatch, useSelector } from "react-redux";
import Notification from "./components/Notification";
import { uiActions } from "./store/uiSlice";

let isFirstRender = true;

function App() {
  const dispatch = useDispatch();
  const notification = useSelector(state => state.ui.notification)
  const cart = useSelector(state => state.cart);
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

  useEffect(() => {
    if (isFirstRender) {
      isFirstRender = false;
      return
    }
    const sendRequest = async () => {
      dispatch(uiActions.showNotification({
        open: true,
        message: 'Sending Request',
        type: 'warning'
      }))
      const res = await fetch('https://redux-shopping-cart-7f000-default-rtdb.europe-west1.firebasedatabase.app/cartitems.json', {
        method: 'PUT',
        body: JSON.stringify(cart)
      });
      const data = await res.json();
      dispatch(uiActions.showNotification({
        open: true,
        message: 'Sent Request To DataBase Successfully',
        type: 'success'
      }))
    }
    sendRequest().catch(rr => {
      dispatch(uiActions.showNotification({
        open: true,
        message: 'Sending Request Failed',
        type: 'error'
      }))
    })
  }, [cart, dispatch])

  return (
    <div className="App">
      {notification && <Notification type={notification.type} message={notification.message} />}
      {!isLoggedIn && <Auth />}
      {isLoggedIn && <Layout />}
    </div>
  );
}

export default App;