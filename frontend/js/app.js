// Configurable API & Cloud Demo Mode Handler
const isGitHubPages = window.location.hostname.includes("github.io");
const isFileOrigin = window.location.protocol === "file:";
const isDjangoOrigin = window.location.protocol.startsWith("http") && window.location.port === "8000";

const API_URL = isDjangoOrigin
    ? "/api/students/"
    : "http://127.0.0.1:8000/api/students/";

// Use browser LocalStorage fallback for GitHub Pages (avoids HTTPS mixed-content blocks)
const STORAGE_KEY = "sms_students_cloud_v1";

const DEFAULT_STUDENTS = [
    {
        id: 1,
        student_id: "STU101",
        name: "Mohammed Thoufiq",
        email: "thoufiq@example.com",
        phone: "9876543210",
        department: "CSE",
        year: "3",
        city: "Coimbatore",
        created_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
        id: 2,
        student_id: "STU102",
        name: "Aravind Kumar",
        email: "aravind@example.com",
        phone: "9845123456",
        department: "AIDS",
        year: "2",
        city: "Chennai",
        created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 3,
        student_id: "STU103",
        name: "Priya Dharshini",
        email: "priya@example.com",
        phone: "9786123450",
        department: "ECE",
        year: "4",
        city: "Madurai",
        created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
        id: 4,
        student_id: "STU104",
        name: "Karthik Raja",
        email: "karthik@example.com",
        phone: "9654123890",
        department: "IT",
        year: "1",
        city: "Trichy",
        created_at: new Date(Date.now() - 259200000).toISOString()
    }
];

let useLocalStorage = isGitHubPages || isFileOrigin;

// LocalStorage helpers
function getLocalStudents() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STUDENTS));
            return [...DEFAULT_STUDENTS];
        }
        return JSON.parse(data);
    } catch (e) {
        return [...DEFAULT_STUDENTS];
    }
}

function saveLocalStudents(list) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
        console.error("Could not write to localStorage", e);
    }
}

const form = document.getElementById("studentForm");
const tableBody = document.getElementById("studentTable");
const emptyState = document.getElementById("emptyState");
const alertBox = document.getElementById("alertBox");
const searchInput = document.getElementById("searchInput");
const resetBtn = document.getElementById("resetBtn");
const refreshBtn = document.getElementById("refreshBtn");
const submitBtn = document.getElementById("submitBtn");
const formTitle = document.getElementById("formTitle");
const formHint = document.getElementById("formHint");
const resultCount = document.getElementById("resultCount");

function getCookie(name) {
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
        const [key, value] = cookie.trim().split("=");
        if (key === name) {
            return decodeURIComponent(value);
        }
    }
    return "";
}

function csrfToken() {
    const hidden = document.querySelector("[name=csrfmiddlewaretoken]");
    return hidden ? hidden.value : getCookie("csrftoken");
}

function showAlert(message, type) {
    alertBox.hidden = false;
    alertBox.className = `alert ${type}`;
    alertBox.textContent = message;
    window.setTimeout(() => {
        alertBox.hidden = true;
    }, 4000);
}

function clearFieldErrors() {
    document.querySelectorAll(".field-error").forEach((el) => {
        el.textContent = "";
    });
}

function setFieldError(field, message) {
    const target = document.querySelector(`.field-error[data-for="${field}"]`);
    if (target) {
        target.textContent = Array.isArray(message) ? message.join(" ") : message;
    }
}

function yearLabel(year) {
    const labels = {
        "1": "1st",
        "2": "2nd",
        "3": "3rd",
        "4": "4th",
    };
    return labels[year] || year;
}

