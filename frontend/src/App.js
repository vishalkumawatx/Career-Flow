// updated [frontend/src/App.js]
import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';
import { ApplicationProvider, useApplications } from './context/ApplicationContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.js';
import Dashboard from './pages/Dashboard.js';
import Applications from './pages/Applications.js';
import Profile from './pages/Profile.js';
import Auth from './pages/Auth.js';
import './App.css';

const ApplicationContent = ({ currentPage, onNavigate }) => {
  const { loading } = useApplications();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  switch (currentPage) {
    case 'dashboard':
      return <Dashboard onAddNew={() => onNavigate('applications')} />;
    case 'applications':
      return <Applications />;
    case 'profile':
      return <Profile />;
    default:
      return <Dashboard onAddNew={() => onNavigate('applications')} />;
  }
};

const AppWithAuth = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Auth isLogin={currentPage === 'login'} onNavigate={setCurrentPage} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <>
      <Navbar onNavigate={setCurrentPage} onThemeToggle={handleThemeToggle} theme={theme} />
      <main className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-800 p-6">
        <ApplicationProvider>
          <ApplicationContent currentPage={currentPage} onNavigate={setCurrentPage} />
        </ApplicationProvider>
      </main>
      <Toaster position="top-right" />
    </>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppWithAuth />
    </AuthProvider>
  );
};

export default App;
