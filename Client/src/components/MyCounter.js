import React, { useContext, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CounterContext } from './CounterContext';

const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/mycounter',{withCredentials:true});
      dispatch({ type: 'MY_SET', ...state,mycount: response.data.mycount });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/myincrement',{withCredentials:true});
      dispatch({ type: 'MY_INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/mydecrement',{withCredentials:true});
      dispatch({ type: 'MY_DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>MyCounter</h2>
      <p>MyCount: {state.mycount}</p>
      <button onClick={incrementCounter}>my_Increment</button>
      <button onClick={decrementCounter}>my_Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

export default MyCounter;
