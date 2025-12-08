import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx';
import DashBoard from './pages/Dashboard.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import './App.css'

// component to protect routes
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p> checking session...</p>;
  if (!user) return <Navigate to="/login" />;

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoute>
          <DashBoard />
        </ProtectedRoute>
      } />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
