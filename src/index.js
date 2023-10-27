// Import the required Modules
import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; 

// Import the Styling Module
import './index.css';

// Import the Images
import logo from "./assets/git.jpg";
import websiteLogo from "./assets/logo.png"

// Import the Componeents 
import Login from './components/Login';
import Home from './components/Home';
import DashBoard from "./components/DashBoard";
import Admin from "./components/Admin";

ReactDOM.render(
  <BrowserRouter>
  <div className='navbar' id='top'>
    <img src={logo} className='logo'/>
    <img src={websiteLogo} className='websiteLogo'/>
    <div className='DarkmodeButton'></div>
  </div>
    <Routes>
      {/* The Default Route is Login Page */}
      <Route path="/" element={<Login />} />

      {/* The Routes for the other pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/dashboard" element={<DashBoard />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
    <footer>
        <div className='footerContainer'>
          <div className='contact'>
            <div>CONTACT THE CREATORS</div>
            <div className='contactMail'>EMAIL: <a href='mailto:nimishgj444@gmail.com'>nimishgj444@gmail.com</a></div>
          </div>
          <div className='links'>
            <a href='https://git.edu/'>- COLLEGE WEBSITE</a>
            <a href='https://klsgroup.dhi-edu.com/'>- DHI WEBSITE LINK</a>
            <a href='#top'>- BACK TO TOP</a>
            <a href=''>- LOGIN PAGE</a>
          </div>
        </div>
      </footer>
  </BrowserRouter>,
  document.getElementById('root')
);

reportWebVitals();
