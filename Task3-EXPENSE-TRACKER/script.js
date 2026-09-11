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


/* STATE */

let transactions = JSON.parse(
    localStorage.getItem("expenseFlowTransactions")
) || [];

let currentTypeFilter = "all";
let transactionToDelete = null;
let toastTimer;


/* INITIAL SETUP */

setCurrentDate();
setCurrentYear();
setDefaultDate();
renderTransactions();
updateSummary();
refreshIcons();


/* DATE */

function setCurrentDate() {
    const today = new Date();

    currentDate.textContent = today.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}


function setCurrentYear() {
    currentYear.textContent = new Date().getFullYear();
}


function setDefaultDate() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    transactionDate.value = `${year}-${month}-${day}`;
}


/* LOCAL STORAGE */

function saveTransactions() {
    localStorage.setItem(
        "expenseFlowTransactions",
        JSON.stringify(transactions)
    );
}


/* ADD TRANSACTION */

transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    clearErrors();

    const descriptionValue = description.value.trim();
    const amountValue = Number(amount.value);
    const dateValue = transactionDate.value;

    const isValid = validateTransaction(
        descriptionValue,
        amountValue,
        dateValue
    );

    if (!isValid) {
        return;
    }

    const newTransaction = {
        id: Date.now(),
        type: transactionType.value,
        description: descriptionValue,
        amount: amountValue,
        category: category.value,
        date: dateValue
    };

    transactions.unshift(newTransaction);

    saveTransactions();

    transactionForm.reset();

    transactionType.value = "expense";
    category.value = "Food";

    setDefaultDate();

    renderTransactions();
    updateSummary();
    refreshIcons();

    showToast("Transaction added successfully.");
});