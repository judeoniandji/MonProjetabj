import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useSelector, useDispatch } from 'react-redux';

import theme from './theme';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import { setUser } from './redux/authSlice';

// Pages d'authentification
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './components/auth/Register';

// Page d'accueil
import Home from './pages/Home';

// Nouveau tableau de bord unifié
import Dashboard from './pages/Dashboard';

// Pages communes
import Jobs from './pages/Jobs';
import Events from './pages/Events';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

// Nouvelles pages d'emploi
import JobSearch from './pages/JobSearch';
import JobDetail from './pages/JobDetail';
import JobMatching from './pages/JobMatching';
import JobDetails from './pages/JobDetails'; 
import JobInsights from './pages/JobInsights'; // Nouvelle page d'insights IA

// Pages de mentorat
import MentorSearch from './pages/MentorSearch';
import MentorshipRequest from './pages/MentorshipRequest';

// Page de recrutement pour les entreprises
import CompanyRecruitment from './pages/CompanyRecruitment';

function App() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Vérifier si l'utilisateur est déjà connecté (token dans localStorage)
  useEffect(() => {
    if (token && !user) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          dispatch(setUser(JSON.parse(storedUser)));
        } catch (error) {
          console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        }
      }
    }
  }, [token, user, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navigation />
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/" replace />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/" replace />} />
          <Route path="/forgot-password" element={!token ? <ForgotPassword /> : <Navigate to="/" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />

          {/* Route du tableau de bord - accessible uniquement aux utilisateurs connectés */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          {/* Routes de recherche d'emploi - Accessibles uniquement aux étudiants */}
          <Route path="/jobs" element={
            <ProtectedRoute allowedRoles={['student']}>
              <JobSearch />
            </ProtectedRoute>
          } />
          <Route path="/jobs/matching" element={
            <ProtectedRoute allowedRoles={['student']}>
              <JobMatching />
            </ProtectedRoute>
          } />
          <Route path="/jobs/insights" element={
            <ProtectedRoute allowedRoles={['student']}>
              <JobInsights />
            </ProtectedRoute>
          } />
          <Route path="/jobs/:jobId" element={
            <ProtectedRoute allowedRoles={['student']}>
              <JobDetail />
            </ProtectedRoute>
          } />
          <Route path="/jobs/senegal/:jobId" element={
            <ProtectedRoute allowedRoles={['student']}>
              <JobDetails />
            </ProtectedRoute>
          } />

          {/* Routes de mentorat */}
          <Route path="/mentors" element={<MentorSearch />} />
          <Route path="/mentors/:mentorId/request" element={
            <ProtectedRoute allowedRoles={['student']}>
              <MentorshipRequest />
            </ProtectedRoute>
          } />

          {/* Routes protégées pour les étudiants */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="jobs" element={<JobSearch />} />
                  <Route path="jobs/insights" element={<JobInsights />} />
                  <Route path="events" element={<Events />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="mentorship/*" element={<Dashboard />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Routes protégées pour les mentors */}
          <Route
            path="/mentor/*"
            element={
              <ProtectedRoute allowedRoles={['mentor']}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="mentees" element={<Dashboard />} />
                  <Route path="sessions" element={<Events />} />
                  <Route path="resources" element={<Dashboard />} />
                  <Route path="network" element={<Dashboard />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Routes spécifiques aux établissements */}
          <Route
            path="/school/*"
            element={
              <ProtectedRoute allowedRoles={['school', 'university']}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="students" element={<Dashboard />} />
                  <Route path="events" element={<Events />} />
                  <Route path="events/new" element={<Dashboard />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="partners" element={<Dashboard />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Routes spécifiques aux entreprises */}
          <Route
            path="/company/*"
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="jobs" element={<Dashboard />} />
                  <Route path="jobs/new" element={<Dashboard />} />
                  <Route path="candidates" element={<Dashboard />} />
                  <Route path="events" element={<Events />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="recruitment" element={<CompanyRecruitment />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Routes spécifiques aux administrateurs */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="users" element={<Dashboard />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </ProtectedRoute>
            }
          />

          {/* Route par défaut - Redirection vers la page d'accueil */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;