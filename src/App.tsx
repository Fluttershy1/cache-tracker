import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginScreen from './screens/LoginScreen';
import MainScreen from './screens/MainScreen';
import AddExpenseScreen from './screens/AddExpenseScreen';
import StatisticsScreen from './screens/StatisticsScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="mobile-container">
            <Routes>
              <Route path="/login" element={<LoginScreen />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <MainScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/add" 
                element={
                  <ProtectedRoute>
                    <AddExpenseScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/statistics" 
                element={
                  <ProtectedRoute>
                    <StatisticsScreen />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/categories" 
                element={
                  <ProtectedRoute>
                    <CategoriesScreen />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App; 