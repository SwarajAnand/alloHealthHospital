const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const { sendSuccess } = require("../utils/responseHandler");

exports.createAppointment = async (req, res, next) => {
  try {
    const { doctorId, patientId, date, time } = req.body;

    const appointment = await Appointment.create({
      doctor: doctorId,
      patient: patientId,
      date,
      time,
    });

    await Doctor.findByIdAndUpdate(
      doctorId,
      { $push: { appointments: appointment._id } },
      { new: true }
    );

    await Patient.findByIdAndUpdate(
      patientId,
      { $push: { appointments: appointment._id } },
      { new: true }
    );

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

exports.getAppointments = async (req, res, next) => {
  try {
    const { role, id } = req.query;

    console.log(req.query);

    let appointments;

    if (role === "Patient") {
      appointments = await Appointment.find({ patient: id })
        .populate("doctor", "name specialization")
        .populate("patient", "name email");
    } else if (role === "Doctor") {
      appointments = await Appointment.find({ doctor: id })
        .populate("doctor", "name specialization")
        .populate("patient", "name email");
    } else {
      return res.status(400).json({ message: "Invalid role. It must be either 'Doctor' or 'Patient'." });
    }

    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};
exports.deleteAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      const error = new Error("Appointment not found.");
      error.status = 404;
      throw error;
    }

    const { doctor, patient } = appointment;

    await Doctor.findByIdAndUpdate(
      doctor,
      { $pull: { appointments: id } },
      { new: true }
    );

    await Patient.findByIdAndUpdate(
      patient,
      { $pull: { appointments: id } },
      { new: true }
    );

    await Appointment.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: "Appointment deleted successfully." });
  } catch (error) {
    next(error);
  }
};

exports.getAllAppointmentsForDoctors = async (req, res, next) => {
  try {
    const { role } = req.user;
    if (role !== "Doctor") {
      return res.status(403).json({ message: "Forbidden: Only doctors can access this resource." });
    }
    
    const appointments = await Appointment.find()
      .populate("doctor", "name specialization")
      .populate("patient", "name email")
      .sort({ emergency: -1, date: 1 }); 
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};
