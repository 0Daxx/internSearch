// ===== DOM ELEMENT REFERENCES =====
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const user = await checkAuth();

    if (user) {
        updateNavigationForLoggedInUser(user);
    }

    // Load job listings
    await loadJobListings();

    // Set up filter event listeners
    setupFilters();
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

// Load job listings from Supabase
async function loadJobListings(filters = {}) {
    const jobListings = document.getElementById('jobListings');

    // Show loading state
    jobListings.innerHTML = `
    <li class="px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="text-sm font-medium text-indigo-600 truncate">Loading internships...</div>
      </div>
    </li>
  `;

    try {
        let query = supabase.from('jobs').select('*');

        // Apply filters if provided
        if (filters.location) {
            query = query.eq('location', filters.location);
        }

        if (filters.industry) {
            query = query.eq('industry', filters.industry);
        }

        if (filters.duration) {
            query = query.eq('duration', filters.duration);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        // Display job listings
        if (data.length === 0) {
            jobListings.innerHTML = `
        <li class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium text-gray-500 truncate">No internships found matching your criteria.</div>
          </div>
        </li>
      `;
        } else {
            jobListings.innerHTML = data.map(job => createJobListingHTML(job)).join('');
        }

    } catch (error) {
        console.error('Error loading job listings:', error);
        jobListings.innerHTML = `
      <li class="px-4 py-4 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-red-600 truncate">Error loading internships. Please try again later.</div>
        </div>
      </li>
    `;
    }
}

// Create HTML for a single job listing
function createJobListingHTML(job) {
    return `
    <li class="px-4 py-4 sm:px-6 hover:bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-indigo-100 rounded-md p-3">
            <i class="fas fa-briefcase text-indigo-600"></i>
          </div>
          <div class="ml-4">
            <a href="/job-detail.html?id=${job.id}" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">${job.title}</a>
            <p class="text-sm text-gray-500">${job.company}</p>
          </div>
        </div>
        <div class="flex items-center">
          <div class="text-right">
            <p class="text-sm text-gray-900">${job.location}</p>
            <p class="text-sm text-gray-500">${formatDate(job.created_at)}</p>
          </div>
          <div class="ml-4">
            <a href="/job-detail.html?id=${job.id}" class="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              View Details
            </a>
          </div>
        </div>
      </div>
    </li>
  `;
}

// Set up filter event listeners
function setupFilters() {
    const applyFiltersBtn = document.getElementById('applyFilters');

    applyFiltersBtn.addEventListener('click', async () => {
        const locationFilter = document.getElementById('locationFilter').value;
        const industryFilter = document.getElementById('industryFilter').value;
        const durationFilter = document.getElementById('durationFilter').value;

        const filters = {};

        if (locationFilter) filters.location = locationFilter;
        if (industryFilter) filters.industry = industryFilter;
        if (durationFilter) filters.duration = durationFilter;

        await loadJobListings(filters);
    });
}