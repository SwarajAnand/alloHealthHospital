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
    setAvailable: (doctorId) => instance.patch(`/doctors/${doctorId}/available`),
    setBusy: (doctorId) => instance.patch(`/doctors/${doctorId}/busy`),
    setOffDuty: (doctorId) => instance.patch(`/doctors/${doctorId}/off-duty`),
    acceptAppointment: (doctorId, appointmentId) =>
        instance.patch(`/doctors/${doctorId}/appointment/${appointmentId}/accept`),
    rejectAppointment: (doctorId, appointmentId) =>
        instance.patch(`/doctors/${doctorId}/appointment/${appointmentId}/reject`),
};

export const appointmentService = {
    createAppointment: (data) => instance.post("/appointments/appointment", data),
    getAllAppointments: () => instance.get("/appointments/all"),
    getAppointmentForUser: (data) => instance.get("/appointments/appointments", data),
    deleteAppointment: (id) => instance.delete(`/appointments/appointment/${id}`),
};
