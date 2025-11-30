async function checkBackend() {
    const statusEl = document.getElementById('backend-status');
    statusEl.textContent = 'Checking...';

    try {
    const res = await fetch('http://localhost:8080/api/health');
    if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    statusEl.textContent = `Backend is ${data.status} (${data.service})`;
    } catch (err) {
    console.error(err);
    statusEl.textContent = 'Backend not reachable 😢';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('check-backend-btn');
    btn.addEventListener('click', checkBackend);

    // optional: check automatically on load
    // checkBackend();
});