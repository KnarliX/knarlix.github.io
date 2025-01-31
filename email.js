// ========== CONFIGURATION ========== //
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMFivm7-8YqcxnB2NygTJXAnkKdGi8f22ahTgz4oExyKvEo78jrX39kobAXXmx8Zpx/exec'; // Replace with actual URL

// ========== FORM HANDLING ========== //
document.getElementById('emailForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.style.display = 'none';

  // Validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('⚠️ Please enter a valid email address');
    return;
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const result = await response.json();

    if (result.status === 'success') {
      showSuccess();
      localStorage.setItem('knarlixSubscribed', 'true');
    } else {
      showError(result.message || '⚠️ Submission failed. Please try again.');
    }
  } catch (error) {
    showError('⚠️ Connection error. Please check your network.');
    console.error('Submission Error:', error);
  }
});

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  document.getElementById('emailInput').style.borderColor = '#ff4444';
}

function showSuccess() {
  document.getElementById('successOverlay').style.display = 'flex';
  document.getElementById('emailForm').reset();
  setTimeout(() => {
    document.getElementById('successOverlay').style.display = 'none';
  }, 3000);
}

// Check existing subscription
if (localStorage.getItem('knarlixSubscribed')) {
  document.getElementById('emailForm').style.display = 'none';
  document.querySelector('.neon-title').textContent = 'WELCOME BACK!';
}
