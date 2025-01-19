import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/apiService';
import FormUi from '../components/FormUi';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const doctorFields = [
    { name: 'email', type: 'email', placeholder: 'Doctor Email Address', required: true },
    { name: 'password', type: 'password', placeholder: 'Password', required: true },
  ];

  const patientFields = [
    { name: 'email', type: 'email', placeholder: 'Patient Email Address', required: true },
    { name: 'password', type: 'password', placeholder: 'Password', required: true },
  ];

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [role, setRole] = useState('doctor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    setRole(e.target.value);
    setFormData({ email: '', password: '' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const isFormValid = formData.email.trim() !== '' && formData.password.trim() !== '';
    if (!isFormValid) {
      setError('Please fill out all required fields.');
      setLoading(false);
      return;
    }

    try {
      let response;
      if (role === 'doctor') {
        response = await authService.loginDoctor(formData);
      } else {
        response = await authService.loginPatient(formData);
      }

      const responseData = response.data.data;

      if (response?.status === 200) {
        const { id, name, role, token } = responseData;

        console.debug({ id, name, role, token });

        login({ id, name, role, token });

        navigate(role === 'doctor' ? '/doctor/register' : '/patient-dashboard');
      } else {
        setError(response?.message || 'An error occurred while logging in');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center space-x-4 text-xl m-2">
            <label>
              <input
                type="radio"
                value="doctor"
                checked={role === 'doctor'}
                onChange={handleRoleChange}
              /> Doctor
            </label>
            <label>
              <input
                type="radio"
                value="patient"
                checked={role === 'patient'}
                onChange={handleRoleChange}
              /> Patient
            </label>
          </div>
        </div>

        <FormUi
          title={`${role.charAt(0).toUpperCase() + role.slice(1)} Login`}
          onSubmit={handleSubmit}
          fields={role === 'doctor' ? doctorFields : patientFields}
          formData={formData}
          handleChange={handleChange}
          error={error}
          isLoading={loading}
          submitButtonText="Login"
          loadingText="Logging in..."
          redirectText="Don't have an account?"
          redirectLinkText="Sign up here"
          redirectPath={role === 'doctor' ? '/doctor/register' : '/patient/register'}
        />
      </div>
    </div>
  );
};

export default LoginPage;
