import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './../../assets/styles/reset.css';

import AuthProvider from '../../contexts/AuthProvider';

import PrivateRoute from '../PrivateRoute';

import Home from '../../pages/Home';
import SignUp from '../../pages/SignUp';
import SignIn from '../../pages/SignIn';
import Expenses from '../../pages/Expenses';
import Expense from '../../pages/Expense';
import Requests from '../../pages/Requests';
import Request from '../../pages/Request';
import RequestItems from '../../pages/RequestItems';
import RequestItem from '../../pages/RequestItem';
import Approvals from '../../pages/Approvals';
import RequestItemEdit from '../../pages/RequestItemEdit';
import Users from '../../pages/Users';
import User from '../../pages/User';
import AuthRoute from '../AuthRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<PrivateRoute><Home/></PrivateRoute>}/>

          <Route path='/sign-up'                          element={<AuthRoute><SignUp/></AuthRoute>}/>
          <Route path='/sign-in'                          element={<AuthRoute><SignIn/></AuthRoute>}/>
            
          <Route path='/users'                            element={<PrivateRoute><Users/></PrivateRoute>}/>
          <Route path='/users/:id'                        element={<PrivateRoute><User/></PrivateRoute>}/>
            
          <Route path='/expenses'                         element={<PrivateRoute><Expenses/></PrivateRoute>}/>
          <Route path='/expenses/add'                     element={<PrivateRoute><Expense/></PrivateRoute>}/>
            
          <Route path='/requests'                         element={<PrivateRoute><Requests/></PrivateRoute>}/>
          <Route path='/requests/add'                     element={<PrivateRoute><Request/></PrivateRoute>}/>
          
          <Route path='/requests/:id/items'               element={<PrivateRoute><RequestItems/></PrivateRoute>}/>
          <Route path='/requests/:id/items/add'           element={<PrivateRoute><RequestItem/></PrivateRoute>}/>
          <Route path='/requests/:id/items/:itemId/edit'  element={<PrivateRoute><RequestItemEdit/></PrivateRoute>}/>
          
          <Route path='/approvals' element={<Approvals/>}/>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

