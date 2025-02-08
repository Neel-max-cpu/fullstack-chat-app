import { useState, useEffect } from 'react'
import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/useAuthStore.js';

import Navbar from "./components/Navbar.jsx";

import HomePage from "./pages/HomePage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";


import { LoaderCircle } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth]);

  console.log({ authUser });

  // if no user and loading then loading spinner
  if (isCheckingAuth && !authUser)
    return (
      // loading part
      <div className="flex items-center justify-center h-screen">
        <LoaderCircle className='size-16 animate-spin text-red-500' />
      </div>
    )


  return (
    <div>

      <Navbar />
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster/>
    </div>
  )
}

export default App