function formatDate(iso) {
    if (!iso) return "—";
    const date = new Date(iso);
    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function getFormData() {
    return {
        student_id: document.getElementById("student_id").value.trim().toUpperCase(),
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        department: document.getElementById("department").value,
        year: document.getElementById("year").value,
        city: document.getElementById("city").value.trim(),
    };
}

function validateClient(data) {
    const errors = {};
    if (!/^[A-Za-z0-9-]{3,20}$/.test(data.student_id)) {
        errors.student_id = "Use 3-20 letters, numbers or hyphen. No spaces.";
    }
    if (data.name.length < 3 || !/^[A-Za-z ]+$/.test(data.name)) {
        errors.name = "Enter a valid full name (letters only).";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = "Enter a valid email address.";
    }
    if (!/^[6-9]\d{9}$/.test(data.phone)) {
        errors.phone = "Enter a valid 10-digit mobile number.";
    }
    if (!data.department) {
        errors.department = "Please select a department.";
    }
    if (!data.year) {
        errors.year = "Please select a year of study.";
    }
    if (data.city.length < 2) {
        errors.city = "City should be at least 2 characters long.";
    }
    return errors;
}

function resetForm() {
    form.reset();
    document.getElementById("recordId").value = "";
    submitBtn.textContent = "Save Student";
    formTitle.textContent = "Add New Student";
    formHint.textContent = useLocalStorage
        ? "Fill every field. Data is saved interactively in browser storage."
        : "Fill every field. The data is saved in SQLite through a REST API.";
    clearFieldErrors();
}

async function apiRequest(url, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };
    const token = csrfToken();
    if (token) {
        headers["X-CSRFToken"] = token;
    }

    let response;
    try {
        response = await fetch(url, { ...options, headers });
    } catch (error) {
        // Switch to local storage fallback gracefully
        useLocalStorage = true;
        throw new Error("Cannot reach the server.");
    }

    let payload = null;
    const text = await response.text();
    if (text) {
        try {
            payload = JSON.parse(text);
        } catch (error) {
            payload = { detail: text };
        }
    }

    if (!response.ok) {
        const error = new Error("Request failed");
        error.status = response.status;
        error.payload = payload;
        throw error;
    }
    return payload;
}

function renderStats(students) {
    document.getElementById("statTotal").textContent = students.length;
    const departments = new Set(students.map((item) => item.department));
    document.getElementById("statDept").textContent = departments.size;
    document.getElementById("statCity").textContent = students[0] ? students[0].city : "—";
}

