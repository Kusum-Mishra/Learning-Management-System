# 🎓 Learning Management System (LMS)
### (The project is still under development)

![LMS Header](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Repo Size](https://img.shields.io/github/repo-size/Kusum-Mishra/Learning-Management-System)

A comprehensive, user-friendly **Learning Management System** built to streamline online education. This platform allows instructors to manage courses and students to browse courses, enroll and access learning materials.
---

## 🌟 Key Features

### 👨‍🎓 Student Features
- User registration and login
- Browse available courses
- Enroll in courses
- Watch course lectures and learning materials
- Secure authentication
  
### 👨‍🏫 Instructor Features
- Create and manage courses
- Upload lectures and course content
- Manage students and course data
- Update or delete courses.

---

## 🛠 Tech Stack

| Component     | Technology                                                         |
|---------------|--------------------------------------------------------------------|
| Frontend      | HTML5, CSS3, JavaScript (React.js)                                 |
| Styling       | Tailwind CSS                                                       |
| Backend       | Node.js + Express                                                  |
| Database      | MongoDB + Mongoose                                                 |
| Other tools   | JWT (JSON Web Tokens) & cloud storage for media (using cloudinary) |


---

## Prerequisites

Ensure you have installed:
- [Node.js](https://nodejs.org/) (v14 or later)
- npm or yarn
- [MongoDB](https://www.mongodb.com/try/download/community) (local or cloud via MongoDB Atlas)

---

## Project Structure

```
Learning-Management-System
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── features
│   │   └── App.jsx
│   │
│   └── package.json
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── utils
│   └── package.json
│
└── README.md
```

---

## Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/Kusum-Mishra/Learning-Management-System.git
cd Learning-Management-System
```

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```

Create a `.env` file inside `backend/` with:
```
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

(Optional) Create a `.env` file inside `frontend/` with:
```
REACT_APP_API_URL=http://localhost:5173
```

Run the frontend:
```bash
npm run dev
```

Access the app at `http://localhost:3000`.

---

## Contact

**Kusum Mishra**  
- GitHub: [Kusum-Mishra](https://github.com/Kusum-Mishra)  
- Email: kusummishra5678@gmail.com  
