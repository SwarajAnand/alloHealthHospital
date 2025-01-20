import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { doctorService, appointmentService } from "../utils/apiService";

const DoctorDashboard = () => {
  const { userDetails, logout } = useContext(AuthContext);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [allAppointments, setAllAppointments] = useState([]);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("all");
  const [profileData, setProfileData] = useState({
    name: userDetails?.name || "",
    email: userDetails?.email || "",
    specialization: "",
    experience: "",
    phone: "",
    shiftStart: "",
    shiftEnd: "",
  });
  const [availabilityStatus, setAvailabilityStatus] = useState("");

  useEffect(() => {
    if (userDetails?.id && userDetails?.role === "Doctor") {
      fetchAppointments();
      fetchProfile();
      fetchAvailability();
    } else {
      setError("Unauthorized access. Please login as a doctor.");
    }
  }, [userDetails?.id]);

  const fetchAppointments = async () => {
    setError("");
    setLoadingAppointments(true);
    try {
      const response = await appointmentService.getAllAppointments();
      setAllAppointments(response.data.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError("Failed to fetch appointments. Please try again.");
    } finally {
      setLoadingAppointments(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await doctorService.getProfile(userDetails.id);
      const data = response.data.data;
      setProfileData({
        name: data.name,
        email: data.email,
        specialization: data.specialization || "",
        experience: data.experience || "",
        phone: data.phone || "",
        shiftStart: data.shift?.start || "",
        shiftEnd: data.shift?.end || "",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to fetch profile data. Please try again.");
    }
  };

  const fetchAvailability = async () => {
    try {
      const response = await doctorService.getProfile(userDetails.id);
      setAvailabilityStatus(response.data.data.status || "available");
    } catch (err) {
      console.error("Error fetching availability:", err);
      setError("Failed to fetch availability. Please try again.");
    }
  };

  const handleStatusChange = async (appointmentId, status) => {
    try {
      if (status === "Scheduled") {
        await doctorService.acceptAppointment(userDetails.id, appointmentId);
      } else if (status === "Rejected") {
        await doctorService.rejectAppointment(userDetails.id, appointmentId);
      }
      await fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment status:", err);
      setError("Failed to update appointment status. Please try again.");
    }
  };

  const handleAvailabilityChange = async (status) => {
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
      await fetchAvailability();
    } catch (err) {
      console.error("Error updating availability:", err);
      setError("Failed to update availability status. Please try again.");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const updateData = {
        ...profileData,
        shift: {
          start: profileData.shiftStart,
          end: profileData.shiftEnd,
        },
      };
      await doctorService.updateProfile(userDetails.id, updateData);
      alert("Profile updated successfully!");
      await fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    }
  };

  const filteredAppointments =
    viewMode === "your"
      ? allAppointments.filter((a) => a.doctor._id === userDetails.id)
      : allAppointments;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
          <div className="flex gap-4">
            <select
              value={availabilityStatus}
              onChange={(e) => handleAvailabilityChange(e.target.value)}
              className="px-4 py-2 rounded-lg border"
            >
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="off-duty">Off Duty</option>
            </select>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 p-4 rounded">{error}</div>}

        {/* Tabs */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "all" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            All Appointments
          </button>
          <button
            onClick={() => setViewMode("your")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "your" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            Your Appointments
          </button>
          <button
            onClick={() => setViewMode("profile")}
            className={`px-4 py-2 rounded-lg ${
              viewMode === "profile"
                ? "bg-indigo-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Update Profile
          </button>
        </div>

        {/* Content */}
        {viewMode === "profile" ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Email</label>
                <input
                  type="text"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Specialization</label>
                <input
                  type="text"
                  value={profileData.specialization}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      specialization: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Experience</label>
                <input
                  type="text"
                  value={profileData.experience}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      experience: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Phone</label>
                <input
                  type="text"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Shift Start</label>
                <input
                  type="text"
                  value={profileData.shiftStart}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      shiftStart: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700">Shift End</label>
                <input
                  type="text"
                  value={profileData.shiftEnd}
                  onChange={(e) =>
                    setProfileData({ ...profileData, shiftEnd: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded"
                />
              </div>
              <button
                onClick={handleProfileUpdate}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Appointments</h2>
            {loadingAppointments ? (
              <p>Loading...</p>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment._id} className="p-4 border rounded-lg">
                    <div className="flex justify-between mb-2">
                      <div>
                        <p className="font-semibold">
                          Patient: {appointment.patient?.name}
                        </p>
                        <p className="text-gray-600">
                          Email: {appointment.patient?.email}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">
                          Doctor: {appointment.doctor?.name}
                        </p>
                        <p className="text-gray-600">
                          Specialization: {appointment.doctor?.specialization}
                        </p>
                      </div>
                    </div>
                    <div className="mb-2">
                      <p className="font-medium">
                        Date: {new Date(appointment.date).toLocaleDateString()}
                      </p>
                      <p className="font-medium">Time: {appointment.time}</p>
                    </div>
                    <div className="flex gap-4">
                      <p>
                        Status:{" "}
                        <span
                          className={`text-${
                            appointment.status === "Scheduled" ? "green" : "red"
                          }-500`}
                        >
                          {appointment.status}
                        </span>
                      </p>
                      <select
                        value={appointment.status}
                        onChange={(e) =>
                          handleStatusChange(appointment._id, e.target.value)
                        }
                        className="px-3 py-1 border rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Scheduled">Scheduled</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
