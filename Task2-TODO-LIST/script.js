/* ELEMENTS */
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskCategory = document.getElementById("taskCategory");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const noResults = document.getElementById("noResults");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const filterButtons = document.querySelectorAll(".filter-btn");

const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const currentDate = document.getElementById("currentDate");
const currentYear = document.getElementById("currentYear");

const taskError = document.getElementById("taskError");

const editModal = document.getElementById("editModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const cancelEdit = document.getElementById("cancelEdit");

const editTaskForm = document.getElementById("editTaskForm");
const editTaskId = document.getElementById("editTaskId");
const editTaskInput = document.getElementById("editTaskInput");
const editTaskCategory = document.getElementById("editTaskCategory");
const editTaskPriority = document.getElementById("editTaskPriority");
const editTaskDate = document.getElementById("editTaskDate");
const editTaskError = document.getElementById("editTaskError");

const confirmModal = document.getElementById("confirmModal");
const confirmOverlay = document.getElementById("confirmOverlay");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* STATE */
let tasks = JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let currentFilter = "all";
let taskToDelete = null;


/* DATE */
function updateDate() {
    const today = new Date();

    const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    };

    currentDate.textContent = today.toLocaleDateString("en-US", options);

    currentYear.textContent = today.getFullYear();
}

updateDate();


/* SAVE */
function saveTasks() {
    localStorage.setItem("taskflowTasks", JSON.stringify(tasks));
}


/* ID */
function generateId() {
    return Date.now().toString();
}


/* ESCAPE HTML */
function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


/* FORMAT DATE */
function formatTaskDate(date) {
    if (!date) {
        return "";
    }

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}


/* ADD TASK */
taskForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) {
        taskError.textContent = "Please enter a task.";
        taskInput.focus();
        return;
    }

    taskError.textContent = "";

    const newTask = {
        id: generateId(),
        title: title,
        category: taskCategory.value,
        priority: taskPriority.value,
        dueDate: taskDate.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(newTask);

    saveTasks();

    taskForm.reset();

    taskPriority.value = "Medium";

    renderTasks();

    showToast("Task added successfully.");

    taskInput.focus();
});


/* RENDER TASKS */
function renderTasks() {
    taskList.innerHTML = "";

    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    let filteredTasks = tasks.filter(function (task) {

        const matchesSearch =
            task.title.toLowerCase().includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            task.category === selectedCategory;

        const matchesStatus =
            currentFilter === "all" ||
            (currentFilter === "pending" && !task.completed) ||
            (currentFilter === "completed" && task.completed);

        return matchesSearch && matchesCategory && matchesStatus;
    });


    if (tasks.length === 0) {
        emptyState.style.display = "block";
        noResults.style.display = "none";
    } else if (filteredTasks.length === 0) {
        emptyState.style.display = "none";
        noResults.style.display = "block";
    } else {
        emptyState.style.display = "none";
        noResults.style.display = "none";
    }


    filteredTasks.forEach(function (task) {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });


    updateStats();
}


/* CREATE TASK */
function createTaskElement(task) {
    const article = document.createElement("article");

    article.className = "task-item";

    if (task.completed) {
        article.classList.add("completed");
    }


    const priorityClass =
        task.priority.toLowerCase() === "low"
            ? "priority-low"
            : task.priority.toLowerCase() === "high"
                ? "priority-high"
                : "priority-medium";


    article.innerHTML = `
        <button
            class="task-check ${task.completed ? "completed" : ""}"
            data-action="complete"
            data-id="${task.id}"
            aria-label="${task.completed ? "Mark as pending" : "Mark as completed"}"
        >
            ${task.completed ? '<i data-lucide="check"></i>' : ""}
        </button>

        <div class="task-info">

            <h3 class="task-title">
                ${escapeHTML(task.title)}
            </h3>

            <div class="task-meta">

                <span class="task-badge">
                    ${escapeHTML(task.category)}
                </span>

                <span class="task-priority ${priorityClass}">
                    ${escapeHTML(task.priority)}
                </span>

                ${
                    task.dueDate
                        ? `
                            <span class="task-date">
                                <i data-lucide="calendar"></i>
                                ${formatTaskDate(task.dueDate)}
                            </span>
                        `
                        : ""
                }

            </div>

        </div>

        <div class="task-actions">

            <button
                class="task-action-btn"
                data-action="edit"
                data-id="${task.id}"
                aria-label="Edit task"
            >
                <i data-lucide="pencil"></i>
            </button>

            <button
                class="task-action-btn delete"
                data-action="delete"
                data-id="${task.id}"
                aria-label="Delete task"
            >
                <i data-lucide="trash-2"></i>
            </button>

        </div>
    `;


    return article;
}


