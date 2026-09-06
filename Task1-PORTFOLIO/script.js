// Mobile Navigation
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("show");

    menuToggle.setAttribute("aria-expanded", isOpen);

    menuToggle.innerHTML = isOpen
        ? '<i data-lucide="x"></i>'
        : '<i data-lucide="menu"></i>';

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
});


// Close mobile menu when clicking a link
document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");
        menuToggle.setAttribute("aria-expanded", "false");

        menuToggle.innerHTML = '<i data-lucide="menu"></i>';

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }
    });
});


// Active Navigation Link
const sections = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-link");

function updateActiveLink() {
    const scrollPosition = window.scrollY + 150;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute("id");

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ) {
            navItems.forEach((link) => {
                link.classList.remove("active");

                if (link.getAttribute("href") === `#${sectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
}

window.addEventListener("scroll", updateActiveLink);


// Current Year
const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


// Contact Form Validation
const contactForm = document.getElementById("contactForm");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const subjectInput = document.getElementById("subject");
const messageInput = document.getElementById("message");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const subjectError = document.getElementById("subjectError");
const messageError = document.getElementById("messageError");

const formSuccess = document.getElementById("formSuccess");


// Clear error messages
function clearErrors() {
    nameError.textContent = "";
    emailError.textContent = "";
    subjectError.textContent = "";
    messageError.textContent = "";
    formSuccess.textContent = "";
}

// Validate email
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// Form Submit
contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    clearErrors();

    let isValid = true;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    if (name === "") {
        nameError.textContent = "Please enter your name.";
        isValid = false;
    } else if (name.length < 2) {
        nameError.textContent = "Name must be at least 2 characters.";
        isValid = false;
    }

    if (email === "") {
        emailError.textContent = "Please enter your email.";
        isValid = false;
    } else if (!isValidEmail(email)) {
        emailError.textContent = "Please enter a valid email.";
        isValid = false;
    }

    if (subject === "") {
        subjectError.textContent = "Please enter a subject.";
        isValid = false;
    }

    if (message === "") {
        messageError.textContent = "Please enter a message.";
        isValid = false;
    } else if (message.length < 10) {
        messageError.textContent = "Message must be at least 10 characters.";
        isValid = false;
    }

    if (isValid) {
        formSuccess.textContent = "Thanks! Your message has been submitted.";
        contactForm.reset();
    }
});


// Remove Errors While Typing
nameInput.addEventListener("input", () => {
    nameError.textContent = "";
});

emailInput.addEventListener("input", () => {
    emailError.textContent = "";
});

subjectInput.addEventListener("input", () => {
    subjectError.textContent = "";
});

messageInput.addEventListener("input", () => {
    messageError.textContent = "";
});

// Initialize Lucide Icons
if (typeof lucide !== "undefined") {
    lucide.createIcons();
}