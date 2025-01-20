import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doctorService, appointmentService } from "../utils/apiService";

const DoctorDashboard = () => {
  const { userDetails, logout } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState({
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    specialization: "",
    experience: "",
    phone: "",
    shiftStart: "",
    shiftEnd: ""
  });
  const [availabilityStatus, setAvailabilityStatus] = useState("available");

  useEffect(() => {
    if (userDetails?.id && userDetails?.role === 'Doctor') {
      fetchAppointments();
    } else {
      setError("Unauthorized access. Please login as a doctor.");
      logout();
    }
    
    return () => {
      setAppointments([]);
    };
  }, [userDetails?.id]);

  const fetchAppointments = async () => {
    if (!userDetails?.id) return;
    
    setError("");
    setLoadingAppointments(true);
    
    try {
      const response = await appointmentService.getAllAppointments();
      if (response?.data?.data) {
        setAppointments(response.data.data);
      } else {
        setAppointments([]);
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      if (err.response?.status === 403) {
        setError("Access denied. Please make sure you're logged in as a doctor.");
        logout();
      } else {
        setError("Failed to fetch appointments. Please try again.");
      }
    } finally {
      setLoadingAppointments(false);
    }
  };

  const handleStatusChange = async (appointmentId, status) => {
    if (!userDetails?.id) return;

    try {
      if (status === "Scheduled") {
        await doctorService.acceptAppointment(userDetails.id, appointmentId);
      } else if (status === "Rejected") {
        await doctorService.rejectAppointment(userDetails.id, appointmentId);
      }
      
      // Refresh appointments after status change
      await fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment status:", err);
      setError("Failed to update appointment status. Please try again.");
    }
  };

  const handleAvailabilityChange = async (status) => {
    if (!userDetails?.id) return;

    try {
      switch (status) {
        case "available":
          await doctorService.setAvailable(userDetails.id);
          break;
        case "busy":
          await doctorService.setBusy(userDetails.id);
          break;
        case "off-duty":
          await doctorService.setOffDuty(userDetails.id);
          break;
        default:
          return;
      }
      setAvailabilityStatus(status);
    } catch (err) {
      console.error("Error updating availability:", err);
      setError("Failed to update availability status. Please try again.");
    }
  };

  const handleProfileUpdate = async () => {
    if (!userDetails?.id) return;

    try {
      await doctorService.updateProfile(userDetails.id, profileData);
      setError("");
      // Show success message
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, Dr. {userDetails?.name}</p>
          </div>
          <div className="flex gap-4">
            <select
              value={availabilityStatus}
              onChange={(e) => handleAvailabilityChange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="off-duty">Off Duty</option>
            </select>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-600">Total Appointments</h3>
            </div>
            <p className="text-2xl font-bold mt-2">{appointments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-600">Pending Reviews</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {appointments.filter(a => a.status === "Pending").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-600">Scheduled Today</h3>
            </div>
            <p className="text-2xl font-bold mt-2">
              {appointments.filter(a => 
                a.status === "Scheduled" && 
                new Date(a.date).toDateString() === new Date().toDateString()
              ).length}
            </p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialization</label>
                  <input
                    type="text"
                    value={profileData.specialization}
                    onChange={(e) => setProfileData({ ...profileData, specialization: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience (years)</label>
                  <input
                    type="number"
                    value={profileData.experience}
                    onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Shift Start</label>
                    <input
                      type="time"
                      value={profileData.shiftStart}
                      onChange={(e) => setProfileData({ ...profileData, shiftStart: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Shift End</label>
                    <input
                      type="time"
                      value={profileData.shiftEnd}
                      onChange={(e) => setProfileData({ ...profileData, shiftEnd: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 p-2 border focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
              <button
                onClick={handleProfileUpdate}
                className="w-full md:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            {loadingAppointments ? (
              <p className="text-gray-500">Loading appointments...</p>
            ) : appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="space-y-2 mb-4 md:mb-0">
                      <p className="font-medium">{appointment.patient?.name}</p>
                      <p className="text-sm text-gray-600">{appointment.problem}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(appointment.date).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={appointment.status}
                        onChange={(e) => handleStatusChange(appointment._id, e.target.value)}
                        className={`px-3 py-1 rounded-md border ${
                          appointment.status === "Scheduled" ? "text-green-600" :
                          appointment.status === "Rejected" ? "text-red-600" :
                          "text-yellow-600"
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Scheduled">Schedule</option>
                        <option value="Rejected">Reject</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No appointments found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;