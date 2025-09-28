// ======== Cursor Setup ========
const blackCursor = document.querySelector('.cursor.black');
const whiteCursor = document.querySelector('.cursor.white');

let mouseX = 0, mouseY = 0;      // mouse position
let currentX = 0, currentY = 0;  // cursor position
let lastX = 0, lastY = 0, lastTime = Date.now();
let targetSize = 40, currentSize = 40;

// Track mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    const now = Date.now();
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    const dt = now - lastTime;

    const speed = Math.sqrt(dx * dx + dy * dy) / dt * 50; // speed factor
    targetSize = Math.min(120, 40 + speed);               // clamp size

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;
});

// Animate cursor position smoothly
function animateCursor() {
    currentX += (mouseX - currentX) * 0.15; // easing
    currentY += (mouseY - currentY) * 0.15;

    blackCursor.style.left = currentX + 'px';
    blackCursor.style.top = currentY + 'px';
    whiteCursor.style.left = currentX + 'px';
    whiteCursor.style.top = currentY + 'px';

    // Animate white cursor size smoothly
    currentSize += (targetSize - currentSize) * 0.15;
    whiteCursor.style.width = currentSize + 'px';
    whiteCursor.style.height = currentSize + 'px';

    requestAnimationFrame(animateCursor);
}
animateCursor();

// Shrink white cursor if mouse stops moving
let timeout;
document.addEventListener('mousemove', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        targetSize = 40;
    }, 100); // 100ms of inactivity
});

// ======== Smooth Scroll for Anchor Links ========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ======== Fade-in on Scroll ========
const faders = document.querySelectorAll('.fadeInOnScroll');

const appearOnScroll = () => {
    const screenHeight = window.innerHeight;
    faders.forEach(fader => {
        const elementTop = fader.getBoundingClientRect().top;

        if (elementTop < screenHeight - 100) {
            fader.classList.add('active');
        } else {
            fader.classList.remove('active');
        }
    });
};
// Create floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position
        particle.style.left = `${Math.random() * 100}%`;

        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 15}s`;

        // Random animation duration
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`;

        particlesContainer.appendChild(particle);
    }
}

// Hide loader when page is loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 1000);
});

// Initialize particles
createParticles();

window.addEventListener('scroll', appearOnScroll);
appearOnScroll(); // initial call
