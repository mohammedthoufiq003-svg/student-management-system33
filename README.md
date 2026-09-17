# 🎓 Student Management System (Full Stack)

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-6.1-green.svg)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.18-red.svg)](https://www.django-rest-framework.org/)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mohammedthoufiq003-svg/student-management-system33)

A full-stack Student Management System with **clean separation between Frontend and Backend**.

---

## 📁 Project Architecture

```
student-management-system33/
│
├── 📂 frontend/               # Standalone Frontend (Decoupled Client)
│   ├── index.html             # UI Dashboard (HTML5)
│   ├── open_frontend.bat      # 1-Click to open frontend
│   ├── css/
│   │   └── style.css          # Design system & responsive styles
│   └── js/
│       └── app.js             # REST API consumer & dynamic DOM
│
├── 📂 backend/                # Backend Server (Django + REST Framework)
│   ├── manage.py              # Django management script
│   ├── requirements.txt       # Dependencies (Django, DRF, CORS)
│   ├── run_backend.bat        # 1-Click to launch backend
│   ├── sms/                   # Project configuration & settings
│   │   ├── settings.py        # Configured with CORS & allowed hosts
│   │   └── urls.py            # API routing
│   └── students/              # Student app
│       ├── models.py          # Student model definition
│       ├── serializers.py     # DRF serializers
│       ├── views.py           # ModelViewSet CRUD endpoints
│       └── fixtures/          # Initial student data
│
├── run.bat                    # 1-Click launcher for both Frontend & Backend
├── push_to_github.bat         # 1-Click script to push code to GitHub
└── README.md
```

---

## 🚀 Quick Start (Running Both Together)

Double-click [`run.bat`](run.bat) in the project root:
- Starts the Django REST API on `http://127.0.0.1:8000/`
- Automatically opens the `frontend/index.html` in your default browser

---

## 🌐 Running Frontend Separately

You can open and host `frontend/` as a standalone web app on any web server, GitHub Pages, or Live Server:

1. Double-click [`frontend/open_frontend.bat`](frontend/open_frontend.bat) (or open `frontend/index.html` in any browser).
2. The frontend automatically communicates with the backend at `http://127.0.0.1:8000/api/students/` using CORS.

---

## ⚙️ Running Backend Separately

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations & load sample students:
   ```bash
   python manage.py migrate
   python manage.py loaddata initial_students
   ```

4. Start the server:
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```
   *(Or double-click `backend/run_backend.bat`)*

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students/` | List all students (supports `?search=`) |
| `POST` | `/api/students/` | Register a new student |
| `GET` | `/api/students/<id>/` | View student details |
| `PUT` | `/api/students/<id>/` | Update student details |
| `DELETE` | `/api/students/<id>/` | Remove student record |