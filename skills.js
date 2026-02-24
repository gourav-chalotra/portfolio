// ======== 3D GSAP Skills Cube Animation ========

document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === "undefined") return;

    const cubes = document.querySelectorAll('.skill-cube');

    cubes.forEach((cube) => {
        // Create blue glowing dust particles inside the cube
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            cube.appendChild(particle);

            // Random initial 3D position within the 128x128 cube boundaries (-60 to 60)
            gsap.set(particle, {
                x: gsap.utils.random(-60, 60),
                y: gsap.utils.random(-60, 60),
                z: gsap.utils.random(-60, 60),
                opacity: gsap.utils.random(0.2, 0.9)
            });

            // Micro-animation for the dust floating around slowly
            gsap.to(particle, {
                x: "+=" + gsap.utils.random(-30, 30),
                y: "+=" + gsap.utils.random(-30, 30),
                z: "+=" + gsap.utils.random(-30, 30),
                opacity: "random(0.1, 1)",
                duration: "random(2, 4)",
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        }

        // Create an infinite random rotation timeline for each cube
        const rotationAnimation = gsap.to(cube, {
            rotationX: "random(-360, 360, 90)",
            rotationY: "random(-360, 360, 90)",
            rotationZ: "random(-180, 180, 45)",
            duration: "random(2.5, 5)",
            ease: "none",
            repeat: -1,
            yoyo: true // Smoothly rotate back and forth randomly
        });

        // The hover states are handled completely by CSS transitions (opacity: 0, scale: 50%) 
        // to morph out of the way for the 2D glass card. GSAP just handles the idle float/spin.

        const wrapper = cube.closest('.group');
        if (wrapper) {
            // Pause the random rotation on hover so it doesn't spin wildly while invisible
            wrapper.addEventListener('mouseenter', () => {
                rotationAnimation.pause();
                // Optionally reset rotation slightly for a clean exit, but CSS will hide it anyway.
            });

            // Resume spinning on mouse leave
            wrapper.addEventListener('mouseleave', () => {
                rotationAnimation.play();
            });
        }
    });

    // Animate the cards entering on scroll if desired, though AOS handles the wrappers.
});
