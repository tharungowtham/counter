import React, { useReducer,useCallback,useEffect,useState } from 'react';
import axios from'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Callback from './components/Callback';
import Login from './components/Login';
import Logout from './components/Logout';
import Counter from './components/Counter';
import MyCounter from './components/MyCounter';
import { CounterContext } from './components/CounterContext';

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return { count: action.count, mycount: action.mycount };
    case 'INCREMENT':
      return { count: state.count + 1, mycount: state.mycount };
    case 'DECREMENT':
      return { count: state.count - 1, mycount: state.mycount };
    case 'MY_SET':
      return { count: action.count, mycount: action.mycount };
    case 'MY_INCREMENT':
      return { mycount: state.mycount + 1, count: state.count };
    case 'MY_DECREMENT':
      return { mycount: state.mycount - 1, count: state.count };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0, mycount: 0 });
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(null)

  const checkLoginState = useCallback(async () => {
    try {
      const {data: { loggedIn: logged_in, user }} = await axios.get(`http://localhost:5000/auth/logged_in`, {withCredentials: true})
      setLoggedIn(logged_in)
      user && setUser(user)
    } catch (err) {
      console.error(err)
    }
  }, [])
  useEffect(() => {
    checkLoginState()
  }, [checkLoginState])
return (
    <CounterContext.Provider value={{ state, dispatch,loggedIn,user,checkLoginState}}>
      <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<Counter />} />
            <Route path="/mycounter" element={<MyCounter />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/auth/callback/" element={<Callback AuthContext={CounterContext} />} /> 
          </Routes>
      </Router>
    </CounterContext.Provider>
  );
};

export default App;
