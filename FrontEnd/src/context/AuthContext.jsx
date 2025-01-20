import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, appointmentService, doctorService } from '../utils/apiService';

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

    console.log(user);
    console.log("hjghjghjghj")

    if (user) {
      fetchAppointments(user.id, user.role);
      fetchDoctors();
    }
  }, []);

  // Fetch appointments for the patient
  const fetchAppointments = async (patientId, role) => {
    try {
      const response = await appointmentService.getAppointmentForUser({patientId, role });
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments', error);
    }
  };

  // Fetch the list of doctors
  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors();
      console.log(response.data);
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
    navigate(role === 'Doctor' ? '/doctor-dashboard' : '/patient-dashboard');
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setAuth(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, appointments, doctors, userDetails}}>
      {children}
    </AuthContext.Provider>
  );
};
