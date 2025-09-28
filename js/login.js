// ===== DOM ELEMENT REFERENCES =====
const authForm = document.getElementById('authForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const togglePassword = document.getElementById('togglePassword');
const rememberCheckbox = document.getElementById('remember');
const authMessage = document.getElementById('authMessage');
const messageText = document.getElementById('messageText');
const loginBtnText = document.getElementById('loginBtnText');
const loginSpinner = document.getElementById('loginSpinner');

// ===== UI HELPER FUNCTIONS =====
// Show authentication message
function showMessage(message, isError = false) {
    messageText.textContent = message;
    authMessage.classList.remove('hidden', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');

    if (isError) {
        authMessage.classList.add('bg-red-100', 'text-red-800');
    } else {
        authMessage.classList.add('bg-green-100', 'text-green-800');
    }

    // Auto-hide after 5 seconds
    setTimeout(() => {
        authMessage.classList.add('hidden');
    }, 5000);
}

// Toggle password visibility
togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Toggle eye icon
    const icon = this.querySelector('i');
    icon.classList.toggle('fa-eye');
    icon.classList.toggle('fa-eye-slash');
});

// Set loading state for buttons
function setLoadingState(isLoading) {
    if (isLoading) {
        loginBtn.disabled = true;
        loginBtnText.textContent = 'Processing...';
        loginSpinner.classList.remove('hidden');
    } else {
        loginBtn.disabled = false;
        loginBtnText.textContent = 'Sign In';
        loginSpinner.classList.add('hidden');
    }
}

// ===== AUTHENTICATION FUNCTIONS =====
// Handle user login
async function handleLogin() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage('Please enter both email and password', true);
        return;
    }

    setLoadingState(true);

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            showMessage(error.message, true);
            return;
        }

        // Save session if remember me is checked
        if (rememberCheckbox.checked) {
            localStorage.setItem('supabase.auth.token', JSON.stringify(data.session));
        }

        showMessage('Login successful! Redirecting...');

        // Redirect to dashboard after successful login
        setTimeout(() => {
            window.location.href = '/dashboard.html';
        }, 1500);

    } catch (err) {
        showMessage('An unexpected error occurred. Please try again.', true);
        console.error('Login error:', err);
    } finally {
        setLoadingState(false);
    }
}

// Handle user signup
async function handleSignup() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage('Please enter both email and password', true);
        return;
    }

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters', true);
        return;
    }

    setLoadingState(true);

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            showMessage(error.message, true);
            return;
        }

        showMessage('Account created! Please check your email to verify your account.');

    } catch (err) {
        showMessage('An unexpected error occurred. Please try again.', true);
        console.error('Signup error:', err);
    } finally {
        setLoadingState(false);
    }
}

// ===== EVENT LISTENERS =====
loginBtn.addEventListener('click', handleLogin);
signupBtn.addEventListener('click', handleSignup);

// Handle form submission
authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
});

// Check for existing session on page load
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user has a saved session
    const savedSession = localStorage.getItem('supabase.auth.token');

    if (savedSession) {
        try {
            const { data, error } = await supabase.auth.getSession();

            if (data.session && !error) {
                // Redirect to dashboard if session is valid
                window.location.href = '/dashboard.html';
            } else {
                // Clear invalid session
                localStorage.removeItem('supabase.auth.token');
            }
        } catch (err) {
            console.error('Session check error:', err);
        }
    }
});