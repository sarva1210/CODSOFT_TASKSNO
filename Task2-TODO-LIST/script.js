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