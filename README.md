# 🏥 Clinic-Oupharmacy-FE

A responsive and modern frontend application for managing clinic and pharmacy operations. Built with **React** and **Vite**, and integrated with a Django + PostgreSQL backend.

🌐 **Live Demo**: [clinic-oupharmacy.vercel.app](https://clinic-oupharmacy.vercel.app/)  

---

## 🚀 Features

- 🧑‍⚕️ **Patient & User Management**  
  View, create, update, and delete patient and user records.

- 📅 **Appointment Booking**  
  Real-time booking system with availability tracking.

- 💊 **Medicine Inventory**  
  Track stock, usage, and manage medicine units.

- 🔐 **Authentication**  
  JWT-based login system with role-based routing.

- 📊 **Dashboard Interface**  
  Clean UI dashboard with user metrics, graphs, and shortcuts.

---

## ⚙️ Tech Stack

| Category         | Technology                        |
|------------------|------------------------------------|
| Frontend         | React + Vite                      |
| UI Framework     | Material UI + Tailwind CSS        |
| State Management | React Context / useReducer        |
| Auth             | JWT via Axios + LocalStorage      |
| Routing          | React Router v6                   |
| Backend API      | Django REST Framework (DRF)       |
| Hosting          | Vercel (Frontend), Render (Backend) |

---

## 📁 Project Structure

```bash

Clinic-Oupharmacy-FE/
├── src/
│ ├── assets/ # Images & static assets
│ ├── components/ # Reusable UI components
│ ├── contexts/ # Global state providers
│ ├── pages/ # Route-level pages (Dashboard, Login, etc.)
│ ├── services/ # API handlers using Axios
│ ├── utils/ # Utility functions
│ └── App.jsx # Main app entry point
├── public/
├── .env # Environment variables
├── vite.config.js
├── package.json

---

## 🔗 Other Resources

- 📄 **Notion Documentation**: [View on Notion](https://www.notion.so/shiray/OUPHARMACY-51a0d2fb8bce45c9b5b9860755c4928d)
  → For more details on setting up the technologies used in this project, please refer to the Notion documentation.

- 🔙 **Backend Repository**: [Clinic-Oupharmacy-BE](https://github.com/VoMinhHung-SR/Clinic-Oupharmacy-BE)
