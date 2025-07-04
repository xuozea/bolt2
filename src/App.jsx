import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueueProvider } from './contexts/QueueContext';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import Dashboard from './components/Dashboard/Dashboard';
import BusinessList from './components/Businesses/BusinessList';
import BookingForm from './components/Booking/BookingForm';
import ProfilePage from './components/Profile/ProfilePage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return !currentUser ? <>{children}</> : <Navigate to="/dashboard" />;
};

const AppContent = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/businesses" element={<BusinessList />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupForm />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book/:businessId"
          element={
            <ProtectedRoute>
              <BookingForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <QueueProvider>
          <AppContent />
        </QueueProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;