import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UsersContainer } from './Components/UserComponent/UsersContainer';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        {/*<Route path = "" element= {<Login/>}/>*/}
        <Route path="/users" element= { <UsersContainer/>}/>
      </Routes>
      
      </BrowserRouter>

    </div>
  );
}

export default App;
