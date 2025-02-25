import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LoginPage from './pages/LoginPage';
// import PatientLogin from './pages/patient/PatientLogin';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import LandingPage from './pages/LandingPage';
import DoctorRegisterPage from './pages/DoctorRegisterPage';
import PatientRegisterPage from './pages/PatientRegisterPage';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/doctor/register' element={<DoctorRegisterPage />} />
          <Route path='/patient/register' element={<PatientRegisterPage />} />
          
          {/* Protected Routes */}
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          {/* </Route> */}
          
          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/patient-dashboard" element={<PatientDashboard />} />
          {/* </Route> */}
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;