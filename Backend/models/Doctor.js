const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  appointments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
    },
  ],
  status: {
    type: String,
    enum: ["available", "busy", "off-duty"],
    default: "available",
  },
  role: {
    type: String,
    enum: ["doctor", "admin"],
    default: "doctor",
  },
  shift: {
    start: {
      type: String,
      default: null,
    },
    end: {
      type: String,
      default: null,
    },
  },
});

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Doctor", doctorSchema);
