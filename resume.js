// ======== Resume Fold Animation ========
if (typeof gsap !== "undefined") {
    const resumeContainer = document.querySelector('.resume-container');
    if (resumeContainer) {
        // Create an timeline, initially paused
        const foldTl = gsap.timeline({ paused: true });

        // Ensure starting state: Parts are folded in (alternating angles for accordion fold look)
        gsap.set('.resume-part-2', { rotateX: -165 });
        gsap.set('.resume-part-3', { rotateX: 160 });
        gsap.set('.resume-part-4', { rotateX: -160 });
        // Set initial shadow intensities
        gsap.set('.shadow-overlay', { opacity: 1 });

        // Animate unfolding sequence
        // We unfold them almost simultaneously but with a tiny stagger for a natural paper drop effect
        foldTl.to('.resume-part-2', { rotateX: 0, duration: 0.8, ease: "power2.inOut" }, 0)
            .to('.resume-part-3', { rotateX: 0, duration: 0.8, ease: "power2.inOut" }, 0.1)
            .to('.resume-part-4', { rotateX: 0, duration: 0.8, ease: "power2.inOut" }, 0.2)
            // Fade out the shadow gradients as the paper flattens
            .to('.shadow-overlay', { opacity: 0, duration: 0.8, ease: "power1.inOut" }, 0);

        // Play the unfolding animation on hover
        resumeContainer.addEventListener('mouseenter', () => {
            foldTl.play();
        });

        // Reverse back to folded state on mouse leave
        resumeContainer.addEventListener('mouseleave', () => {
            foldTl.reverse();
        });
    }
}
