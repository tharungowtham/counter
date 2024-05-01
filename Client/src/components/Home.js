import React, { useContext, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CounterContext } from './CounterContext';
import Login from './Login';
const Home = () => {
  const { state, dispatch,loggedIn,checkLoginState } = useContext(CounterContext);
  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/mycounter');
      dispatch({ type: 'MY_SET', mycount: response.data.mycount, count: response.data.count });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);
  
  useEffect(() => {
    fetchCounter();
    checkLoginState();
  }, [fetchCounter]);


  if(!loggedIn) return <Login />
  return (
    <>
    <nav>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/counter">Counter</Link>
              </li>
              <li>
                <Link to="/mycounter">MY_Counter</Link>
              </li>
              <li>
                <Link to="/login">login</Link>
              </li>
            </ul>
          </nav>
    <div>
      <h1>Counter Value: {state.count}</h1>
      <Link to="/counter">Counter</Link>
      <h1>My_Counter Value: {state.mycount}</h1>
      <Link to="/mycounter">MY_Counter</Link>
    </div>
    </>
  );
};

export default Home;