/* TASK ACTIONS */
taskList.addEventListener("click", function (event) {

    const button = event.target.closest("[data-action]");

    if (!button) {
        return;
    }

    const action = button.dataset.action;
    const id = button.dataset.id;

    if (action === "complete") {
        toggleTask(id);
    }

    if (action === "edit") {
        openEditModal(id);
    }

    if (action === "delete") {
        openDeleteModal(id);
    }
});


/* COMPLETE */
function toggleTask(id) {

    const task = tasks.find(function (task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    task.completed = !task.completed;

    saveTasks();

    renderTasks();

    if (task.completed) {
        showToast("Task completed.");
    } else {
        showToast("Task marked as pending.");
    }
}


/* EDIT MODAL */
function openEditModal(id) {

    const task = tasks.find(function (task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    editTaskId.value = task.id;
    editTaskInput.value = task.title;
    editTaskCategory.value = task.category;
    editTaskPriority.value = task.priority;
    editTaskDate.value = task.dueDate || "";

    editTaskError.textContent = "";

    editModal.classList.add("active");
    editModal.setAttribute("aria-hidden", "false");

    setTimeout(function () {
        editTaskInput.focus();
    }, 100);
}


/* CLOSE EDIT */
function closeEditModal() {

    editModal.classList.remove("active");
    editModal.setAttribute("aria-hidden", "true");

    editTaskForm.reset();
    editTaskError.textContent = "";
}

modalClose.addEventListener("click", closeEditModal);

cancelEdit.addEventListener("click", closeEditModal);

modalOverlay.addEventListener("click", closeEditModal);


/* SAVE EDIT */
editTaskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const id = editTaskId.value;
    const title = editTaskInput.value.trim();

    if (!title) {
        editTaskError.textContent = "Please enter a task.";
        editTaskInput.focus();
        return;
    }

    editTaskError.textContent = "";

    const task = tasks.find(function (task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    task.title = title;
    task.category = editTaskCategory.value;
    task.priority = editTaskPriority.value;
    task.dueDate = editTaskDate.value;

    saveTasks();

    closeEditModal();

    renderTasks();

    showToast("Task updated successfully.");
});


/* DELETE MODAL */
function openDeleteModal(id) {

    const task = tasks.find(function (task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    taskToDelete = id;

    confirmModal.classList.add("active");
    confirmModal.setAttribute("aria-hidden", "false");
}


/* CLOSE DELETE */
function closeDeleteModal() {

    confirmModal.classList.remove("active");
    confirmModal.setAttribute("aria-hidden", "true");

    taskToDelete = null;
}

cancelDelete.addEventListener("click", closeDeleteModal);

confirmOverlay.addEventListener("click", closeDeleteModal);


/* CONFIRM DELETE */
confirmDelete.addEventListener("click", function () {

    if (!taskToDelete) {
        return;
    }

    tasks = tasks.filter(function (task) {
        return task.id !== taskToDelete;
    });

    saveTasks();

    closeDeleteModal();

    renderTasks();

    showToast("Task deleted.");
});


/* CLEAR COMPLETED */
clearCompletedBtn.addEventListener("click", function () {

    const completedCount = tasks.filter(function (task) {
        return task.completed;
    }).length;

    if (completedCount === 0) {
        showToast("No completed tasks to clear.");
        return;
    }

    tasks = tasks.filter(function (task) {
        return !task.completed;
    });

    saveTasks();

    renderTasks();

    showToast("Completed tasks cleared.");
});


/* SEARCH */
searchInput.addEventListener("input", function () {
    renderTasks();
});


/* CATEGORY FILTER */
categoryFilter.addEventListener("change", function () {
    renderTasks();
});


/* STATUS FILTER */
filterButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        filterButtons.forEach(function (btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        currentFilter = button.dataset.filter;

        renderTasks();
    });
});


/* STATS */
function updateStats() {

    const total = tasks.length;

    const completed = tasks.filter(function (task) {
        return task.completed;
    }).length;

    const pending = total - completed;

    totalTasks.textContent = total;
    pendingTasks.textContent = pending;
    completedTasks.textContent = completed;
}


/* TOAST */
let toastTimeout;

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(function () {
        toast.classList.remove("show");
    }, 2500);
}


/* KEYBOARD */
document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        if (editModal.classList.contains("active")) {
            closeEditModal();
        }

        if (confirmModal.classList.contains("active")) {
            closeDeleteModal();
        }
    }
});