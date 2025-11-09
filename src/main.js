// Main entry point
console.log('Chat app initialized');

// Form validation utility
function validateForm(formData) {
    for (const [key, value] of formData.entries()) {
        if (typeof value === 'string' && value.trim() === '') {
            console.warn(`Field ${key} is empty`);
            return false;
        }
    }
    return true;
}

// Login form handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(loginForm);

        if (validateForm(formData)) {
            console.log('Login form data:', Object.fromEntries(formData));
            // TODO: Send to API
        }
    });
}

// Signup form handler
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(signupForm);

        if (validateForm(formData)) {
            console.log('Signup form data:', Object.fromEntries(formData));
            // TODO: Send to API
        }
    });
}

// Profile form handler
const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(profileForm);

        if (validateForm(formData)) {
            console.log('Profile form data:', Object.fromEntries(formData));
            // TODO: Send to API
        }
    });
}

// Password form handler
const passwordForm = document.getElementById('password-form');
if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(passwordForm);

        if (validateForm(formData)) {
            console.log('Password form data:', Object.fromEntries(formData));
            // TODO: Send to API
        }
    });
}

