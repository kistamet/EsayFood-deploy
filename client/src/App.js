import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from './pages/Homepage';
import Items from './pages/Items';
import CartPage from './pages/CartPage';
import Register from './pages/Register';
import Login from './pages/Login';
import CustomerHomepage from './pages/CustomersHomepage';
import CustomerCartpage from './pages/CustomerCartpage';
import LoginRestaurant from './pages/LoginRestaurant';
import ProfileRestaurant from './pages/ProfileRestaurant';
import Tabelrestaurant from './pages/Tabelrestaurant';
import Queuecustomers from './pages/Queuecustomers';


import { Navigate } from "react-router-dom";
import RegisterRestaurant from './pages/RegisterRestaurant';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/home' element={<ProtectedRoute><Homepage /></ProtectedRoute>} />
          <Route path='/items' element={<ProtectedRoute><Items /></ProtectedRoute>} />
          <Route path='/cart' element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/CustomersHomepage' element={<CustomerHomepage />} />
          <Route path='/CustomerCartpage' element={<CustomerCartpage />} />
          <Route path='/RegisterRestaurant' element={<RegisterRestaurant />} />
          <Route path='/LoginRestaurant' element={<LoginRestaurant />} />
          <Route path='/ProfileRestaurant' element={<ProfileRestaurant />} />
          <Route path='/Tabelrestaurant' element={<Tabelrestaurant />} />
          <Route path='/Queuecustomers' element={<Queuecustomers />} />

          <Route path='/' element={<Login />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;

export function ProtectedRoute({children}){
if(localStorage.getItem('pos-user'))
{
  return children
}
else{
  return <Navigate to='/login'/>
}
}