import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecordingProvider } from './contexts/RecordingContext';
import Main from './pages/Main';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Events from './pages/Events';
import Search from './pages/Search';
import ThemeSettings from './pages/ThemeSettings';
import Admin from './pages/Admin';
import AIPrediction from './pages/AIPrediction';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function App() {
  return (
    <RecordingProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/events"
            element={
              <PrivateRoute>
                <Events />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <Search />
              </PrivateRoute>
            }
          />
          <Route
            path="/theme"
            element={
              <PrivateRoute>
                <ThemeSettings />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            }
          />
          <Route
            path="/ai-prediction"
            element={
              <PrivateRoute>
                <AIPrediction />
              </PrivateRoute>
            }
          />
          </Routes>
        </div>
      </Router>
    </RecordingProvider>
  );
}

export default App;

