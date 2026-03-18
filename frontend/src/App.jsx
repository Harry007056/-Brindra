import { Routes, Route, Navigate } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import Payment from './pages/Payment';
import AboutUs from './pages/AboutUs';
import Tasks from './pages/Tasks';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Dashboard from './pages/Dashboard';
import TeamMembers from './pages/TeamMembers';
import Projects from './pages/Projects';
import Messages from './components/Messages';
import Files from './components/Files';
import Chat from './pages/Chat';
import Teams from './pages/Teams';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ProjectDetails from './pages/ProjectDetails';
import Spinner from './components/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, sessionLoading } = useAuth();
  
  if (sessionLoading) {
    return <Spinner />;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

        <Route element={<Layout />}>
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/team" element={<ProtectedRoute><TeamMembers /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
          <Route path="/files" element={<ProtectedRoute><Files /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/teams" element={<ProtectedRoute><Teams /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/project/:id" element={<ProtectedRoute><ProjectDetails /></ProtectedRoute>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
