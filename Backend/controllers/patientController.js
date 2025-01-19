const Patient = require("../models/Patient");
const {
  sendSuccess
} = require("../utils/responseHandler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


exports.registerPatient = async (req, res, next) => {
  const {
    name,
    email,
    password,
    phone,
    age,
    gender
  } = req.body;

  try {
    const patientExists = await Patient.findOne({
      email
    });
    if (patientExists) return res.status(400).json({
      message: "Patient already exists"
    });

    const newPatient = new Patient({
      name,
      email,
      password,
      phone,
      age,
      gender
    });
    await newPatient.save();

    sendSuccess(res, {
      id: newPatient._id,
      name: newPatient.name
    }, "Patient registered successfully");
  } catch (error) {
    next(error);
  }
};

exports.loginPatient = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;

  try {
    const patient = await Patient.findOne({
      email
    });
    if (!patient) return res.status(401).json({
      message: "Invalid credentials"
    });

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) return res.status(401).json({
      message: "Invalid credentials"
    });

    const token = jwt.sign({ id: patient._id, role: 'Patient' }, process.env.SECRET_TOKEN_KEY, { expiresIn: "1D" });

    sendSuccess(res, {
      id: patient._id,
      name: patient.name,
      token
    }, "Patient logged in successfully");
  } catch (error) {
    next(error);
  }
};
