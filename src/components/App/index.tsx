import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './../../assets/styles/reset.css';

import AuthProvider from '../../contexts/AuthProvider';

import Home from '../../pages/Home';
import SignUp from '../../pages/SignUp';
import SignIn from '../../pages/SignIn';
import Expenses from '../../pages/Expenses';
import Expense from '../../pages/Expense';
import Requests from '../../pages/Requests';
import Request from '../../pages/Request';
import RequestItems from '../../pages/RequestItems';
import RequestItem from '../../pages/RequestItem';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<Home/>}/>
          <Route path='/sign-up' element={<SignUp/>}/>
          <Route path='/sign-in' element={<SignIn/>}/>

          <Route path='/expenses' element={<Expenses/>}/>
          <Route path='/expenses/add' element={<Expense/>}/>

          <Route path='/requests' element={<Requests/>}/>
          <Route path='/requests/add' element={<Request/>}/>
          
          <Route path='/requests/:id/items' element={<RequestItems/>}/>
          <Route path='/requests/:id/items/add' element={<RequestItem/>}/>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
