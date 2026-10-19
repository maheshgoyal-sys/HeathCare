# Healthcare Backend

Node.js REST API for patient and doctor profiles, JWT authentication, and patient-doctor assignments. It uses Express, Sequelize, and PostgreSQL.

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [User roles](#user-roles)
- [API reference](#api-reference)
- [Testing with Postman](#testing-with-postman)
- [Tests](#automated-tests)
- [Project layout](#project-layout)

## Features

- Register and log in with bcrypt-hashed passwords and JWTs.
- Create patient and doctor profiles when their corresponding account is registered.
- Let patients view/update their own profile and see assigned doctors.
- Let doctors view/update their own profile and see assigned patients.
- Let authorized staff search and manage all patient and doctor records, and assign or remove doctors.
- Validate request bodies and route IDs; return JSON errors for invalid requests and unauthorized access.
- Store application records in PostgreSQL through Sequelize models.

## Requirements

- Node.js 18 or newer
- PostgreSQL 13 or newer
- A PostgreSQL database and a database user allowed to create/alter tables

## Setup

1. Install dependencies:

	 ```sh
	 npm install
	 ```

2. Create a PostgreSQL database. Copy `.env.example` to `.env` and set the database connection values, a long random `JWT_SECRET`, and a private `STAFF_REGISTRATION_CODE`.

3. Start the API:

	 ```sh
	 npm start
	 ```

	 For development with automatic restarts:

	 ```sh
	 npm run dev
	 ```

The API defaults to `http://localhost:5000`; set `PORT` to use another port. `GET /health` checks whether the server is responding.

On startup, Sequelize creates missing tables and the schema migration adds the role and patient-account columns to existing tables. Existing data is not dropped. Older users and profiles are not automatically matched to each other; review and associate legacy records before relying on role-specific profile endpoints.

Never commit `.env`, publish `JWT_SECRET`, or send `STAFF_REGISTRATION_CODE` to an untrusted client. The example values in `.env.example` are placeholders, not working credentials.

## User roles

| Role | Signup requirements | Access |
| --- | --- | --- |
| `patient` | `name`, `email`, `password`, `age`, `gender`; optional `disease` | Own patient profile and assigned doctors |
| `doctor` | `name`, `email`, `password`, `specialization`; optional `phone` | Own doctor profile and assigned patients |
| `other` | `name`, `email`, `password`, and the configured `staffCode` | All patient and doctor records; manage records and assignments |

The `other` role is privileged staff access. The server accepts it only when `staffCode` matches `STAFF_REGISTRATION_CODE`. A shared code is an invitation gate, not proof of a person's identity; only give it to approved staff. For a production system, use an administrator-managed staff provisioning workflow.

Patient and doctor accounts cannot browse other users' records or create assignments. Staff creates assignments between existing patient and doctor records. Patient/doctor registration automatically creates a profile linked to the account.

## API reference

Send JSON with `Content-Type: application/json`. After login, use the returned token as `Authorization: Bearer <token>` for protected requests. Replace `:id`, `:patient_id`, and `:mapping_id` with IDs returned by the API.

### Health and authentication

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/health` | Public | Server health |
| POST | `/api/auth/register` | Public | Register a patient, doctor, or staff account |
| POST | `/api/auth/login` | Public | Verify credentials and return JWT plus user role |

Patient registration example:

```json
{
	"name": "Sam Patient",
	"email": "patient@example.com",
	"password": "change-this-password",
	"role": "patient",
	"age": 35,
	"gender": "other",
	"disease": "Example condition"
}
```

Doctor registration example:

```json
{
	"name": "Alex Doctor",
	"email": "doctor@example.com",
	"password": "change-this-password",
	"role": "doctor",
	"specialization": "Cardiology",
	"phone": "1234567890"
}
```

Staff registration example. Replace the placeholder with the private value configured on the server; do not commit or publish it.

```json
{
	"name": "Staff Member",
	"email": "staff@example.com",
	"password": "change-this-password",
	"role": "other",
	"staffCode": "value-from-server-configuration"
}
```

### Patient endpoints

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/patients/me` | Patient | View own patient profile |
| PUT | `/api/patients/me` | Patient | Update own profile; send at least one supported field |
| GET | `/api/doctors/assigned-to-me` | Patient | View assigned doctors |
| POST | `/api/patients` | Staff (`other`) | Create a patient record |
| GET | `/api/patients` | Staff (`other`) | List all patient records |
| GET | `/api/patients/:id` | Staff (`other`) | View a patient record |
| PUT | `/api/patients/:id` | Staff (`other`) | Update a patient record |
| DELETE | `/api/patients/:id` | Staff (`other`) | Delete a patient record |

Patient fields: `name`, `age` (0-150), `gender` (`male`, `female`, or `other`), and optional `disease`.

### Doctor endpoints

| Method | Endpoint | Role | Purpose |
| --- | --- | --- | --- |
| GET | `/api/doctors/me` | Doctor | View own doctor profile |
| PUT | `/api/doctors/me` | Doctor | Update own profile; send at least one supported field |
| GET | `/api/patients/assigned-to-me` | Doctor | View patients assigned to this doctor |
| POST | `/api/doctors` | Staff (`other`) | Create a doctor record |
| GET | `/api/doctors` | Staff (`other`) | List all doctor records |
| GET | `/api/doctors/:id` | Staff (`other`) | View a doctor record |
| PUT | `/api/doctors/:id` | Staff (`other`) | Update a doctor record |
| DELETE | `/api/doctors/:id` | Staff (`other`) | Delete a doctor record |

Doctor fields: `name`, `specialization`, valid `email`, and optional `phone` (7-15 digits, spaces, `+`, or `-`).

### Patient-doctor mappings

All mapping endpoints are staff-only.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/mappings` | Assign a doctor to a patient |
| GET | `/api/mappings` | List all assignments |
| GET | `/api/mappings/:patient_id` | List doctors assigned to a patient |
| DELETE | `/api/mappings/:mapping_id` | Remove an assignment |

Create mapping request:

```json
{
	"patientId": 1,
	"doctorId": 1
}
```

Use real IDs from patient/doctor records; `1` above is only an example. Duplicate assignments return `409`.

### Common responses

- `400`: invalid JSON, invalid field, or invalid ID
- `401`: missing, invalid, or expired JWT
- `403`: authenticated account does not have the required role, or staff invitation code is invalid
- `404`: record or route not found
- `409`: email or assignment already exists

There is no logout endpoint. JWTs are stateless, so a client logs out by removing its stored token. This does not revoke a token that has already been copied; it remains valid until expiry.

## Testing with Postman

1. Call `POST /api/auth/register` for a patient, including `age` and `gender`; log in via `POST /api/auth/login` and save `data.token` in a Postman variable such as `patientToken`.
2. Use that token to call `GET /api/patients/me` and `GET /api/doctors/assigned-to-me`. Confirm a patient token gets `403` from staff-only `GET /api/patients`.
3. Register and log in a doctor; save `data.token` as `doctorToken`. Check `GET /api/doctors/me` and `GET /api/patients/assigned-to-me`.
4. Register and log in staff with the private staff code; save `data.token` as `staffToken`.
5. With the staff token, list patient/doctor records, create a mapping using their returned IDs, and check both patient and doctor assigned-record endpoints.
6. Try a patient-only or doctor-only route with the wrong role and confirm it returns `403`. Remove test records afterward if they were created through staff APIs.

For protected requests, set the Postman Authorization type to **Bearer Token** and select the token belonging to the role being tested. Do not put the staff code in a shared collection.

## Automated tests

Run the PostgreSQL-backed integration suite:

```sh
npm test
```

PostgreSQL must be running and configured in `.env`. Tests exercise patient, doctor, and staff registration/login, profile access, role restrictions, staff listing, assignment, and assigned details. They use uniquely named accounts and remove their test data afterward; they do not drop database tables.

## Project layout

```text
src/
	config/       PostgreSQL connection and schema migration
	controllers/  Authentication and resource handlers
	middleware/   JWT authentication, role authorization, errors
	models/       Sequelize user, patient, doctor, and mapping models
	routes/       Express API routes
	validators/   Request validation rules
test/           PostgreSQL API integration tests
```
