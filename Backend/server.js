const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");
const authMiddleware = require("./middlewares/authMiddlewares");
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", authMiddleware, appointmentRoutes);


app.use(errorMiddleware);
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`⚙️  Server is running at port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
