import instance from "./axios";

export const authService = {
    loginDoctor: (credentials) => instance.post("/doctors/login", credentials),
    loginPatient: (credentials) => instance.post("/patients/login", credentials),
    registerDoctor: (data) => instance.post("/doctors/register", data),
    registerPatient: (data) => instance.post("/patients/register", data),
};

export const doctorService = {
    updateProfile: (doctorId, data) =>
        instance.post(`/doctors/update/${doctorId}`, data),
    setAvailable: (doctorId) => instance.patch(`/doctors/doctor/${doctorId}/available`), 
    getAllDoctors: () => instance.get("/doctors/getAlldoctors"),
    setBusy: (doctorId) => instance.patch(`/doctors/doctor/${doctorId}/busy`), 
    setOffDuty: (doctorId) => instance.patch(`/doctors/doctor/${doctorId}/off-duty`),
    acceptAppointment: (doctorId, appointmentId) =>
        instance.patch(`/doctors/doctor/${doctorId}/appointment/${appointmentId}/accept`),
    rejectAppointment: (doctorId, appointmentId) =>
        instance.patch(`/doctors/doctor/${doctorId}/appointment/${appointmentId}/reject`),
    getProfile: (doctorId) => 
        instance.get(`/doctors/profile/${doctorId}`), 
};

export const appointmentService = {
    createAppointment: (data) => instance.post("/appointments/appointment", data),
    getAllAppointments: () => instance.get("/appointments/appointments/all"),
    getAppointmentForUser: (data) =>
        instance.get("/appointments/appointments", {
          params: data,
        }),
    deleteAppointment: (id) => instance.delete(`/appointments/appointment/${id}`),
};
