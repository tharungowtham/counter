import React, { useReducer } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './components/Home';
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
