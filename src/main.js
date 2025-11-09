

// Form validation utility
function validateForm(formData) {
  for (const [ value] of formData.entries()) {
    if (typeof value === 'string' && value.trim() === '') {

      return false;
    }
  }
  return true;
}


const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);

    if (validateForm(formData)) {

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

      // TODO: Send to API
    }
  });
}


const profileForm = document.getElementById('profile-form');
if (profileForm) {
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(profileForm);

    if (validateForm(formData)) {

      // TODO: Send to API
    }
  });
}


const passwordForm = document.getElementById('password-form');
if (passwordForm) {
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(passwordForm);

    if (validateForm(formData)) {

      // TODO: Send to API
    }
  });
}