function renderTable(students) {
    tableBody.innerHTML = "";
    resultCount.textContent = `${students.length} record${students.length === 1 ? "" : "s"}`;
    emptyState.classList.toggle("hidden", students.length > 0);

    students.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td><strong>${student.student_id}</strong></td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td><span class="dept-badge">${student.department}</span></td>
            <td>${yearLabel(student.year)}</td>
            <td>${student.city}</td>
            <td>${formatDate(student.created_at)}</td>
            <td>
                <div class="row-actions">
                    <button class="btn edit" data-edit="${student.id}" type="button">Edit</button>
                    <button class="btn delete" data-delete="${student.id}" type="button">Delete</button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

async function loadStudents(query = "") {
    const q = query.trim().toLowerCase();

    if (useLocalStorage) {
        let students = getLocalStudents();
        if (q) {
            students = students.filter((s) =>
                s.name.toLowerCase().includes(q) ||
                s.student_id.toLowerCase().includes(q) ||
                s.email.toLowerCase().includes(q) ||
                s.city.toLowerCase().includes(q) ||
                s.department.toLowerCase().includes(q)
            );
        }
        renderTable(students);
        renderStats(students);
        return;
    }

    const url = q ? `${API_URL}?search=${encodeURIComponent(q)}` : API_URL;
    try {
        const students = await apiRequest(url);
        renderTable(students);
        renderStats(students);
    } catch (error) {
        useLocalStorage = true;
        loadStudents(query);
    }
}

function fillForm(student) {
    document.getElementById("recordId").value = student.id;
    document.getElementById("student_id").value = student.student_id;
    document.getElementById("name").value = student.name;
    document.getElementById("email").value = student.email;
    document.getElementById("phone").value = student.phone;
    document.getElementById("department").value = student.department;
    document.getElementById("year").value = student.year;
    document.getElementById("city").value = student.city;
    submitBtn.textContent = "Update Student";
    formTitle.textContent = "Update Student";
    formHint.textContent = `Editing ${student.student_id}. Save to apply changes.`;
    window.scrollTo({ top: 0, behavior: "smooth" });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFieldErrors();

    const data = getFormData();
    const clientErrors = validateClient(data);
    if (Object.keys(clientErrors).length) {
        Object.entries(clientErrors).forEach(([field, message]) => setFieldError(field, message));
        showAlert("Please correct the highlighted fields.", "error");
        return;
    }

    const recordId = document.getElementById("recordId").value;
    const isUpdate = Boolean(recordId);

    if (useLocalStorage) {
        const students = getLocalStudents();
        const existingId = students.find((s) => s.student_id.toUpperCase() === data.student_id.toUpperCase() && (!isUpdate || String(s.id) !== String(recordId)));
        if (existingId) {
            setFieldError("student_id", "A student with this ID already exists.");
            showAlert("Student ID already exists.", "error");
            return;
        }

        const existingEmail = students.find((s) => s.email.toLowerCase() === data.email.toLowerCase() && (!isUpdate || String(s.id) !== String(recordId)));
        if (existingEmail) {
            setFieldError("email", "A student with this Email already exists.");
            showAlert("Email already registered.", "error");
            return;
        }

        if (isUpdate) {
            const idx = students.findIndex((s) => String(s.id) === String(recordId));
            if (idx !== -1) {
                students[idx] = { ...students[idx], ...data };
                saveLocalStudents(students);
                showAlert("Student updated successfully.", "success");
            }
        } else {
            const nextId = students.length ? Math.max(...students.map((s) => Number(s.id) || 0)) + 1 : 1;
            const newStudent = {
                id: nextId,
                ...data,
                created_at: new Date().toISOString()
            };
            students.unshift(newStudent);
            saveLocalStudents(students);
            showAlert("Student created successfully.", "success");
        }

        resetForm();
        loadStudents(searchInput.value.trim());
        return;
    }

    const url = isUpdate ? `${API_URL}${recordId}/` : API_URL;
    const method = isUpdate ? "PUT" : "POST";

    try {
        await apiRequest(url, {
            method,
            body: JSON.stringify(data),
        });
        showAlert(isUpdate ? "Student updated successfully." : "Student created successfully.", "success");
        resetForm();
        await loadStudents(searchInput.value.trim());
    } catch (error) {
        const payload = error.payload || {};
        if (typeof payload === "object") {
            Object.entries(payload).forEach(([field, message]) => setFieldError(field, message));
            const detail = payload.detail || "Could not save student. Check unique ID/email and validation.";
            showAlert(typeof detail === "string" ? detail : "Could not save student.", "error");
        } else {
            showAlert("Could not save student.", "error");
        }
    }
});

tableBody.addEventListener("click", async (event) => {
    const editId = event.target.getAttribute("data-edit");
    const deleteId = event.target.getAttribute("data-delete");

    if (editId) {
        if (useLocalStorage) {
            const student = getLocalStudents().find((s) => String(s.id) === String(editId));
            if (student) fillForm(student);
            return;
        }

        try {
            const student = await apiRequest(`${API_URL}${editId}/`);
            fillForm(student);
        } catch (error) {
            showAlert("Could not load this student.", "error");
        }
    }

    if (deleteId) {
        const confirmed = window.confirm("Delete this student record permanently?");
        if (!confirmed) {
            return;
        }

        if (useLocalStorage) {
            const updated = getLocalStudents().filter((s) => String(s.id) !== String(deleteId));
            saveLocalStudents(updated);
            showAlert("Student deleted successfully.", "success");
            if (document.getElementById("recordId").value === deleteId) {
                resetForm();
            }
            loadStudents(searchInput.value.trim());
            return;
        }

        try {
            await apiRequest(`${API_URL}${deleteId}/`, { method: "DELETE" });
            showAlert("Student deleted successfully.", "success");
            if (document.getElementById("recordId").value === deleteId) {
                resetForm();
            }
            await loadStudents(searchInput.value.trim());
        } catch (error) {
            showAlert("Could not delete this student.", "error");
        }
    }
});

let searchTimer = null;
searchInput.addEventListener("input", () => {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
        loadStudents(searchInput.value.trim());
    }, 250);
});

resetBtn.addEventListener("click", resetForm);
refreshBtn.addEventListener("click", () => loadStudents(searchInput.value.trim()));

// Initialize form hint and data
resetForm();
loadStudents();
