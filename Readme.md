# 🔐 Task Manager with Authentication & Protected Routes

## 📌 Project Description

This project is a Task Management Application with User Authentication.

Users must log in to access the Dashboard.  
Without a valid authentication token, the dashboard page cannot be accessed.

The application allows authenticated users to:
- ✅ Create tasks
- ✏️ Update tasks
- ❌ Delete tasks
- 📋 View all tasks

Unauthorized users are restricted from accessing protected routes.

---

## 🚀 Features

- User Registration
- User Login
- Token-based Authentication (JWT)
- Protected Dashboard Route
- Create Task
- Update Task
- Delete Task
- Logout Functionality
- Secure API endpoints

---

## 🔐 Authentication Flow

1. User registers or logs in.
2. Server generates a JWT token.
3. Token is stored on the client side (localStorage or cookies).
4. Token is sent in request headers for protected routes.
5. If token is missing or invalid → Access Denied.
6. If token is valid → Dashboard is accessible.

---

## 🛠 Technologies Used

- Frontend: React / HTML / CSS (if applicable)
- Backend: Node.js & Express
- Database: MongoDB
- Authentication: JWT (JSON Web Token)
- Password Hashing: bcrypt

---

## 📦 Installation

### 1️⃣ Clone the repository
git clone https://github.com/your-username/task-manager-auth.git

### 2️⃣ Navigate to project folder
cd task-manager-auth

### 3️⃣ Install dependencies
npm install

### 4️⃣ Create .env file
Add the following variables:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

### 5️⃣ Run the server
npm start

---

## 🔑 API Endpoints

### 🔐 Authentication Routes
- POST /api/register → Register user
- POST /api/login → Login user

### 📋 Task Routes (Protected)
- GET /api/tasks → Get all tasks
- POST /api/tasks → Create new task
- PUT /api/tasks/:id → Update task
- DELETE /api/tasks/:id → Delete task

All task routes require Authorization header:

Authorization: Bearer <your_token>

---

## 🚫 Protected Route Example

If user tries to access:

/dashboard

Without token → Redirect to Login Page  
With valid token → Access Granted

---

## 📂 Project Structure

project-root/
│── models/
│── routes/
│── middleware/
│── controllers/
│── config/
│── server.js
│── package.json
│── .env
│── README.md

---

## 🧪 Testing the Application

1. Register a new user.
2. Login and receive a token.
3. Use the token to access dashboard.
4. Create, update, and delete tasks.
5. Try accessing dashboard without token to verify protection.

---

## 🔒 Security Features

- Password hashing using bcrypt
- JWT token verification middleware
- Protected backend routes
- Environment variables for sensitive data

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

Your Name  
GitHub: https://github.com/your-username