const COUNTDOWN_DATE = new Date("2050-12-31T23:59:59");
let submissionInProgress = false;

// Countdown Timer
function updateTimer() {
  const now = Date.now();
  const diff = COUNTDOWN_DATE - now;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = days.toString().padStart(2, '0');
  document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
  document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
  document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');

  if (diff < 0) {
    clearInterval(timerInterval);
    document.querySelector('.countdown').innerHTML = `
      <div class="neon-title" style="font-size: 2.5rem">
        LAUNCH FAILED! 
      </div>`;
  }
}

// Form Handling
document.getElementById('emailForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (submissionInProgress) return;

  const email = document.getElementById('emailInput').value.trim().toLowerCase();
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.style.display = 'none';

  if (!validateEmail(email)) {
    showError('⚠️ Invalid email address!');
    return;
  }

  submissionInProgress = true;
  document.querySelector('.button-text').textContent = 'Saving...';

  // Simulate save to local storage
  setTimeout(() => {
    localStorage.setItem('knarlixSubscribed', 'true');
    document.getElementById('emailForm').submit();
    showSuccess();
    submissionInProgress = false;
    document.querySelector('.button-text').textContent = 'Notify me';
  }, 1500);
});

// Validation and UI Functions
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(message) {
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  errorDiv.style.animation = 'shake 0.5s';
  setTimeout(() => errorDiv.style.animation = '', 500);
}

function showSuccess() {
  const overlay = document.getElementById('successOverlay');
  overlay.style.display = 'flex';
  createConfetti();
  setTimeout(() => overlay.style.display = 'none', 5000);
}

// Confetti Animation
function createConfetti() {
  const container = document.querySelector('.confetti-container');
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.animationDelay = Math.random() * 2 + 's';
    confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    container.appendChild(confetti);
  }
}

// Initial Check
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('knarlixSubscribed')) {
    document.getElementById('emailForm').style.display = 'none';
    document.getElementById('mainTitle').textContent = 'WELCOME BACK,<br>मित्र!';
   // document.getElementById('subTitle').style.display = 'none';
    document.getElementById('subTitle').textContent = 'COMING SOON';
  }
  setInterval(updateTimer, 1000);
});
