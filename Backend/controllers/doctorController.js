const Doctor = require("../models/Doctor");
const Appointment = require("../models/Appointment");
const bcrypt = require("bcryptjs");
const { sendSuccess } = require("../utils/responseHandler");
const jwt = require("jsonwebtoken");

exports.registerDoctor = async (req, res, next) => {
  const { name, email, password, specialization, experience, phone } = req.body;

  try {
    const doctorExists = await Doctor.findOne({ email });
    if (doctorExists)
      return res.status(400).json({
        message: "Doctor already exists",
      });

    const newDoctor = new Doctor({
      name,
      email,
      password,
      specialization,
      experience,
      phone,
      role,
    });
    await newDoctor.save();

    sendSuccess(
      res,
      { id: newDoctor._id, name: newDoctor.name, role: 'Doctor'},
      "Doctor registered successfully"
    );
  } catch (error) {
    next(error);
  }
};

exports.loginDoctor = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor)
      return res.status(401).json({
        message: "Invalid credentials",
      });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch)
      return res.status(401).json({
        message: "Invalid credentials",
      });

    const token = jwt.sign({ id: doctor._id, role: 'Doctor'}, process.env.SECRET_TOKEN_KEY, { expiresIn: "1D" });

    sendSuccess(
      res,
      { id: doctor._id, name: doctor.name, role: 'Doctor', token },
      "Doctor logged in successfully"
    );
  } catch (error) {
    next(error);
  }
};

exports.editDoctorProfile = async (req, res, next) => {
  const { doctorId } = req.params;
  const {
    name,
    email,
    password,
    specialization,
    experience,
    phone,
    shiftStart,
    shiftEnd,
  } = req.body;

  try {
    const updates = {};

    if (name) updates.name = name;
    if (email) updates.email = email;
    if (specialization) updates.specialization = specialization;
    if (experience) updates.experience = experience;
    if (phone) updates.phone = phone;
    if (shiftStart || shiftEnd) {
      updates.shift = {
        ...(shiftStart && { start: shiftStart }),
        ...(shiftEnd && { end: shiftEnd }),
      };
    }

    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }

    const doctor = await Doctor.findByIdAndUpdate(doctorId, updates, {
      new: true,
    });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    sendSuccess(
      res,
      {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        phone: doctor.phone,
        shift: doctor.shift,
        role: 'Doctor',
      },
      "Doctor profile updated successfully"
    );
  } catch (error) {
    next(error);
  }
};

exports.setDoctorAvailable = async (req, res, next) => {
  const { doctorId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    doctor.status = "available";
    await doctor.save();

    sendSuccess(
      res,
      { status: doctor.status },
      "Doctor is now available"
    );
  } catch (error) {
    next(error);
  }
};

exports.setDoctorBusy = async (req, res, next) => {
  const { doctorId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    doctor.status = "busy";
    await doctor.save();

    sendSuccess(
      res,
      { status: doctor.status },
      "Doctor is now busy"
    );
  } catch (error) {
    next(error);
  }
};

exports.setDoctorOffDuty = async (req, res, next) => {
  const { doctorId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    doctor.status = "off-duty";
    await doctor.save();

    // Set all doctor's appointments to pending status
    await Appointment.updateMany(
      { doctor: doctorId, status: "Scheduled" },
      { status: "Pending" }
    );

    sendSuccess(
      res,
      { status: doctor.status },
      "Doctor is now off-duty and all appointments are marked as pending"
    );
  } catch (error) {
    next(error);
  }
};

exports.acceptAppointment = async (req, res, next) => {
  const { doctorId, appointmentId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);
    const appointment = await Appointment.findById(appointmentId);

    if (!doctor || !appointment) {
      return res.status(404).json({
        message: "Doctor or Appointment not found",
      });
    }

    appointment.status = "Scheduled";
    await appointment.save();

    sendSuccess(
      res,
      { doctorStatus: doctor.status, appointmentStatus: appointment.status },
      "Appointment accepted and doctor marked as busy"
    );
  } catch (error) {
    next(error);
  }
};


exports.rejectAppointment = async (req, res, next) => {
  const { doctorId, appointmentId } = req.params;

  try {
    const doctor = await Doctor.findById(doctorId);
    const appointment = await Appointment.findById(appointmentId);

    if (!doctor || !appointment) {
      return res.status(404).json({
        message: "Doctor or Appointment not found",
      });
    }

    appointment.status = "Rejected";
    await appointment.save();

    sendSuccess(
      res,
      { doctorStatus: doctor.status, appointmentStatus: appointment.status },
      "Appointment rejected and doctor marked as available"
    );
  } catch (error) {
    next(error);
  }
};
