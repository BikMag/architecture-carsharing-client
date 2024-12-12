import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Register from './pages/Register';
import Cars from './pages/Cars';
import Rental from './pages/Rental';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cars" element={<Cars />} />
          <Route path="/rental" element={<Rental />} />
        </Routes>
      </Router>
  );
}

export default App;
