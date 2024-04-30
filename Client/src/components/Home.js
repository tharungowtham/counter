import React, { useContext, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CounterContext } from './CounterContext';

const Home = () => {
  const { state, dispatch } = useContext(CounterContext);

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
  }, [fetchCounter]);

  return (
    <div>
      <h1>Counter Value: {state.count}</h1>
      <Link to="/counter">Counter</Link>
      <h1>My_Counter Value: {state.mycount}</h1>
      <Link to="/mycounter">MY_Counter</Link>
    </div>
  );
};

export default Home;
