# Doctor-Patient Management System API

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

Example header:
