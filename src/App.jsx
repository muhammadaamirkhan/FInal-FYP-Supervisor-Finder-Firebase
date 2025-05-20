// src/App.js
import React from "react";
import Home from "./components/pages/Home";
import Faculty from "./components/pages/Faculty";
import Student from "./components/pages/Student";
import { Route, Routes, Navigate } from "react-router-dom";
import Admin from "./components/pages/Admin";
import Login from "./components/Auth/Login";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route 
        path="/faculty" 
        element={
          <ProtectedRoute>
            <Faculty />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/student" 
        element={
          <ProtectedRoute>
            <Student />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        } 
      />
      
      {/* Redirect any unknown paths to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;