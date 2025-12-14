import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx';
import DashBoard from './pages/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Profile from './pages/Profile.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import './App.css'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />} >
        <Route path='/' element={<DashBoard />} />
        <Route path='/profile' element={<Profile />} />
      </Route>
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
