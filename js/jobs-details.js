// ===== DOM ELEMENT REFERENCES =====
document.addEventListener('DOMContentLoaded', async () => {
    // Check if user is logged in
    const user = await checkAuth();

    if (user) {
        updateNavigationForLoggedInUser(user);
    }

    // Get job ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');

    if (jobId) {
        await loadJobDetail(jobId);
    } else {
        // Redirect to jobs page if no ID provided
        window.location.href = '/jobs.html';
    }
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

// Load job details from Supabase
async function loadJobDetail(jobId) {
    const jobDetailContainer = document.getElementById('jobDetailContainer');

    try {
        const job = await fetchJobById(jobId);

        if (!job) {
            jobDetailContainer.innerHTML = `
        <div class="text-center py-12">
          <i class="fas fa-exclamation-circle text-red-500 text-3xl mb-4"></i>
          <p class="text-gray-600">Internship not found.</p>
          <a href="/jobs.html" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
            Browse All Internships
          </a>
        </div>
      `;
            return;
        }

        // Display job details
        jobDetailContainer.innerHTML = `
      <div class="border-b border-gray-200 pb-5">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">${job.title}</h1>
            <p class="mt-1 text-lg text-gray-500">${job.company}</p>
          </div>
          <div class="flex-shrink-0">
            <img class="h-16 w-16 rounded-full" src="https://picsum.photos/seed/${job.company}/200/200.jpg" alt="${job.company}">
          </div>
        </div>
      </div>
      
      <div class="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div class="sm:col-span-4">
          <h2 class="text-lg font-medium text-gray-900">Job Description</h2>
          <div class="mt-2 prose prose-indigo text-gray-500">
            <p>${job.description || 'No description available.'}</p>
          </div>
          
          <h2 class="mt-8 text-lg font-medium text-gray-900">Responsibilities</h2>
          <div class="mt-2 prose prose-indigo text-gray-500">
            <ul>
              ${job.responsibilities ? job.responsibilities.split('\n').map(item => `<li>${item}</li>`).join('') : '<li>No responsibilities listed.</li>'}
            </ul>
          </div>
          
          <h2 class="mt-8 text-lg font-medium text-gray-900">Qualifications</h2>
          <div class="mt-2 prose prose-indigo text-gray-500">
            <ul>
              ${job.qualifications ? job.qualifications.split('\n').map(item => `<li>${item}</li>`).join('') : '<li>No qualifications listed.</li>'}
            </ul>
          </div>
        </div>
        
        <div class="sm:col-span-2">
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Internship Details</h3>
            <dl class="space-y-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Location</dt>
                <dd class="text-sm text-gray-900">${job.location}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Duration</dt>
                <dd class="text-sm text-gray-900">${job.duration || 'Not specified'}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Start Date</dt>
                <dd class="text-sm text-gray-900">${job.start_date ? formatDate(job.start_date) : 'Not specified'}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Industry</dt>
                <dd class="text-sm text-gray-900">${job.industry || 'Not specified'}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Posted</dt>
                <dd class="text-sm text-gray-900">${formatDate(job.created_at)}</dd>
              </div>
            </dl>
            
            <div class="mt-6">
              <button id="applyBtn" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Apply Now
              </button>
              <button id="saveBtn" class="mt-3 w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Save for Later
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

        // Add event listeners for action buttons
        document.getElementById('applyBtn').addEventListener('click', () => handleApply(job));
        document.getElementById('saveBtn').addEventListener('click', () => handleSave(job));

    } catch (error) {
        console.error('Error loading job details:', error);
        jobDetailContainer.innerHTML = `
      <div class="text-center py-12">
        <i class="fas fa-exclamation-circle text-red-500 text-3xl mb-4"></i>
        <p class="text-gray-600">Error loading internship details. Please try again later.</p>
        <a href="/jobs.html" class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
          Browse All Internships
        </a>
      </div>
    `;
    }
}

// Handle job application
async function handleApply(job) {
    const user = await checkAuth();

    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = `/login.html?redirect=/job-detail.html?id=${job.id}`;
        return;
    }

    try {
        // In a real app, you would save the application to Supabase
        showNotification(`Application submitted for ${job.title} at ${job.company}!`);

        // Update button state
        const applyBtn = document.getElementById('applyBtn');
        applyBtn.textContent = 'Applied';
        applyBtn.disabled = true;
        applyBtn.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        applyBtn.classList.add('bg-green-600');

    } catch (error) {
        console.error('Error applying for job:', error);
        showNotification('Error submitting application. Please try again.', true);
    }
}

// Handle saving job for later
async function handleSave(job) {
    const user = await checkAuth();

    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = `/login.html?redirect=/job-detail.html?id=${job.id}`;
        return;
    }

    try {
        // In a real app, you would save the job to the user's saved jobs in Supabase
        showNotification(`${job.title} saved to your list!`);

        // Update button state
        const saveBtn = document.getElementById('saveBtn');
        saveBtn.textContent = 'Saved';
        saveBtn.disabled = true;
        saveBtn.classList.remove('bg-white', 'hover:bg-gray-50');
        saveBtn.classList.add('bg-gray-100');

    } catch (error) {
        console.error('Error saving job:', error);
        showNotification('Error saving job. Please try again.', true);
    }
}