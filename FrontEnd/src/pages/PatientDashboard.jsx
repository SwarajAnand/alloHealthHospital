import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { appointmentService } from '../utils/apiService';

const PatientDashboard = () => {
  const { appointments, doctors, userDetails } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    doctorId: '',
    problem: '',
    date: '',
    time: '',
    emergency: false,
    patientId: userDetails.id
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.debug(typeof userDetails)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await appointmentService.createAppointment(formData);
      alert('Appointment booked successfully!');
      setFormData({ doctorId: '', problem: '', date: '', time: '', emergency: false });
    } catch (err) {
      setError('Error booking appointment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="patient-profile">
      <div className="appointments">
        <h2>Your Appointments</h2>
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment._id} className="appointment">
              <p>Doctor: {appointment.doctor.name}</p>
              <p>Specialization: {appointment.doctor.specialization}</p>
              <p>Problem: {appointment.problem}</p>
              <p>Date: {new Date(appointment.date).toLocaleDateString()}</p>
              <p>Status: {appointment.status}</p>
            </div>
          ))
        ) : (
          <p>No appointments scheduled.</p>
        )}
      </div>

      <div className="book-appointment">
        <h2>Book New Appointment</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Doctor:</label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              required
            >
              <option value="">Select a doctor</option>
              {doctors && doctors.map((doctor) => (
                <option key={doctor.doctorId} value={doctor.doctorId}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Problem:</label>
            <input
              type="text"
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Date:</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Time:</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Emergency:</label>
            <input
              type="checkbox"
              name="emergency"
              checked={formData.emergency}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientDashboard;
