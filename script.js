document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- VIDEO INTERSECTION OBSERVER (Modified) ---
    // This part helps lazy-load videos as they come into view.
    // It's good practice, but for direct fullscreen click,
    // we'll primarily rely on the data-video-src attribute for the modal.
    // We target the actual <video> elements within .portfolio-item
    var videos = [].slice.call(document.querySelectorAll(".portfolio-item video"));
    if("IntersectionObserver" in window){
        var videoObserver = new IntersectionObserver(function(entries, observer){
            entries.forEach(function(videoEntry){
                if(videoEntry.isIntersecting){
                    var video = videoEntry.target;
                    // Check if the video has a src already set (it might if using data-src for poster)
                    if (!video.src) { // Only load if src is not already set
                        for (var source of video.children){ // Use 'of' for iterating NodeList
                            if(typeof source.tagName === "string" && source.tagName === "SOURCE" && source.dataset.src){
                                source.src = source.dataset.src;
                            }
                        }
                        video.load(); // Load the video once src is set
                    }
                    // Optional: You can play small preview videos automatically here if desired,
                    // but for fullscreen on click, it's better to only load them.
                    observer.unobserve(video);
                }
            });
        });
        videos.forEach(function(video){
            videoObserver.observe(video);
        });
    }

    // Optional: Add a class to the header when scrolled to make it more prominent
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Adjust scroll threshold as needed
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Add some animation to hero content on load
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

    // Basic form submission handling (you'd typically use a backend for this)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            this.reset(); // Clear the form
        });
    }

    // --- IMAGE MODAL LOGIC (No changes needed here for image functionality) ---
    const imageModal = document.getElementById('imageModal'); // Renamed from 'modal' for clarity
    const modalImage = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeImageButton = imageModal.querySelector('.close-button'); // Target specifically within imageModal

    document.querySelectorAll('.portfolio-item img').forEach(image => {
        image.addEventListener('click', function() {
            imageModal.style.display = 'block';
            modalImage.src = this.dataset.src || this.src;
            captionText.innerHTML = this.alt;
        });
    });

    closeImageButton.addEventListener('click', function() {
        imageModal.style.display = 'none';
    });

    // --- NEW: VIDEO MODAL LOGIC ---
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoCaption = document.getElementById('videoCaption');
    const closeVideoButton = videoModal.querySelector('.close-button'); // Target specifically within videoModal

    document.querySelectorAll('.portfolio-item.video-item').forEach(videoItemDiv => {
        videoItemDiv.addEventListener('click', function() {
            const videoSrc = this.dataset.videoSrc; // Get from the data-video-src attribute on the div
            if (videoSrc) {
                videoModal.style.display = 'block';
                modalVideo.src = videoSrc;
                modalVideo.load(); // Load the video
                modalVideo.play(); // Autoplay when modal opens

                // Set video caption from overlay h4
                const projectTitle = this.querySelector('.overlay h4');
                if (projectTitle) {
                    videoCaption.innerHTML = projectTitle.textContent;
                } else {
                    videoCaption.innerHTML = '';
                }

                // Request fullscreen for the video element
                if (modalVideo.requestFullscreen) {
                    modalVideo.requestFullscreen();
                } else if (modalVideo.mozRequestFullScreen) { /* Firefox */
                    modalVideo.mozRequestFullScreen();
                } else if (modalVideo.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                    modalVideo.webkitRequestFullscreen();
                } else if (modalVideo.msRequestFullscreen) { /* IE/Edge */
                    modalVideo.msRequestFullscreen();
                }
            }
        });
    });

    closeVideoButton.addEventListener('click', function() {
        videoModal.style.display = 'none';
        modalVideo.pause(); // Pause video when modal closes
        modalVideo.src = ""; // Clear source to stop download
        if (document.fullscreenElement) { // Check if any element is in fullscreen
            document.exitFullscreen(); // Exit fullscreen
        }
    });


    // --- GLOBAL MODAL CLOSING LOGIC ---
    // When the user clicks anywhere outside of the image/video, close it
    window.addEventListener('click', function(e) {
        if (e.target === imageModal) {
            imageModal.style.display = 'none';
        }
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            modalVideo.pause();
            modalVideo.src = ""; // Clear source to stop download
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    });

    // Optional: Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (imageModal.style.display === 'block') {
                imageModal.style.display = 'none';
            }
            if (videoModal.style.display === 'block') {
                videoModal.style.display = 'none';
                modalVideo.pause();
                modalVideo.src = ""; // Clear source to stop download
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
            }
        }
    });
});
