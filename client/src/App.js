
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage';
import Items from './pages/Items';
import CartPage from './pages/CartPage';
import Register from './pages/Register';
import Login from './pages/Login';
import CustomerHomepage from './pages/CustomersHomepage';
import CustomerCartpage from './pages/CustomerCartpage';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>

          <Route path='/home' element={<Homepage />} />
          <Route path='/items' element={<Items />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/CustomersHomepage' element={<CustomerHomepage />} />
          <Route path='/CustomerCartpage' element={<CustomerCartpage />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
