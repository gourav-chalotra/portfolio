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

// Loader removed in redesign

// Initialize particles
createParticles();

window.addEventListener('scroll', appearOnScroll);
appearOnScroll(); // initial call

// Theme Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// On load, check preference
if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    if (themeIcon) {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }
} else {
    document.documentElement.classList.remove('dark');
    if (themeIcon) {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
}

// Listen for toggle click
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', function () {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });
}

// ======== Boomerang Cursor Logic ========
const boomerangCursor = document.getElementById('boomerang-cursor');
const heroTextWrapper = document.getElementById('hero-text-wrapper');
let boomerangTimeout;
let isHoveringHeroText = false;

let boomerangX, boomerangY;
if (boomerangCursor) {
    boomerangX = gsap.quickTo(boomerangCursor, "left", { duration: 0.15, ease: "power3" });
    boomerangY = gsap.quickTo(boomerangCursor, "top", { duration: 0.15, ease: "power3" });
}

if (heroTextWrapper && boomerangCursor) {
    heroTextWrapper.addEventListener('mouseenter', (e) => {
        isHoveringHeroText = true;

        // Snap to exact mouse pos immediately on enter, then fade in
        gsap.set(boomerangCursor, { left: e.clientX, top: e.clientY });
        gsap.to(whiteCursor, { opacity: 0, duration: 0.2 });
        gsap.to(blackCursor, { opacity: 0, duration: 0.2 });
        gsap.to(boomerangCursor, { opacity: 1, duration: 0.2, ease: "power2.out" });
    });

    heroTextWrapper.addEventListener('mouseleave', () => {
        isHoveringHeroText = false;
        gsap.to(boomerangCursor, { opacity: 0, duration: 0.2, ease: "power2.in" });
        gsap.to(whiteCursor, { opacity: 1, duration: 0.2 });
        gsap.to(blackCursor, { opacity: 1, duration: 0.2 });
    });

    heroTextWrapper.addEventListener('mousemove', (e) => {
        if (!isHoveringHeroText) return;

        // Maintain opacity while moving
        gsap.to(boomerangCursor, { opacity: 1, duration: 0.1 });

        // Smoothly track mouse
        boomerangX(e.clientX);
        boomerangY(e.clientY);

        clearTimeout(boomerangTimeout);
        // Start fading out after 50ms of inactivity
        boomerangTimeout = setTimeout(() => {
            if (isHoveringHeroText) {
                gsap.to(boomerangCursor, { opacity: 0, duration: 0.3, ease: "power2.inOut" });
            }
        }, 50);
    });
}

// ======== GSAP Loader Animation ========
const loader = document.getElementById('loader');
const loaderTextContainer = document.getElementById('loader-text-container');
const navLogo = document.getElementById('nav-logo');
const loadOurav = document.getElementById('load-ourav');
const loadHalotra = document.getElementById('load-halotra');
const loadSpace = document.getElementById('load-space');
const loadDots = document.getElementById('load-dots');

if (loader && navLogo) {
    gsap.set(navLogo, { opacity: 0 });
    document.body.style.overflow = "hidden"; // Prevent scrolling while loading

    // 1. Loading dots bounce infinitely while the page loads
    const dotsAnim = gsap.to(".dot", {
        y: -15,
        stagger: 0.15,
        repeat: -1,
        yoyo: true,
        duration: 0.3,
        ease: "power1.inOut"
    });

    // When the whole page (including fonts and large GIFs) has fully loaded, move to phase 2
    window.addEventListener('load', () => {
        // Guarantee at least a short minimum wait so it doesn't instantly vanish on fast networks
        setTimeout(() => {
            const tl = gsap.timeline();

            // Stop the infinite bounce and smoothly reset dots to 0 height
            tl.add(() => dotsAnim.kill());
            tl.to(".dot", { y: 0, duration: 0.2, ease: "power2.out" });

            // 2. Collapse everything except G and C to 0 width
            tl.to([loadOurav, loadHalotra, loadSpace, loadDots], {
                width: 0,
                opacity: 0,
                duration: 0.8,
                ease: "power3.inOut",
                stagger: 0.05
            });

            // 3. Move container to navLogo location
            tl.add(() => {
                // Safely grab dimensions (fonts are definitely loaded now)
                const logoRect = navLogo.getBoundingClientRect();
                const containerRect = loaderTextContainer.getBoundingClientRect();

                // Prevent Infinity divisions if for some reason a height is computed as 0
                const safeLogoHeight = Math.max(logoRect.height, 1);
                const safeContainerHeight = Math.max(containerRect.height, 1);

                const scaleVal = safeLogoHeight / safeContainerHeight;
                const xOffset = logoRect.left - containerRect.left;
                const yOffset = logoRect.top - containerRect.top;

                // Animate the GC container to the navbar
                gsap.to(loaderTextContainer, {
                    x: xOffset,
                    y: yOffset,
                    scale: scaleVal,
                    transformOrigin: "left top",
                    duration: 1.2,
                    ease: "power3.inOut"
                });

                // Add the '.' that is in 'GC.' in the navbar logo
                const finalDot = document.createElement('span');
                finalDot.innerText = ".";
                finalDot.style.opacity = 0;
                loaderTextContainer.appendChild(finalDot);
                gsap.to(finalDot, { opacity: 1, duration: 0.5, delay: 0.7 });

                // Fade out the loader background concurrently
                gsap.to(loader, {
                    backgroundColor: "transparent",
                    duration: 1.2,
                    ease: "power3.inOut",
                    onComplete: () => {
                        navLogo.style.opacity = 1;
                        loader.style.display = "none";
                        document.body.style.overflow = ""; // restore scroll
                    }
                });
            });
        }, 300); // slight grace period before collapsing
    });
}
