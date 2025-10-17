document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('.navbar a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Lazy Loading Implementation ---

    // For Images: targets images with class 'lazyload'
    const lazyImages = document.querySelectorAll('img.lazyload');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                
                // Set src and srcset attributes from data-attributes
                img.src = img.dataset.src;
                if (img.dataset.srcset) {
                    img.srcset = img.dataset.srcset;
                }
                if (img.dataset.sizes) {
                    img.sizes = img.dataset.sizes;
                }
                
                img.classList.remove('lazyload'); // Remove class once loaded
                observer.unobserve(img); // Stop observing once loaded
            }
        });
    }, {
        rootMargin: '0px 0px 200px 0px' // Load images when they are 200px from viewport
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });

    // For Videos: targets videos with class 'lazyload-video'
    const lazyVideos = document.querySelectorAll('video.lazyload-video');

    const videoObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                
                // Set the src attribute for all <source> children
                for (const source of video.querySelectorAll('source')) {
                    if (source.dataset.src) {
                        source.src = source.dataset.src;
                    }
                }
                video.load(); // Tell the video element to load the new sources
                
                video.classList.remove('lazyload-video'); // Remove class once loaded
                observer.unobserve(video); // Stop observing once loaded
            }
        });
    }, {
        rootMargin: '0px 0px 200px 0px' // Load videos when they are 200px from viewport
    });

    lazyVideos.forEach(video => {
        videoObserver.observe(video);
    });

    // --- Modal Functionality ---

    const imageModal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const imageCloseBtn = imageModal.querySelector('.close-button');

    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const videoCaptionText = document.getElementById('videoCaption');
    const videoCloseBtn = videoModal.querySelector('.close-button');

    // Handle clicks on portfolio image items
    document.querySelectorAll('.portfolio-item img').forEach(item => {
        item.addEventListener('click', function() {
            imageModal.style.display = 'block';
            
            // Use the currently displayed src (which could be the lazy-loaded one)
            modalImage.src = this.src; 
            captionText.innerHTML = this.alt;
        });
    });

    // Handle clicks on portfolio video items
    document.querySelectorAll('.portfolio-item video').forEach(item => {
        item.addEventListener('click', function() {
            videoModal.style.display = 'block';
            
            // If video sources haven't been loaded yet by lazy loader, load them now
            if (item.classList.contains('lazyload-video')) {
                 for (const source of item.querySelectorAll('source')) {
                    if (source.dataset.src) {
                        source.src = source.dataset.src;
                    }
                }
                item.load(); // Manually load the video sources
                item.classList.remove('lazyload-video'); // Remove class as it's now loaded
            }

            // Set the modal video source to the clicked video's current source
            // Iterate through sources to find the appropriate one if multiple exist
            let primaryVideoSrc = '';
            for (const source of item.querySelectorAll('source')) {
                if (source.src) { // Check for the actual src, not data-src
                    primaryVideoSrc = source.src;
                    break;
                }
            }
            modalVideo.src = primaryVideoSrc || item.src; // Fallback to item.src if sources aren't found
            modalVideo.poster = item.poster; // Keep poster if available
            videoCaptionText.innerHTML = item.alt;
            modalVideo.play(); // Auto-play in modal
        });
    });

    // Close buttons for modals
    imageCloseBtn.addEventListener('click', () => {
        imageModal.style.display = 'none';
    });

    videoCloseBtn.addEventListener('click', () => {
        modalVideo.pause(); // Pause video when modal closes
        videoModal.style.display = 'none';
    });

    // Close modals if clicked outside
    window.addEventListener('click', (event) => {
        if (event.target == imageModal) {
            imageModal.style.display = 'none';
        }
        if (event.target == videoModal) {
            modalVideo.pause(); // Pause video when modal closes
            videoModal.style.display = 'none';
        }
    });
});
