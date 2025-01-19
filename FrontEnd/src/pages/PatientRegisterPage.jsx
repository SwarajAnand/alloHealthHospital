import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../utils/apiService';
import FormUi from '../components/FormUi';

const patientFields = [
  { name: 'name', type: 'text', placeholder: 'Full Name', required: true },
  { name: 'email', type: 'email', placeholder: 'Email Address', required: true },
  { name: 'password', type: 'password', placeholder: 'Password', required: true },
  { name: 'phone', type: 'tel', placeholder: 'Phone Number', required: true },
  { name: 'age', type: 'number', placeholder: 'Age', required: true },
  { name: 'gender', type: 'text', placeholder: 'Gender (Male, Female, Other)', required: true },
];

const PatientRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    age: '',
    gender: '',
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

    const isFormValid = patientFields.every((field) => formData[field.name].trim() !== '');

    if (!isFormValid) {
      setError('Please fill out all required fields.');
      setLoading(false);
      return;
    }

    try {
      await authService.registerPatient(formData);  // Assuming a registerPatient function in authService
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
        title="Patient Registration"
        onSubmit={handleSubmit}
        fields={patientFields}
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

export default PatientRegisterPage;
