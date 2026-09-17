// Configurable API URL: if served from Django (port 8000), use relative path.
// Otherwise (e.g. standalone file://, Live Server, GitHub Pages), connect to http://127.0.0.1:8000/api/students/
const API_URL = (window.location.protocol.startsWith("http") && window.location.port === "8000")
    ? "/api/students/"
    : "http://127.0.0.1:8000/api/students/";

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
        student_id: document.getElementById("student_id").value.trim(),
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
    formHint.textContent = "Fill every field. The data is saved in SQLite through a REST API.";
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
        showAlert("Cannot connect to backend server at http://127.0.0.1:8000. Please start the backend.", "error");
        throw new Error("Cannot reach the server. Make sure Django is running.");
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
            <td>${student.student_id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.phone}</td>
            <td>${student.department}</td>
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
    const url = query ? `${API_URL}?search=${encodeURIComponent(query)}` : API_URL;
    try {
        const students = await apiRequest(url);
        renderTable(students);
        renderStats(students);
    } catch (error) {
        renderTable([]);
        renderStats([]);
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
    formHint.textContent = `Editing ${student.student_id}. Save to send a PUT request.`;
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

loadStudents();
