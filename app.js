// Basic app logic for searching internships using Supabase


const { data, error } = await query;
if (error) { console.error(error); resultsEl.innerHTML = '<div class="text-red-500">Search error</div>'; return; }


// client-side filter for "paid only" (simple heuristic: stipend not empty and not 'unpaid')
let results = data || [];
if (paidOnly) {
    results = results.filter(r => r.stipend && r.stipend.toLowerCase().indexOf('unpaid') === -1);
}


renderResults(results);



function renderResults(items) {
    if (!items || items.length === 0) { resultsEl.innerHTML = '<div class="p-6 bg-white rounded shadow-sm text-slate-500">No internships found — try a broader search.</div>'; return; }
    resultsEl.innerHTML = items.map(i => cardHtml(i)).join('\n');
    // attach apply listeners
    document.querySelectorAll('[data-apply-url]').forEach(btn => {
        btn.addEventListener('click', () => window.open(btn.dataset.applyUrl, '_blank'));
    });
}


function cardHtml(i) {
    const tags = (i.tags || []).map(t => `<span class="text-xs px-2 py-1 bg-slate-100 rounded">${escapeHtml(t)}</span>`).join(' ');
    return `
<article class="bg-white p-4 rounded-lg shadow-sm">
<div class="flex items-start justify-between">
<div>
<div class="text-sm text-slate-500">${escapeHtml(i.company)} · ${i.location || '—'}</div>
<h3 class="text-lg font-semibold mt-1">${escapeHtml(i.title)}</h3>
</div>
<div class="text-right">
<div class="text-sm text-slate-700">${escapeHtml(i.stipend || '—')}</div>
<div class="text-xs text-slate-400">${new Date(i.posted_at).toLocaleDateString()}</div>
</div>
</div>
<p class="text-sm text-slate-600 mt-3 line-clamp-3">${escapeHtml(i.description || '')}</p>
<div class="mt-3 flex items-center justify-between">
<div class="flex gap-2">${tags}</div>
<div>
<button data-apply-url="${escapeHtml(i.apply_url || '#')}" class="px-3 py-1 border rounded-md">Apply</button>
</div>
</div>
</article>
`;
}


function escapeHtml(s) { if (!s) return ''; return String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }


// Expose a small helper to set env values when hosting on static (Vercel will inject via script in index)
window.setSupabaseEnv = function (url, key) { window.env = { SUPABASE_URL: url, SUPABASE_ANON_KEY: key }; };


// On load: run an empty search to show recent posts
window.addEventListener('load', () => runSearch());