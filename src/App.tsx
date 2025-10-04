import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            
            {/* Role-based protected routes (examples) */}
            <Route
              path="/business"
              element={
                <ProtectedRoute requiredRole="business_owner">
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">Business Management</h2>
                    <p className="text-gray-600 mt-2">This page is only accessible to business owners.</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">Admin Panel</h2>
                    <p className="text-gray-600 mt-2">This page is only accessible to administrators.</p>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">User Profile</h2>
                    <p className="text-gray-600 mt-2">Profile management coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">Bookings</h2>
                    <p className="text-gray-600 mt-2">Booking management coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/book"
              element={
                <ProtectedRoute>
                  <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold">Book Appointment</h2>
                    <p className="text-gray-600 mt-2">Appointment booking coming soon...</p>
                  </div>
                </ProtectedRoute>
              }
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 Not Found */}
            <Route 
              path="*" 
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <Navigate to="/dashboard" replace />
                  </div>
                </div>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
