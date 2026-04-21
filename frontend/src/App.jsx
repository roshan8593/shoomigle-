import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home'
import { BrowserRouter, Routes, Route } from "react-router";
import Signup from "./components/Signup"
import Login from './components/login'
import PageNotFound from './components/pagenot'
import Mainpage from './components/Mainpage'
import ChatWindow from './components/Chat'
import VideoChat from './components/VideoChat'
import FriendsPage from './components/friends'
import ProtectedRoute from './components/Protected'
function App() {
 

  return (
    <>
   <Routes>
      <Route path="/" element={
     <Home/>
      }></Route>
      <Route path="/Signup" element={
        
        <Signup/>
     
      } />
      <Route path="/login" element={
        
        <Login/>
      
      } />
      <Route path="*" element={
     <PageNotFound/>
   
  } />
      <Route path="/main" element={<ProtectedRoute>
      <Mainpage></Mainpage>
    </ProtectedRoute>
  } />
      <Route path="/chat" element={<ProtectedRoute>
     <ChatWindow/>
    </ProtectedRoute>} />
      <Route path="/video" element={<ProtectedRoute>
      <VideoChat />
    </ProtectedRoute>
  } />
      <Route path="/friends" element={<ProtectedRoute>
     <FriendsPage/>
    </ProtectedRoute>
  } />

    </Routes>
    </>
  )
}

export default App
