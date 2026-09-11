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


/* VALIDATION */

function validateTransaction(
    descriptionValue,
    amountValue,
    dateValue
) {
    let isValid = true;

    if (!descriptionValue) {
        showError(
            "descriptionError",
            "Please enter a description."
        );

        isValid = false;
    }

    if (!amountValue || amountValue <= 0) {
        showError(
            "amountError",
            "Please enter a valid amount."
        );

        isValid = false;
    }

    if (!dateValue) {
        showError(
            "dateError",
            "Please select a date."
        );

        isValid = false;
    }

    return isValid;
}


function showError(id, message) {
    const errorElement = document.getElementById(id);

    if (errorElement) {
        errorElement.textContent = message;
    }
}


function clearErrors() {
    const errors = document.querySelectorAll(".error-message");

    errors.forEach(error => {
        error.textContent = "";
    });
}


/* RENDER TRANSACTIONS */

function renderTransactions() {
    transactionList.innerHTML = "";

    const filteredTransactions = getFilteredTransactions();

    transactionCount.textContent = filteredTransactions.length;

    /* No transactions at all */

    if (transactions.length === 0) {
        emptyState.style.display = "block";
        noResults.style.display = "none";

        refreshIcons();
        return;
    }

    emptyState.style.display = "none";

    /* Transactions exist but filters return nothing */

    if (filteredTransactions.length === 0) {
        noResults.style.display = "block";

        refreshIcons();
        return;
    }

    noResults.style.display = "none";

    filteredTransactions.forEach(transaction => {
        const transactionElement =
            createTransactionElement(transaction);

        transactionList.appendChild(transactionElement);
    });

    refreshIcons();
}


/* CREATE TRANSACTION */

function createTransactionElement(transaction) {
    const item = document.createElement("div");

    item.className = "transaction-item";

    const isIncome = transaction.type === "income";

    const amountText = formatCurrency(transaction.amount);
    const dateText = formatDate(transaction.date);

    item.innerHTML = `
        <div class="transaction-main">

            <div class="transaction-icon ${isIncome ? "income" : "expense"}">
                <i data-lucide="${
                    isIncome ? "trending-up" : "trending-down"
                }"></i>
            </div>

            <div class="transaction-info">

                <h3>
                    ${escapeHTML(transaction.description)}
                </h3>

                <div class="transaction-meta">

                    <span>
                        ${escapeHTML(transaction.category)}
                    </span>

                    <span>
                        ${dateText}
                    </span>

                </div>

            </div>

        </div>


        <div class="transaction-right">

            <strong class="${
                isIncome
                    ? "income-amount"
                    : "expense-amount"
            }">

                ${isIncome ? "+" : "-"}${amountText}

            </strong>


            <div class="transaction-actions">

                <button
                    type="button"
                    class="edit-btn"
                    data-id="${transaction.id}"
                    aria-label="Edit transaction"
                >

                    <i data-lucide="pencil"></i>

                </button>


                <button
                    type="button"
                    class="delete-btn-small"
                    data-id="${transaction.id}"
                    aria-label="Delete transaction"
                >

                    <i data-lucide="trash-2"></i>

                </button>

            </div>

        </div>
    `;


    const editButton =
        item.querySelector(".edit-btn");

    const deleteButton =
        item.querySelector(".delete-btn-small");


    editButton.addEventListener("click", function () {
        const id = Number(this.dataset.id);

        openEditModal(id);
    });


    deleteButton.addEventListener("click", function () {
        const id = Number(this.dataset.id);

        openDeleteModal(id);
    });


    return item;
}


/* FILTER TRANSACTIONS */

function getFilteredTransactions() {
    const searchTerm =
        searchInput.value.trim().toLowerCase();

    return transactions.filter(transaction => {

        const descriptionText =
            transaction.description.toLowerCase();

        const categoryText =
            transaction.category.toLowerCase();


        const matchesSearch =
            descriptionText.includes(searchTerm) ||
            categoryText.includes(searchTerm);


        const matchesCategory =
            categoryFilter.value === "all" ||
            transaction.category === categoryFilter.value;


        const matchesType =
            currentTypeFilter === "all" ||
            transaction.type === currentTypeFilter;


        return (
            matchesSearch &&
            matchesCategory &&
            matchesType
        );
    });
}


/* SEARCH */

searchInput.addEventListener("input", function () {
    renderTransactions();
});


/* CATEGORY FILTER */

categoryFilter.addEventListener("change", function () {
    renderTransactions();
});


/* TYPE FILTER */

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        this.classList.add("active");

        currentTypeFilter =
            this.dataset.type;

        renderTransactions();
    });

});