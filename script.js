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

    // Image Modal Logic
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const captionText = document.getElementById('caption');
    const closeButton = document.getElementsByClassName('close-button')[0];

    document.querySelectorAll('.portfolio-item img').forEach(image => {
        image.addEventListener('click', function() {
            modal.style.display = 'block';
            // Use data-src if available, otherwise fallback to src
            modalImage.src = this.dataset.src || this.src; 
            captionText.innerHTML = this.alt; // Use alt text as caption
        });
    });

    // When the user clicks on <span> (x), close the modal
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // When the user clicks anywhere outside of the image, close it
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Optional: Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });

});


