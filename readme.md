# Doctor-Patient Management System API BACKEND

This API manages the interactions between doctors, patients, and appointments. It includes routes for user registration, authentication, doctor status management, and appointment scheduling.

## Table of Contents
- [API Routes](#api-routes)
  - [Doctor Routes](#doctor-routes)
  - [Patient Routes](#patient-routes)
  - [Appointment Routes](#appointment-routes)

## API Routes

### Doctor Routes
1. **POST** `/api/doctors/register`
   - **Description**: Register a new doctor.
   - **Request Body**: 
     ```json
     {
       "name": "Doctor Name",
       "email": "doctor@example.com",
       "password": "password123",
       "specialization": "Cardiology"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Doctor registered successfully."
     }
     ```

2. **POST** `/api/doctors/login`
   - **Description**: Login for a doctor.
   - **Request Body**: 
     ```json
     {
       "email": "doctor@example.com",
       "password": "password123"
     }
     ```
   - **Response**: 
     ```json
     {
       "token": "jwt_token_here"
     }
     ```

3. **POST** `/api/doctors/update/:doctorId`
   - **Description**: Update doctor profile.
   - **Authentication**: Requires a valid JWT token.
   - **Request Body**: 
     ```json
     {
       "name": "Updated Name",
       "specialization": "Updated Specialization"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Doctor profile updated."
     }
     ```

4. **PATCH** `/api/doctors/:doctorId/available`
   - **Description**: Set doctor status as available.
   - **Authentication**: Requires a valid JWT token.
   - **Response**: 
     ```json
     {
       "message": "Doctor is now available."
     }
     ```

5. **PATCH** `/api/doctors/:doctorId/busy`
   - **Description**: Set doctor status as busy.
   - **Authentication**: Requires a valid JWT token.
   - **Response**: 
     ```json
     {
       "message": "Doctor is now busy."
     }
     ```

6. **PATCH** `/api/doctors/:doctorId/off-duty`
   - **Description**: Set doctor status as off-duty.
   - **Authentication**: Requires a valid JWT token.
   - **Response**: 
     ```json
     {
       "message": "Doctor is now off-duty."
     }
     ```

7. **PATCH** `/api/doctors/:doctorId/appointment/:appointmentId/accept`
   - **Description**: Accept an appointment.
   - **Authentication**: Requires a valid JWT token.
   - **Response**: 
     ```json
     {
       "message": "Appointment accepted."
     }
     ```

8. **PATCH** `/api/doctors/:doctorId/appointment/:appointmentId/reject`
   - **Description**: Reject an appointment.
   - **Authentication**: Requires a valid JWT token.
   - **Response**: 
     ```json
     {
       "message": "Appointment rejected."
     }
     ```

### Patient Routes
1. **POST** `/api/patients/register`
   - **Description**: Register a new patient.
   - **Request Body**: 
     ```json
     {
       "name": "Patient Name",
       "email": "patient@example.com",
       "password": "password123"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Patient registered successfully."
     }
     ```

2. **POST** `/api/patients/login`
   - **Description**: Login for a patient.
   - **Request Body**: 
     ```json
     {
       "email": "patient@example.com",
       "password": "password123"
     }
     ```
   - **Response**: 
     ```json
     {
       "token": "jwt_token_here"
     }
     ```

### Appointment Routes
1. **POST** `/api/appointments/appointment`
   - **Description**: Create an appointment.
   - **Request Body**: 
     ```json
     {
       "patientId": "patient_id_here",
       "doctorId": "doctor_id_here",
       "appointmentDate": "2025-01-20T10:00:00Z",
       "reason": "Checkup"
     }
     ```
   - **Response**: 
     ```json
     {
       "message": "Appointment created successfully."
     }
     ```

2. **GET** `/api/appointments/appointments`
   - **Description**: Get all appointments.
   - **Response**: 
     ```json
     [
       {
         "appointmentId": "appointment_id_here",
         "patientId": "patient_id_here",
         "doctorId": "doctor_id_here",
         "appointmentDate": "2025-01-20T10:00:00Z",
         "status": "pending"
       },
       ...
     ]
     ```

3. **DELETE** `/api/appointments/appointment/:id`
   - **Description**: Delete an appointment.
   - **Response**: 
     ```json
     {
       "message": "Appointment deleted successfully."
     }
     ```

## Authentication

Certain routes (doctor profile updates, setting availability, accepting/rejecting appointments) require authentication. Use the **JWT token** provided on successful login for these requests. Include the token in the `Authorization` header as `Bearer <token>`.

# Doctor Dashboard Application System FRONTEND

The **Doctor Dashboard Application** is a web-based interface designed for doctors to manage their profiles, appointments, and availability seamlessly. The application provides functionality to handle appointment scheduling, status updates, and profile modifications.

---

## Features

### 1. **Authentication**
- **Role-Based Access**: Only authenticated users with the role of `Doctor` can access the dashboard.

### 2. **Appointment Management**
- **View All Appointments**: Doctors can view all scheduled appointments.
- **View Personal Appointments**: Doctors can filter to see appointments assigned to them specifically.
- **Update Appointment Status**: Doctors can change the status of an appointment to:
  - `Scheduled`
  - `Cancelled`

### 3. **Profile Management**
- **Editable Fields**:
  - Name
  - Email
  - Specialization
  - Experience
  - Phone Number
  - Shift Timings (Start and End)
- **Save Changes**: Update profile information and save it directly.

### 4. **Availability Management**
- Doctors can toggle their availability status between:
  - `Available`
  - `Busy`
  - `Off Duty`

### 5. **Logout Functionality**
- Logout securely from the dashboard.

---

## Tech Stack

### Frontend
- **React.js**
- **Tailwind CSS**

### Backend Integration
- API services for profile, availability, and appointment management are accessed using Axios.

---

## Folder Structure

```
src/
|-- components/
|   |-- DoctorDashboard.jsx  // Main dashboard component
|
|-- context/
|   |-- AuthContext.js  // Authentication context for role-based access
|
|-- utils/
|   |-- apiService.js  // API service for managing HTTP requests
|
|-- App.js
|-- index.js
```

---

## API Integration

### 1. **Doctor Profile Management**
- **Update Profile**: `POST /doctors/update/:doctorId`
- **Get Profile**: `GET /doctors/profile/:doctorId`

### 2. **Appointment Management**
- **Get All Appointments**: `GET /appointments/all`
- **Accept Appointment**: `PATCH /doctors/doctor/:doctorId/appointment/:appointmentId/accept`
- **Reject Appointment**: `PATCH /doctors/doctor/:doctorId/appointment/:appointmentId/reject`

### 3. **Availability Management**
- **Set Available**: `PATCH /doctors/doctor/:doctorId/available`
- **Set Busy**: `PATCH /doctors/doctor/:doctorId/busy`
- **Set Off Duty**: `PATCH /doctors/doctor/:doctorId/off-duty`

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/doctor-dashboard.git
   ```
2. Navigate to the project directory:
   ```bash
   cd doctor-dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the application:
   ```bash
   npm start
   ```
5. Open the application in your browser at:
   ```
   http://localhost:3000
   ```

---

## Usage

### Authentication
- Log in with your credentials to access the dashboard.

### Dashboard Tabs
1. **All Appointments**: View all scheduled appointments.
2. **Your Appointments**: View appointments specifically assigned to you.
3. **Update Profile**: Edit and save your profile details.

### Updating Appointment Status
- Use the dropdown menu in the appointment card to change its status.

### Availability Management
- Select your current status (Available, Busy, Off Duty) from the dropdown in the header.

---

## Future Enhancements
- Add notifications for new appointments.
- Integrate chat functionality for doctor-patient communication.
- Implement a calendar view for appointments.

---

## Contact
For any inquiries or issues, please reach out to [swrjnnd@gmail.com].