// ===== DOM ELEMENT REFERENCES =====
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is already logged in
    const user = await checkAuth();

    if (user) {
        // Update navigation for logged-in user
        updateNavigationForLoggedInUser(user);
    }

    // Any other homepage-specific initialization
    initializeHomepage();
});

// ===== FUNCTIONS =====
// Update navigation for logged-in user
function updateNavigationForLoggedInUser(user) {
    const nav = document.querySelector('nav .flex.items-center');

    // Replace sign-in buttons with user menu
    nav.innerHTML = `
    <div class="flex items-center space-x-4">
      <a href="/dashboard.html" class="text-gray-700 hover:text-indigo-600">
        <i class="fas fa-user-circle mr-1"></i> ${user.email}
      </a>
      <button id="logoutBtn" class="text-gray-500 hover:text-gray-700">
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  `;

    // Add logout functionality
    document.getElementById('logoutBtn').addEventListener('click', logout);
}

// Initialize homepage features
function initializeHomepage() {
    // Add any homepage-specific functionality here
    console.log('Homepage initialized');
}