import React, { useState, useEffect, useContext, useReducer, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Counter context
const CounterContext = React.createContext();

// Reducer function for managing counter state
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { count: action.count,mycount:action.mycount };
    case 'INCREMENT':
      return { count: state.count + 1, mycount: state.mycount };
    case 'DECREMENT':
      return { count: state.count - 1,mycount: state.mycount };
    case 'MY_SET':
      return { count: action.count,mycount:action.mycount };
    case 'MY_INCREMENT':
      return { mycount: state.mycount + 1,count: state.count };
    case 'MY_DECREMENT':
      return { mycount: state.mycount - 1,count: state.count  };
    default:
      return state;
  }
};

const Home = () => {
  const { state,dispatch } = useContext(CounterContext);
  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/mycounter');
      dispatch({ type: 'MY_SET', mycount: response.data.mycount,count:response.data.count });
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

const MyCounter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/mycounter');
      dispatch({ type: 'MY_SET', mycount: response.data.mycount,count:response.data.count });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/myincrement');
      dispatch({ type: 'MY_INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/mydecrement');
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
}

const Counter = () => {
  const { state, dispatch } = useContext(CounterContext);
  const navigate = useNavigate();

  const fetchCounter = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/counter');
      dispatch({ type: 'SET',mycount: response.data.mycount,count:response.data.count });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCounter();
  }, [fetchCounter]);

  const incrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/increment');
      dispatch({ type: 'INCREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  const decrementCounter = useCallback(async () => {
    try {
      await axios.post('http://localhost:5000/api/counter/decrement');
      dispatch({ type: 'DECREMENT' });
    } catch (err) {
      console.error(err);
    }
  }, [dispatch]);

  return (
    <div>
      <h2>Counter</h2>
      <p>Count: {state.count}</p>
      <button onClick={incrementCounter}>Increment</button>
      <button onClick={decrementCounter}>Decrement</button>
      <button onClick={() => navigate('/')}>Go to Home</button>
    </div>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 , mycount:0});

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      <Router>
        <div>
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
            </ul>
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<MyCounter />} />
          </Routes>
        </div>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
