import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Forgotpassword from './components/Auth/Forgotpassword';
import Resetpassword from './components/Auth/Resetpassword';
import Register from './components/Auth/Register';

import Layout from './Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Pizza from './components/Pages/Pizza';
import ComboPack from './components/Pages/ComboPack';
import Drink from './components/Pages/Drink';
import Dessert from './components/Pages/Dessert';
import Addtobucket from './components/Pages/Addtobucket';

const ProtectedRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem("authorized");
  return isLoggedIn ? element : <Navigate to="/login" />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="/resetpassword/:id/:token" element={<Resetpassword />} />

        <Route path="/" element={<ProtectedRoute element={<Layout />} />}>
         <Route path="Pizzas" element={<ProtectedRoute element={< Pizza/>} />} />
         <Route path="" element={<ProtectedRoute element={< ComboPack/>} />} />
         <Route path="Drink" element={<ProtectedRoute element={< Drink/>} />} />
         <Route path="Dessert" element={<ProtectedRoute element={< Dessert/>} />} />
         <Route path="addtobucket" element={<ProtectedRoute element={< Addtobucket />} />} />
           </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
