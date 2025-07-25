# 🏥 Hospital Management System

A full-stack Hospital Management System with secure, role-based access for medical personnel. This application streamlines hospital operations by organizing patient data, prescriptions, drug inventory, and staff user roles.

---

## 🚀 Features

### 👥 User Roles
The system supports **five distinct user types**:
- **Admin**
- **Doctor**
- **Nurse**
- **Pharmacist**
- **Medical Laboratory Scientist**

Each role has specific access limitations based on their function in the hospital.

---

### 🖥️ Modules

#### 1. Dashboard
Displays real-time insights and statistics for the logged-in user:
- Total number of patients
- Number of admitted patients
- Number of critical patients
- Basic statistics and graphical summaries

#### 2. Patients
Manages all patient records, including:
- Name, age, gender, height
- Most recent visited office (Doctor, Nurse, Lab, etc.)
- Admitted status (Outpatient/Inpatient)
- Current health status

Patient records can be **viewed and edited** by authorized personnel.

#### 3. Prescriptions
- View and manage prescriptions associated with specific patients
- Only visible to users with medical or pharmaceutical roles

#### 4. Users
- Admin-only module to manage hospital staff
- Create, delete, and assign roles to users
- View all registered staff accounts and their permissions

#### 5. Drugs Database
- Stores comprehensive information on medications:
  - Drug name
  - Brand name
  - Dosage form (e.g., vials, tablets)
  - Quantity available

---

## 🔒 Role-Based Access

| Role                  | Dashboard | Patients | Prescriptions | Drugs DB | Users (Admin Panel) |
|-----------------------|-----------|----------|----------------|----------|----------------------|
| **Admin**             | ✅        | ✅       | ✅             | ✅       | ✅                   |
| **Doctor**            | ✅        | ✅       | ✅             | ✅       | ❌                   |
| **Nurse**             | ✅        | ✅       | ✅             | ✅       | ❌                   |
| **Pharmacist**        | ✅        | ✅       | ✅             | ✅       | ❌                   |
| **Med Lab Scientist** | ✅        | ❌       | ✅             | ✅       | ❌                   |
| **Basic User**        | ❌        | ❌       | ❌             | ❌       | ❌                   |

---

## 🔐 Authentication & Role Elevation

- New users can **sign up** from the login menu and are initially assigned a **basic user role**.
- Basic users cannot access or modify any data until their role is elevated.
- Users may request role elevation to become a **Doctor, Nurse, Pharmacist, Med Lab Scientist,** or **Admin**.
- Admins are responsible for reviewing and approving these requests in the **Users** section.

---

## 📦 Tech Stack

> _Replace with actual technologies used in your project._

- **Frontend**: React / Angular / Vue
- **Backend**: Node.js / NestJS / Django / Spring Boot
- **Database**: MongoDB / PostgreSQL / MySQL
- **Authentication**: JWT / OAuth2

---

## 📸 Screenshots

### 🏠 Dashboard (with stats and chart)
![Dashboard](https://i.ibb.co/VY7sck53/Screenshot-2025-07-25-105904.png)

---

### 🧑‍⚕️ Create Patient (create patient data)
![Patients](https://i.ibb.co/jv0WXCh7/Screenshot-2025-07-25-110039.png)

---

### 💊 Patients Module (view and manage patient data)
![Prescriptions](https://i.ibb.co/8g7mpmJx/Screenshot-2025-07-25-110055.png)

---

### 🧪 Prescription Database (medication records)
![Drugs Database](https://i.ibb.co/TM0GGxhK/Screenshot-2025-07-25-110142.png)

---

### 👥 Prescription Database (edit medication records)
![Users Panel](https://i.ibb.co/5XNY46hQ/Screenshot-2025-07-25-110157.png)

---

### 🔐 Login Page
![Login Page](https://i.ibb.co/sJ3kPj7m/Screenshot-2025-07-25-110222.png)


## 🛠️ Getting Started

To run this project locally:

```bash
# Clone the repository
git clone https://github.com/your-username/hospital-management-system.git

# Navigate into the project directory
cd hospital-management-system

# Install dependencies
npm install

# Start the development server
npm run dev
