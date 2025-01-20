import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentService, doctorService } from '../utils/apiService';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('user'));
    setUserDetails(user);

    if (token && user) {
      setAuth({ token, ...user });
    }

    if (user) {
      fetchAppointments(user.id, user.role);
      fetchDoctors();
    }
  }, []);

  const fetchAppointments = async (patientId, role) => {
    try {
      const data = { id: patientId, role: role };
      const response = await appointmentService.getAppointmentForUser(data);
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors();
      setDoctors(response.data.data);
    } catch (error) {
      console.error('Error fetching doctors', error);
    }
  };

  const login = (user) => {
    const { token, id, name, role } = user;
    localStorage.setItem('authToken', token);
    setUserDetails({ id, name, role });
    localStorage.setItem('user', JSON.stringify({ id, name, role }));
    setAuth({ token, id, name, role });
    fetchDoctors();
    navigate(role === 'Doctor' ? '/doctor-dashboard' : '/patient-dashboard');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuth(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, appointments, setAppointments, doctors, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
