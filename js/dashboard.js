// ===== DOM ELEMENT REFERENCES =====
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const user = await checkAuth();

    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = '/login.html';
        return;
    }

    // Initialize dashboard
    await initializeDashboard(user);

    // Set up tab navigation
    setupTabNavigation();

    // Load initial tab content
    await loadApplicationsTab();
});

// ===== FUNCTIONS =====
// Initialize dashboard with user data
async function initializeDashboard(user) {
    // Update user email in navigation
    document.getElementById('userEmail').textContent = user.email;

    // Add logout functionality
    document.getElementById('logoutBtn').addEventListener('click', logout);

    // Load user profile data
    await loadUserProfile(user);

    // Load dashboard statistics
    await loadDashboardStats(user);
}

// Load user profile data
async function loadUserProfile(user) {
    try {
        // In a real app, you would fetch user profile from Supabase
        // For now, we'll use placeholder data
        document.getElementById('userFullName').textContent = user.email.split('@')[0];
        document.getElementById('userEmailDetail').textContent = user.email;

        // Mock profile completion
        const profileCompletion = 65; // 65% complete
        document.getElementById('profileCompletion').textContent = `${profileCompletion}%`;

    } catch (error) {
        console.error('Error loading user profile:', error);
    }
}

// Load dashboard statistics
async function loadDashboardStats(user) {
    try {
        // In a real app, you would fetch these stats from Supabase
        // For now, we'll use mock data
        document.getElementById('applicationsCount').textContent = '5';
        document.getElementById('interviewsCount').textContent = '2';
        document.getElementById('savedJobsCount').textContent = '8';

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Set up tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const tabSelect = document.getElementById('tab-select');

    // Tab button click handlers
    tabButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const tabId = button.id.replace('-tab', '');

            // Update active tab button
            tabButtons.forEach(btn => {
                btn.classList.remove('border-indigo-500', 'text-indigo-600');
                btn.classList.add('border-transparent', 'text-gray-500');
            });

            button.classList.remove('border-transparent', 'text-gray-500');
            button.classList.add('border-indigo-500', 'text-indigo-600');

            // Show corresponding panel
            tabPanels.forEach(panel => {
                panel.classList.add('hidden');
            });

            document.getElementById(`${tabId}-panel`).classList.remove('hidden');

            // Load tab content
            if (tabId === 'applications') {
                await loadApplicationsTab();
            } else if (tabId === 'saved') {
                await loadSavedJobsTab();
            } else if (tabId === 'profile') {
                await loadProfileTab();
            }
        });
    });

    // Mobile tab select handler
    if (tabSelect) {
        tabSelect.addEventListener('change', async () => {
            const tabId = tabSelect.value;

            // Show corresponding panel
            tabPanels.forEach(panel => {
                panel.classList.add('hidden');
            });

            document.getElementById(`${tabId}-panel`).classList.remove('hidden');

            // Load tab content
            if (tabId === 'applications') {
                await loadApplicationsTab();
            } else if (tabId === 'saved') {
                await loadSavedJobsTab();
            } else if (tabId === 'profile') {
                await loadProfileTab();
            }
        });
    }
}

// Load applications tab content
async function loadApplicationsTab() {
    const applicationsList = document.getElementById('applicationsList');

    // Show loading state
    applicationsList.innerHTML = `
    <li class="px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="text-sm font-medium text-indigo-600 truncate">Loading applications...</div>
      </div>
    </li>
  `;

    try {
        // In a real app, you would fetch applications from Supabase
        // For now, we'll use mock data
        const applications = [
            {
                id: 1,
                jobTitle: 'Software Engineering Intern',
                company: 'TechCorp',
                status: 'Applied',
                appliedDate: '2023-06-15'
            },
            {
                id: 2,
                jobTitle: 'Marketing Intern',
                company: 'Creative Agency',
                status: 'Interview',
                appliedDate: '2023-06-10'
            },
            {
                id: 3,
                jobTitle: 'Data Science Intern',
                company: 'DataWorks',
                status: 'Rejected',
                appliedDate: '2023-06-01'
            }
        ];

        // Display applications
        if (applications.length === 0) {
            applicationsList.innerHTML = `
        <li class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium text-gray-500 truncate">You haven't applied to any internships yet.</div>
          </div>
        </li>
      `;
        } else {
            applicationsList.innerHTML = applications.map(app => createApplicationHTML(app)).join('');
        }

    } catch (error) {
        console.error('Error loading applications:', error);
        applicationsList.innerHTML = `
      <li class="px-4 py-4 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-red-600 truncate">Error loading applications. Please try again later.</div>
        </div>
      </li>
    `;
    }
}

