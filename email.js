document.getElementById('emailForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.style.display = 'none';

  // Disable button during submission
  const submitBtn = form.querySelector('button');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  // Check localStorage for duplicates
  const submittedEmails = JSON.parse(localStorage.getItem('knarlixSubmissions') || '[]');
  if (submittedEmails.includes(email)) {
    showError('🎯 You are already subscribed!');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Notify me';
    return;
  }

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('⚠️ Please enter a valid email address');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Notify me';
    return;
  }

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        _gotcha: '' // Anti-spam field
      })
    });

    const result = await response.json();

    if (result.ok) {
      // Store email locally
      submittedEmails.push(email);
      localStorage.setItem('knarlixSubmissions', JSON.stringify(submittedEmails));

      // Show success state
      showSuccess();
      form.reset();
      form.style.display = 'none';
    } else {
      showError('🚀 Submission failed. Try again!');
    }
  } catch (error) {
    showError('🌌 Connection error. Check network');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Notify me';
  }
});

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  document.getElementById('emailInput').style.borderColor = '#ff4444';
}

function showSuccess() {
  const overlay = document.getElementById('successOverlay');
  overlay.style.display = 'flex';

  // Confetti animation
  const confettiCount = 50;
  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    overlay.querySelector('.success-content').appendChild(confetti);
  }

  setTimeout(() => {
    overlay.style.display = 'none';
    overlay.querySelectorAll('.confetti').forEach(c => c.remove());
  }, 4000);
}

// Check existing submissions
const submittedEmails = JSON.parse(localStorage.getItem('knarlixSubmissions') || '[]');
if (submittedEmails.length > 0) {
  document.getElementById('emailForm').style.display = 'none';
  document.querySelector('.neon-title').textContent = 'WELCOME BACK!';
}
