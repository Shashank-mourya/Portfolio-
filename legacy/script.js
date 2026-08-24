document.addEventListener('DOMContentLoaded', () => {
    // 0. Pre-loader Implementation
    const loader = document.getElementById('site-loader');
    if (loader) {
        console.log("Loader active. Waiting 2 seconds...");
        document.body.classList.add('loader-active');
        
        setTimeout(() => {
            loader.classList.add('fade-out');
            console.log("Loader fade-out triggered.");
            
            setTimeout(() => {
                document.body.classList.remove('loader-active');
                console.log("Loader completely removed.");
            }, 800); // Wait for CSS transition (0.8s)
        }, 2000); // Initial 2-second delay
    } else {
        console.warn("Loader element not found.");
    }

    // 1. Navbar Background Change
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // 2. Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navHeight = nav.offsetHeight;
                const offsetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 3. Reveal on Scroll (Intersection Observer)
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // observer.unobserve(entry.target); // Keep observing for continuous effect if desired
            }
        });
    };

    const revealOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(revealCallback, revealOptions);
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));



    // 5. Hero Photo Scale Down
    const heroPhoto = document.querySelector('#hero-photo');
    const heroSection = document.querySelector('#hero');

    window.addEventListener('scroll', () => {
        const heroHeight = heroSection.offsetHeight;
        const scrollProgress = Math.min(1, window.scrollY / heroHeight);
        
        // Scale down from 1 to 0.6
        const scale = 1 - (scrollProgress * 0.4);
        // Translate slightly to keep it aligned
        const translateY = scrollProgress * 50; 
        const opacity = 1 - (scrollProgress * 0.5);

        if (heroPhoto) {
            heroPhoto.style.transform = `scale(${scale}) translateY(${translateY}px)`;
            heroPhoto.style.opacity = opacity;
        }
    });

    // 6. Initialize Lucide Icons (handled via CDN in HTML)
});
