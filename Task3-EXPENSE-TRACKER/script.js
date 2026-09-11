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


/* SUMMARY */

function updateSummary() {
    let income = 0;
    let expenses = 0;


    transactions.forEach(transaction => {

        const transactionAmount =
            Number(transaction.amount);


        if (transaction.type === "income") {
            income += transactionAmount;
        } else {
            expenses += transactionAmount;
        }

    });


    const balance = income - expenses;


    balanceElement.textContent =
        formatCurrency(balance);

    totalIncomeElement.textContent =
        formatCurrency(income);

    totalExpenseElement.textContent =
        formatCurrency(expenses);
}


/* CURRENCY */

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(value);
}


/* DATE FORMAT */

function formatDate(date) {

    if (!date) {
        return "";
    }

    const dateObject =
        new Date(date + "T00:00:00");


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* EDIT MODAL */

function openEditModal(id) {

    const transaction =
        transactions.find(item => item.id === id);


    if (!transaction) {
        return;
    }


    editTransactionId.value =
        transaction.id;

    editDescription.value =
        transaction.description;

    editType.value =
        transaction.type;

    editAmount.value =
        transaction.amount;

    editCategory.value =
        transaction.category;

    editDate.value =
        transaction.date;


    clearErrors();


    editModal.classList.add("active");

    editModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    refreshIcons();
}


function closeEditModal() {

    editModal.classList.remove("active");

    editModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    clearErrors();
}


modalClose.addEventListener(
    "click",
    closeEditModal
);


cancelEdit.addEventListener(
    "click",
    closeEditModal
);


modalOverlay.addEventListener(
    "click",
    closeEditModal
);


/* SAVE EDITED TRANSACTION */

editTransactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        clearErrors();


        const id =
            Number(editTransactionId.value);


        const newDescription =
            editDescription.value.trim();


        const newAmount =
            Number(editAmount.value);


        const newType =
            editType.value;


        const newCategory =
            editCategory.value;


        const newDate =
            editDate.value;


        let isValid = true;


        if (!newDescription) {

            showError(
                "editDescriptionError",
                "Please enter a description."
            );

            isValid = false;
        }


        if (!newAmount || newAmount <= 0) {

            showError(
                "editDescriptionError",
                "Please enter a valid amount."
            );

            isValid = false;
        }


        if (!newDate) {

            showToast(
                "Please select a date."
            );

            isValid = false;
        }


        if (!isValid) {
            return;
        }


        const transactionIndex =
            transactions.findIndex(
                transaction =>
                    transaction.id === id
            );


        if (transactionIndex === -1) {
            return;
        }


        transactions[transactionIndex] = {
            ...transactions[transactionIndex],

            description: newDescription,
            amount: newAmount,
            type: newType,
            category: newCategory,
            date: newDate
        };


        saveTransactions();


        closeEditModal();


        renderTransactions();
        updateSummary();
        refreshIcons();


        showToast(
            "Transaction updated successfully."
        );
    }
);


/* DELETE MODAL */

function openDeleteModal(id) {

    transactionToDelete = id;


    confirmModal.classList.add(
        "active"
    );


    confirmModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    refreshIcons();
}


function closeDeleteModal() {

    confirmModal.classList.remove(
        "active"
    );


    confirmModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    transactionToDelete = null;
}


cancelDelete.addEventListener(
    "click",
    closeDeleteModal
);


confirmOverlay.addEventListener(
    "click",
    closeDeleteModal
);


/* CONFIRM DELETE */

confirmDelete.addEventListener(
    "click",
    function () {

        if (transactionToDelete === null) {
            return;
        }


        transactions =
            transactions.filter(
                transaction =>
                    transaction.id !==
                    transactionToDelete
            );


        saveTransactions();


        closeDeleteModal();


        renderTransactions();
        updateSummary();
        refreshIcons();


        showToast(
            "Transaction deleted successfully."
        );
    }
);


/* CLEAR ALL TRANSACTIONS */

clearCompletedBtn.addEventListener(
    "click",
    function () {

        if (transactions.length === 0) {

            showToast(
                "There are no transactions to clear."
            );

            return;
        }


        transactions = [];


        saveTransactions();


        renderTransactions();
        updateSummary();
        refreshIcons();


        showToast(
            "All transactions cleared."
        );
    }
);


/* TOAST */

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


/* ESCAPE HTML */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


/* LUCIDE ICONS */

function refreshIcons() {

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}


/* ESC KEY */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key !== "Escape") {
            return;
        }


        if (
            editModal.classList.contains(
                "active"
            )
        ) {
            closeEditModal();
        }


        if (
            confirmModal.classList.contains(
                "active"
            )
        ) {
            closeDeleteModal();
        }

    }
);