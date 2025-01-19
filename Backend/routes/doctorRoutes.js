const express = require("express");
const {
  registerDoctor,
  loginDoctor,
  setDoctorAvailable,
  setDoctorBusy,
  setDoctorOffDuty,
  acceptAppointment,
  rejectAppointment,
  editDoctorProfile
} = require("../controllers/doctorController");
const authMiddleware = require("../middlewares/authMiddlewares");

const router = express.Router();

// Doctor routes
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/update/:doctorId", authMiddleware, editDoctorProfile);

// Doctor status routes
router.patch("/doctor/:doctorId/available", authMiddleware, setDoctorAvailable);
router.patch("/doctor/:doctorId/busy", authMiddleware, setDoctorBusy);
router.patch("/doctor/:doctorId/off-duty", authMiddleware, setDoctorOffDuty);

// Appointment routes
router.patch("/doctor/:doctorId/appointment/:appointmentId/accept", authMiddleware, acceptAppointment);
router.patch("/doctor/:doctorId/appointment/:appointmentId/reject", authMiddleware, rejectAppointment);

module.exports = router;
