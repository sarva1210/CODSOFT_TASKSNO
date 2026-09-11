/* ELEMENTS */
const transactionForm = document.getElementById("transactionForm");
const transactionType = document.getElementById("transactionType");
const description = document.getElementById("description");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const transactionDate = document.getElementById("transactionDate");

const transactionList = document.getElementById("transactionList");
const emptyState = document.getElementById("emptyState");
const noResults = document.getElementById("noResults");

const balanceElement = document.getElementById("balance");
const totalIncomeElement = document.getElementById("totalIncome");
const totalExpenseElement = document.getElementById("totalExpense");
const transactionCount = document.getElementById("transactionCount");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const filterButtons = document.querySelectorAll(".filter-btn");

const clearCompletedBtn = document.getElementById("clearCompletedBtn");

const editModal = document.getElementById("editModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const cancelEdit = document.getElementById("cancelEdit");

const editTransactionForm = document.getElementById("editTransactionForm");
const editTransactionId = document.getElementById("editTransactionId");
const editDescription = document.getElementById("editDescription");
const editType = document.getElementById("editType");
const editAmount = document.getElementById("editAmount");
const editCategory = document.getElementById("editCategory");
const editDate = document.getElementById("editDate");

const confirmModal = document.getElementById("confirmModal");
const confirmOverlay = document.getElementById("confirmOverlay");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const currentDate = document.getElementById("currentDate");
const currentYear = document.getElementById("currentYear");