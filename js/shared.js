// ===== SUPABASE CONFIGURATION =====
const SUPABASE_URL = "https://xjipqwtzywyezvzvikty.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqaXBxd3R6eXd5ZXp2enZpa3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwNTA1NzIsImV4cCI6MjA3NDYyNjU3Mn0.PeX5hP6SHpAHgQuy0Tu-ZYWVtqIn7ghj2UQqgRwgJ2c";
const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===== AUTHENTICATION HELPERS =====
// Check if user is authenticated
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    return session ? session.user : null;
}

// Logout user
async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
}

// ===== UI HELPERS =====
// Show notification
function showNotification(message, isError = false) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${isError ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
        }`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// ===== API HELPERS =====
// Fetch all jobs
async function fetchJobs() {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }

    return data;
}

// Fetch job by ID
async function fetchJobById(jobId) {
    const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();

    if (error) {
        console.error('Error fetching job:', error);
        return null;
    }

    return data;
}