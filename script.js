/* LUXE Interactivity & Animation Engine */
document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. GLASS NAV TRANSITION & MEGA MENU HOVER ENGINE ---
    const header = document.getElementById("main-header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });

    const watchesLink = document.getElementById("link-watches");
    const megaMenu = document.getElementById("watches-mega-menu");
    let megaTimeout;

    const showMega = () => {
        clearTimeout(megaTimeout);
        megaMenu.classList.add("active");
    };

    const hideMega = () => {
        megaTimeout = setTimeout(() => {
            megaMenu.classList.remove("active");
        }, 220); // Smooth buffer delay for elegant UX transitions
    };

    if (watchesLink && megaMenu) {
        watchesLink.addEventListener("mouseenter", showMega);
        watchesLink.addEventListener("mouseleave", hideMega);
        megaMenu.addEventListener("mouseenter", showMega);
        megaMenu.addEventListener("mouseleave", hideMega);
    }

    // --- 2. SCROLL REVEAL / INTERSECTION OBSERVER ---
    const revealElements = [
        document.getElementById("hero-content-box"),
        document.getElementById("coll-header"),
        ...document.querySelectorAll(".card-wrapper")
    ];

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                // Stop observing once revealed to maintain state
                observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        root: null, // viewport
        threshold: 0.15, // trigger when 15% visible
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        if (element) {
            revealObserver.observe(element);
        }
    });

    // Immediately trigger Hero content animation in case entry is instant
    setTimeout(() => {
        const heroBox = document.getElementById("hero-content-box");
        if (heroBox) heroBox.classList.add("active");
    }, 100);

    // --- 3. HERO IMAGE PARALLAX DEPTH EFFECT ---
    const heroImageContainer = document.getElementById("hero-img-container");
    const heroBgImg = document.getElementById("hero-bg-img");
    
    if (heroImageContainer && heroBgImg) {
        window.addEventListener("scroll", () => {
            const scrollPos = window.pageYOffset;
            const heroHeight = document.getElementById("hero-section").offsetHeight;
            
            // Only calculate parallax if hero is visible in screen
            if (scrollPos <= heroHeight) {
                // Shift image down slightly slower than scroll (parallax)
                const yOffset = scrollPos * 0.12;
                heroBgImg.style.transform = `translateY(${yOffset}px) scale(1.05)`;
            }
        });
    }

    // --- 4. 3D TILT EFFECT ON PRODUCT CARDS & HERO VISUAL ---
    const cards = document.querySelectorAll('.product-card, .hero-showcase-frame');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            
            // Get mouse position relative to card center
            const mouseX = e.clientX - cardRect.left - (cardWidth / 2);
            const mouseY = e.clientY - cardRect.top - (cardHeight / 2);
            
            // Calculate tilt angle (max 10 degrees rotation)
            const rotateX = -(mouseY / (cardHeight / 2)) * 8;
            const rotateY = (mouseX / (cardWidth / 2)) * 8;
            
            // Apply 3D transform rotation & elevate card slightly
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            // Smoothly reset position on mouse leave
            card.style.transform = 'rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // --- 5. ELEGANT INTERACTIVE OVERLAYS / FEEDBACK MODALS ---
    const showNotification = (title, message) => {
        // Create dynamic refined popup alert
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(5, 5, 5, 0.85)";
        overlay.style.backdropFilter = "blur(15px)";
        overlay.style.webkitBackdropFilter = "blur(15px)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "1000";
        overlay.style.opacity = "0";
        overlay.style.transition = "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)";

        const modal = document.createElement("div");
        modal.style.backgroundColor = "#121212";
        modal.style.border = "1px solid rgba(229, 229, 229, 0.1)";
        modal.style.padding = "3.5rem 3rem";
        modal.style.maxWidth = "480px";
        modal.style.width = "90%";
        modal.style.textAlign = "center";
        modal.style.transform = "translateY(30px)";
        modal.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
        
        modal.innerHTML = `
            <span style="font-family: 'Inter', sans-serif; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.3em; color: #a3a3a3; display: block; margin-bottom: 1.5rem;">Private Concierge</span>
            <h3 style="font-family: 'Playfair Display', serif; font-size: 2rem; color: #e5e5e5; margin-bottom: 1rem; font-weight: 400;">${title}</h3>
            <p style="font-family: 'Inter', sans-serif; font-size: 0.9rem; color: #a3a3a3; line-height: 1.6; margin-bottom: 2.5rem; font-weight: 300;">${message}</p>
            <button id="close-modal-btn" style="background: #e5e5e5; color: #050505; border: none; padding: 1rem 2.5rem; font-family: 'Inter', sans-serif; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.2em; cursor: pointer; transition: all 0.3s ease;">Acknowledge</button>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Animate entrance
        setTimeout(() => {
            overlay.style.opacity = "1";
            modal.style.transform = "translateY(0)";
        }, 50);

        // Close functions
        const closeModal = () => {
            overlay.style.opacity = "0";
            modal.style.transform = "translateY(30px)";
            setTimeout(() => {
                document.body.removeChild(overlay);
            }, 500);
        };

        modal.querySelector("#close-modal-btn").addEventListener("click", closeModal);
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay) closeModal();
        });
    };

    // Attach actions to buttons
    const reserveBtn = document.getElementById("btn-nav-reserve");
    if (reserveBtn) {
        reserveBtn.addEventListener("click", () => {
            showNotification(
                "Private Showing Room", 
                "Your boutique consultation reservation request has been submitted. A LUXE representative will contact you shortly to coordinate an exclusive private gallery viewing."
            );
        });
    }

    // Wishlist dynamic increment on Enquiries
    const wishlistCountElement = document.getElementById("wishlist-count");
    let wishlistItems = 0;

    const enquireButtons = [
        { id: "buy-sovereign", name: "Sovereign Classic" },
        { id: "buy-vantage", name: "Vantage Sport" },
        { id: "buy-chronos", name: "Chronos Skeleton" }
    ];

    enquireButtons.forEach(btnInfo => {
        const btn = document.getElementById(btnInfo.id);
        if (btn) {
            btn.addEventListener("click", () => {
                // Increment Wishlist/Favorites count
                wishlistItems++;
                if (wishlistCountElement) {
                    wishlistCountElement.innerText = wishlistItems;
                    wishlistCountElement.style.transform = "scale(1.25)";
                    setTimeout(() => {
                        wishlistCountElement.style.transform = "scale(1)";
                    }, 200);
                }
                
                showNotification(
                    "Acquisition Enquiry", 
                    `You are enquirying about the acquisition of the custom piece <strong>${btnInfo.name}</strong>. This piece has been added to your favorites portfolio. Our bespoke concierge desk will contact you within 24 hours.`
                );
            });
        }
    });

    const exploreBtn = document.getElementById("btn-hero-explore");
    if (exploreBtn) {
        exploreBtn.addEventListener("click", () => {
            document.getElementById("collection").scrollIntoView({ behavior: 'smooth' });
        });
    }

    const storyBtn = document.getElementById("btn-hero-story");
    if (storyBtn) {
        storyBtn.addEventListener("click", () => {
            showNotification(
                "Our Horology Heritage", 
                "Every LUXE timepiece undergoes up to 18 months of precision hand-assembly, regulation, and testing in our Geneva studio, marrying traditional artistry with futuristic high-contrast materials."
            );
        });
    }

    // Omega Header Utility Actions
    const boutiqueBtn = document.getElementById("btn-boutique-locator");
    if (boutiqueBtn) {
        boutiqueBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showNotification(
                "Boutique Locator",
                "Accessing GPS coordinates... Our primary atelier is in Geneva, Switzerland, with private viewing boutique salons located in London, New York, Tokyo, and Dubai."
            );
        });
    }

    const comparatorBtn = document.getElementById("btn-comparator");
    if (comparatorBtn) {
        comparatorBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showNotification(
                "Watch Comparator",
                "You have enquired watches but have not marked specific calibres for side-by-side comparison. Add watches to comparison to view comparative mechanics."
            );
        });
    }

    const supportBtn = document.getElementById("btn-support");
    if (supportBtn) {
        supportBtn.addEventListener("click", (e) => {
            e.preventDefault();
            showNotification(
                "Concierge Care Desk",
                "Our hotlines are open 24/7. Direct global concierge dial: +41 22 555 9822 (Switzerland) or email: care@luxehorology.com."
            );
        });
    }

    // Auto-close mega menu when navigation links are clicked
    const megaLinks = document.querySelectorAll(".mega-link");
    megaLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (megaMenu) megaMenu.classList.remove("active");
        });
    });
});
