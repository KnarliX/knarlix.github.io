const COUNTDOWN_DATE = new Date("2050-12-31T23:59:59");
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1334999277444796416/nt48AbTF5sQ22v0Tn_Su4J9UFssvsL2t6lw882oKC_tvLMrjzsdl5xxTjBEmvA-nSQTh";
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
document.getElementById('nameForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (submissionInProgress) return;

  const name = document.getElementById('nameInput').value.trim();
  const errorDiv = document.getElementById('errorMessage');
  errorDiv.style.display = 'none';

  if (!name) {
    showError('⚠️ Please enter your cosmic name!');
    return;
  }

  submissionInProgress = true;
  document.querySelector('.button-text').textContent = 'Joining...';

  try {
    // Save to localStorage
    localStorage.setItem('knarlixUserName', name);

    // Send to Discord
    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: `🚀 New crew member: **${name}** just joined the *Knarlix* Website!`
      })
    });

    showSuccess();
    updateWelcomeMessage(name);
  } catch (error) {
    showError('🌌 Connection failed! Trying again...');
  } finally {
    submissionInProgress = false;
    document.querySelector('.button-text').textContent = 'Join the Crew';
  }
});

// UI Functions
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

function updateWelcomeMessage(name) {
  document.getElementById('mainTitle').textContent = `WELCOME BACK, ${name.toUpperCase()}!`;
  document.getElementById('subTitle').textContent = 'COMING SOON';
  document.getElementById('nameForm').style.display = 'none';
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
  const savedName = localStorage.getItem('knarlixUserName');
  if (savedName) {
    updateWelcomeMessage(savedName);
  }
  setInterval(updateTimer, 1000);
});
