import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { appointmentService } from "../utils/apiService";

const PatientDashboard = () => {
  const { appointments, doctors, userDetails, setAppointments, logout } =
    useContext(AuthContext);
  const [formData, setFormData] = useState({
    doctorId: "",
    problem: "",
    date: "",
    time: "",
    emergency: false,
    patientId: userDetails?.id,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = { ...formData, patientId: userDetails?.id };
      const newAppointment = await appointmentService.createAppointment(payload);

      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);

      setFormData({
        doctorId: "",
        problem: "",
        date: "",
        time: "",
        emergency: false,
        patientId: userDetails?.id,
      });

      alert("Appointment booked successfully!");
    } catch (err) {
      console.error(err);
      setError("Error booking appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <div className="container mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold text-indigo-600 leading-tight">
            Patient Dashboard
          </h1>
          <p className="text-xl text-gray-700 mt-2">
            Manage your appointments and book new ones seamlessly
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Appointments Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">
              Your Appointments
            </h2>
            {appointments?.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => {
                  const doctorName = appointment.doctor?.name || "Unknown";
                  const doctorSpecialization =
                    appointment.doctor?.specialization || "Not specified";

                  return (
                    <div
                      key={appointment._id}
                      className="p-4 bg-gray-50 rounded-lg shadow"
                    >
                      <p className="text-gray-700">
                        <strong>Doctor:</strong> {doctorName}
                      </p>
                      <p className="text-gray-700">
                        <strong>Specialization:</strong>{" "}
                        {doctorSpecialization}
                      </p>
                      <p className="text-gray-700">
                        <strong>Problem:</strong> {appointment.problem}
                      </p>
                      <p className="text-gray-700">
                        <strong>Date:</strong>{" "}
                        {new Date(appointment.date).toLocaleDateString()}
                      </p>
                      <p className="text-gray-700">
                        <strong>Status:</strong>{" "}
                        {appointment.status || "Pending"}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500">No appointments scheduled.</p>
            )}
          </div>

          {/* Booking Form */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-600">
              Book New Appointment
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Doctor:</label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a doctor</option>
                  {doctors &&
                    doctors.map((doctor) => (
                      <option
                        key={doctor.doctorId}
                        value={doctor.doctorId}
                      >
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Problem:</label>
                <input
                  type="text"
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Date:</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Time:</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="text-gray-700">Emergency:</label>
                <input
                  type="checkbox"
                  name="emergency"
                  checked={formData.emergency}
                  onChange={handleChange}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg shadow-md transition ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-indigo-700"
                }`}
              >
                {loading ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
