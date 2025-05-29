# 🏥 Clinic-Oupharmacy-FE

A responsive and modern frontend application for managing clinic and pharmacy operations. Built with **React** and **Vite**, and integrated with a Django + PostgreSQL backend.

🌐 **Live Demo**: [clinic-oupharmacy.vercel.app](https://clinic-oupharmacy.vercel.app/)  

---

## 🚀 Features

- 🧑‍⚕️ **Patient & User Management**  
  View, create, update, and delete patient and user records.

- 📅 **Appointment Booking**  
  Real-time booking system with availability tracking.

- 🌐 **Multi-language Support**  
  Supports both English and Vietnamese languages for better accessibility and localization.

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

```
Clinic-Oupharmacy-FE/
  ├── src/
    ├── assets/ # Static assets (images, logos, etc.)
    ├── config/ # Configuration files (APIs, Firebase, Alerts, etc.)
    │ ├── APIs.js # All API endpoints
    │ ├── firebase.js # Firebase configuration
    │ └── ...
    ├── lib/ # Shared utilities and logic
    │ ├── assets/ # Additional shared assets
    │ ├── context/ # React Context providers
    │ ├── hooks/ # Custom React hooks
    │ ├── icon/ # Icon components or library
    │ ├── reducer/ # Redux reducers
    │ ├── redux/ # Redux store setup and slices
    │ ├── services/ # API service logic
    │ ├── utils/ # Utility functions/helpers
    │ ├── constants.js # Centralized app constants
    │ └── schema.js # Yup validation schemas
    ├── modules/ # High-level modules
    │ ├── common/ # Reusable module components
    │ └── pages/ # Page-level modules and layouts
    ├── pages/ # Main route components
    ├── App.jsx # Root React component
    ├── i18n.js # Internationalization (EN/VI language support)
  ├── public/
  ├── .env # Environment variables
  ├── vite.config.js
  ├── package.json
```

--- 

## 🔗 Other Resources

- 📄 **Notion Documentation**: [View on Notion](https://www.notion.so/shiray/OUPHARMACY-51a0d2fb8bce45c9b5b9860755c4928d)
  → For more details on setting up the technologies used in this project, please refer to the Notion documentation.

- 🔙 **Backend Repository**: [Clinic-Oupharmacy-BE](https://github.com/VoMinhHung-SR/Clinic-Oupharmacy-BE)