// Create HTML for a single application
function createApplicationHTML(application) {
    let statusClass = '';
    let statusText = application.status;

    switch (application.status) {
        case 'Applied':
            statusClass = 'bg-blue-100 text-blue-800';
            break;
        case 'Interview':
            statusClass = 'bg-yellow-100 text-yellow-800';
            break;
        case 'Rejected':
            statusClass = 'bg-red-100 text-red-800';
            break;
        case 'Offer':
            statusClass = 'bg-green-100 text-green-800';
            break;
        default:
            statusClass = 'bg-gray-100 text-gray-800';
    }

    return `
    <li class="px-4 py-4 sm:px-6 hover:bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-indigo-600 truncate">${application.jobTitle}</p>
            <p class="mt-1 flex items-center text-sm text-gray-500">
              <i class="fas fa-building mr-1.5"></i>
              ${application.company}
            </p>
          </div>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">
            ${statusText}
          </span>
        </div>
      </div>
      <div class="mt-2 sm:flex sm:justify-between">
        <div class="sm:flex">
          <p class="flex items-center text-sm text-gray-500">
            <i class="fas fa-calendar-alt mr-1.5"></i>
            Applied on ${formatDate(application.appliedDate)}
          </p>
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <button class="font-medium text-indigo-600 hover:text-indigo-500">
            View Details
          </button>
        </div>
      </div>
    </li>
  `;
}

// Load saved jobs tab content
async function loadSavedJobsTab() {
    const savedJobsList = document.getElementById('savedJobsList');

    // Show loading state
    savedJobsList.innerHTML = `
    <li class="px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between">
        <div class="text-sm font-medium text-indigo-600 truncate">Loading saved jobs...</div>
      </div>
    </li>
  `;

    try {
        // In a real app, you would fetch saved jobs from Supabase
        // For now, we'll use mock data
        const savedJobs = [
            {
                id: 1,
                jobTitle: 'UX Design Intern',
                company: 'Design Studio',
                location: 'Remote',
                savedDate: '2023-06-12'
            },
            {
                id: 2,
                jobTitle: 'Finance Intern',
                company: 'Investment Bank',
                location: 'New York',
                savedDate: '2023-06-05'
            }
        ];

        // Display saved jobs
        if (savedJobs.length === 0) {
            savedJobsList.innerHTML = `
        <li class="px-4 py-4 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="text-sm font-medium text-gray-500 truncate">You haven't saved any internships yet.</div>
          </div>
        </li>
      `;
        } else {
            savedJobsList.innerHTML = savedJobs.map(job => createSavedJobHTML(job)).join('');
        }

    } catch (error) {
        console.error('Error loading saved jobs:', error);
        savedJobsList.innerHTML = `
      <li class="px-4 py-4 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium text-red-600 truncate">Error loading saved jobs. Please try again later.</div>
        </div>
      </li>
    `;
    }
}

// Create HTML for a single saved job
function createSavedJobHTML(job) {
    return `
    <li class="px-4 py-4 sm:px-6 hover:bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-indigo-600 truncate">${job.jobTitle}</p>
            <p class="mt-1 flex items-center text-sm text-gray-500">
              <i class="fas fa-building mr-1.5"></i>
              ${job.company}
            </p>
          </div>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button class="text-gray-400 hover:text-red-500">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <div class="mt-2 sm:flex sm:justify-between">
        <div class="sm:flex">
          <p class="flex items-center text-sm text-gray-500">
            <i class="fas fa-map-marker-alt mr-1.5"></i>
            ${job.location}
          </p>
        </div>
        <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
          <button class="font-medium text-indigo-600 hover:text-indigo-500 mr-3">
            Apply Now
          </button>
          <button class="font-medium text-gray-600 hover:text-gray-900">
            View Details
          </button>
        </div>
      </div>
    </li>
  `;
}

// Load profile tab content
async function loadProfileTab() {
    // Profile data is already loaded in initializeDashboard
    // Add edit profile button functionality
    const editProfileBtn = document.getElementById('editProfileBtn');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            // In a real app, you would open a modal or navigate to an edit profile page
            showNotification('Edit profile feature coming soon!');
        });
    }
}