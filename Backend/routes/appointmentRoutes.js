const express = require("express");
const {
  createAppointment,
  getAppointments,
  deleteAppointment,
  getAllAppointmentsForDoctors
} = require("../controllers/appointmentController");

const router = express.Router();

router.post("/appointment", createAppointment);
router.get("/appointments", getAppointments);
router.delete("/appointment/:id", deleteAppointment);
router.get("/appointments/all", getAllAppointmentsForDoctors);

module.exports = router;
