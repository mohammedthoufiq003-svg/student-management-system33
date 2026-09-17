# 🎓 CampusDesk - Student Management System

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-6.1-green.svg)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.18-red.svg)](https://www.django-rest-framework.org/)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mohammedthoufiq003-svg/student-management-system33)

A modern, responsive full-stack **Student Management System** built with **Django** and **Django REST Framework**. Includes an interactive dashboard UI, RESTful API, search & filter capabilities, and Django admin management.

---

## 🚀 Run Instantly in Browser (GitHub Codespaces)

You can run this project directly in your browser without installing anything on your computer:

1. Click the button below:
   
   [![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/mohammedthoufiq003-svg/student-management-system33)

2. Codespaces will automatically set up Python, install dependencies, prepare the database, and launch the server.
3. Your browser will automatically open the live application link!

---

## 💻 Run Locally on Your Computer

### Method 1: 1-Click Launcher (Windows)
Double-click [`run.bat`](run.bat) in the project folder. It will:
- Start the Django local server on port 8000.
- Automatically launch your web browser at `http://127.0.0.1:8000/`.

*(Or double-click `run_background.vbs` to run it silently in the background!)*

---

### Method 2: Command Line (Manual)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohammedthoufiq003-svg/student-management-system33.git
   cd student-management-system33
   ```

2. **Create and activate virtual environment:**
   ```bash
   python -m venv .venv
   # Windows:
   .\.venv\Scripts\activate
   # Linux/macOS:
   source .venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations & load sample data:**
   ```bash
   python manage.py migrate
   python manage.py loaddata initial_students
   ```

5. **Start the development server:**
   ```bash
   python manage.py runserver 127.0.0.1:8000
   ```

6. **Open in browser:**
   - **Web UI:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
   - **REST API:** [http://127.0.0.1:8000/api/students/](http://127.0.0.1:8000/api/students/)
   - **Admin Portal:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## 🌟 Key Features

- **Interactive Dashboard:** Add, edit, view, and delete students with instant validation.
- **Instant Search & Filter:** Search by name, student ID, department, or city.
- **RESTful API:** Full CRUD API built with Django REST Framework.
- **Responsive UI:** Clean, modern interface designed with Plus Jakarta Sans typography.
- **Database Seeding:** Comes with sample student records ready to test.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students/` | List all students |
| `POST` | `/api/students/` | Add a new student |
| `GET` | `/api/students/<id>/` | Retrieve student details |
| `PUT` | `/api/students/<id>/` | Update student details |
| `DELETE` | `/api/students/<id>/` | Delete student record |

---

## 🛠️ Tech Stack

- **Backend:** Python 3, Django 6, Django REST Framework
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Database:** SQLite