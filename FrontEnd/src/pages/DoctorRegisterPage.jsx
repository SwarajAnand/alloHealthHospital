import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/apiService';
import FormUi from '../components/FormUi';

const doctorFields = [
  { name: 'name', type: 'text', placeholder: 'Full Name', required: true },
  { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
  { name: 'password', type: 'password', placeholder: 'Password', required: true },
  { name: 'specialization', type: 'text', placeholder: 'Specialization', required: true },
  { name: 'experience', type: 'number', placeholder: 'Years of Experience', required: true },
  { name: 'phone', type: 'tel', placeholder: 'Phone Number', required: true },
];

const DoctorRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    specialization: '',
    experience: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const isFormValid = doctorFields.every(field => {
      return formData[field.name].trim() !== '';
    });

    if (!isFormValid) {
      setError('Please fill out all required fields.');
      setLoading(false);
      return;
    }

    try {
      await authService.registerDoctor(formData);
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while registering');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <FormUi
        title="Doctor Registration"
        onSubmit={handleSubmit}
        fields={doctorFields}
        formData={formData}
        handleChange={handleChange}
        error={error}
        isLoading={loading}
        submitButtonText="Register"
        loadingText="Registering..."
        redirectText="Already have an account?"
        redirectLinkText="Sign in here"
        redirectPath="/login"
      />
    </div>
  );
};

export default DoctorRegisterPage;
