document.addEventListener('DOMContentLoaded', function() {
    // --- Smooth scrolling for navigation links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
            // Optional: Close mobile nav if applicable (add this if you have a responsive nav)
            // const navbar = document.querySelector('.navbar');
            // if (navbar && navbar.classList.contains('active')) {
            //     navbar.classList.remove('active');
            // }
        });
    });

    // --- Video Intersection Observer for lazy loading video source ---
    // This loads the actual video file only when it comes into the viewport
    const videos = [].slice.call(document.querySelectorAll(".portfolio-item video"));
    if ("IntersectionObserver" in window) {
        const videoObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(videoEntry) {
                if (videoEntry.isIntersecting) {
                    const video = videoEntry.target;
                    // Check if the video's src is already set (important for videos with direct src attributes)
                    if (!video.src) { // If src is empty, check for source child elements with data-src
                        for (const source of video.children) {
                            if (source.tagName === "SOURCE" && source.dataset.src) {
                                source.src = source.dataset.src;
                            }
                        }
                        video.load(); // Load the video content once src is set
                    }
                    observer.unobserve(video); // Stop observing once loaded
                }
            });
        }, {
            rootMargin: "0px", // Load when 0px away from viewport
            threshold: 0.1 // Load when 10% of video is visible
        });

        videos.forEach(function(video) {
            videoObserver.observe(video);
        });
    }

    // --- Header sticky and active link logic ---
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]'); // Select all sections with an ID

    function updateNav() {
        let currentActiveSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Determine current section based on scroll position, slightly offset for header
            if (pageYOffset >= sectionTop - header.offsetHeight - 50) {
                currentActiveSectionId = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.navbar ul li a').forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(currentActiveSectionId)) {
                a.classList.add('active');
            }
        });
    }

    // Event listener for scroll to update header and navigation
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Add 'scrolled' class to header
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        updateNav(); // Update active navigation link
    });

    // Initial call to set active link on load
    updateNav();

    // --- Hero content animation on load ---
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image img');

    if (heroContent && heroImage) {
        // Using a small timeout to ensure CSS is loaded and elements are rendered
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
            heroImage.style.opacity = '1';
            heroImage.style.transform = 'scale(1)';
        }, 100);
    }

    // --- Basic form submission handling ---
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            alert('Thank you for your message! We will get back to you soon.');
            this.reset(); // Clear the form fields
        });
    }

    // --- IMAGE MODAL LOGIC ---
    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeImageButton = imageModal.querySelector('.close-button'); // Get close button within this modal

    document.querySelectorAll('.portfolio-item img').forEach(image => {
        image.addEventListener('click', function() {
            imageModal.style.display = 'flex'; // Use 'flex' to enable centering via CSS
            modalImage.src = this.dataset.src || this.src; // Use data-src or fallback to src
            captionText.innerHTML = this.alt; // Use alt text as caption
        });
    });

    closeImageButton.addEventListener('click', function() {
        imageModal.style.display = 'none'; // Hide the modal
    });

    // --- VIDEO MODAL LOGIC ---
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoCaption = document.getElementById('videoCaption');
    const closeVideoButton = videoModal.querySelector('.close-button'); // Get close button within this modal

    document.querySelectorAll('.portfolio-item.video-item').forEach(videoItemDiv => {
        videoItemDiv.addEventListener('click', function() {
            const videoSrc = this.dataset.videoSrc; // Get video path from data-video-src on the div
            if (videoSrc) {
                videoModal.style.display = 'flex'; // Use 'flex' to enable centering via CSS
                modalVideo.src = videoSrc;
                modalVideo.load(); // Ensure video is loaded
                modalVideo.play(); // Start playing automatically in modal

                // Set caption from the overlay's H4
                const projectTitle = this.querySelector('.overlay h4');
                videoCaption.innerHTML = projectTitle ? projectTitle.textContent : '';

                // Request fullscreen for the video element
                if (modalVideo.requestFullscreen) {
                    modalVideo.requestFullscreen();
                } else if (modalVideo.mozRequestFullScreen) { /* Firefox */
                    modalVideo.mozRequestFullScreen();
                } else if (modalVideo.webkitRequestFullscreen) { /* Chrome, Safari, Opera */
                    modalVideo.webkitRequestFullscreen();
                } else if (modalVideo.msRequestFullscreen) { /* IE/Edge */
                    modalVideo.msRequestFullscreen();
                }
            }
        });
    });

    closeVideoButton.addEventListener('click', function() {
        videoModal.style.display = 'none'; // Hide the modal
        modalVideo.pause(); // Pause video when modal closes
        modalVideo.src = ""; // Clear source to stop download and free resources
        if (document.fullscreenElement) { // If currently in fullscreen mode
            document.exitFullscreen(); // Exit fullscreen
        }
    });

    // --- GLOBAL MODAL CLOSING LOGIC (Click outside and Escape key) ---
    window.addEventListener('click', function(e) {
        // Close image modal if click is directly on the modal background
        if (e.target === imageModal) {
            imageModal.style.display = 'none';
        }
        // Close video modal if click is directly on the modal background
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            modalVideo.pause();
            modalVideo.src = "";
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close image modal if open
            if (imageModal.style.display === 'flex') { // Check for 'flex'
                imageModal.style.display = 'none';
            }
            // Close video modal if open
            if (videoModal.style.display === 'flex') { // Check for 'flex'
                videoModal.style.display = 'none';
                modalVideo.pause();
                modalVideo.src = "";
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        }
    });
});
