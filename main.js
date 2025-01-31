// ========== CONFIGURATION ========== //
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7UQ7pYGvBc9_qSSQZdidP2qeAZbFXL_By5xxTEXaiwahtkQb3suz3U8cmWr-J6gA/exec';
const COUNTDOWN_DATE = new Date("2030-01-01T00:00:00");

// ========== PARTICLES ========== //
particlesJS('particles-js', {
  particles: {
    number: { value: 150 },
    color: { value: '#ffffff' },
    shape: { type: 'circle' },
    opacity: { value: 0.7 },
    size: { value: 2 },
    move: {
      enable: true,
      speed: 1.5,
      direction: 'none',
      random: true,
      straight: false,
      out_mode: 'out',
      bounce: false,
    }
  },
  interactivity: {
    detect_on: 'canvas',
    events: {
      onhover: { enable: true, mode: 'repulse' },
      onclick: { enable: true, mode: 'push' },
      resize: true
    }
  },
  retina_detect: true
});

// ========== COUNTDOWN TIMER ========== //
function updateTimer() {
  const now = new Date().getTime();
  const distance = COUNTDOWN_DATE - now;

  document.getElementById('days').textContent = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
  document.getElementById('hours').textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
  document.getElementById('minutes').textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
  document.getElementById('seconds').textContent = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');

  if (distance < 0) {
    clearInterval(timerInterval);
    document.querySelector('.countdown').innerHTML = `
            <div class="neon-title" style="font-size: 2.5rem">
                LAUNCH SUCCESSFUL! 🚀
            </div>
        `;
  }
}
let timerInterval = setInterval(updateTimer, 1000);

// ========== FORM HANDLING ========== //
document.getElementById('emailForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.style.display = 'none';

  if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
    showError('⚠️ Invalid email address!');
    return;
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    showError('⚠️ Submission failed. Please check your connection.');
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
 // email Basic validation
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    showError('⚠️ Please enter valid email');
    return;
  }
