/**
 * ===================================================================
 * BALASUBRAMANIAN M - PORTFOLIO INTERACTIVITY & ANIMATIONS
 * Robust, Safe ES6+ • Starfield Canvas • 3D Tilt • Lightbox • WhatsApp
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------
  // 1. DYNAMIC COPYRIGHT YEAR
  // -------------------------------------------------------------
  const yearEl = document.getElementById('currentYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // -------------------------------------------------------------
  // 2. NAVBAR SCROLL EFFECT & ACTIVE SECTION SPY
  // -------------------------------------------------------------
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Sticky header style
    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Active Section Spy
    const scrollPosition = scrollY + 180;
    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // -------------------------------------------------------------
  // 4. SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER + FAILSAFE)
  // -------------------------------------------------------------
  const aosElements = document.querySelectorAll('[data-aos]');

  if ('IntersectionObserver' in window && aosElements.length > 0) {
    const aosObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '50px 0px 50px 0px',
      }
    );

    aosElements.forEach((el) => aosObserver.observe(el));
  } else {
    // Immediate fallback
    aosElements.forEach((el) => el.classList.add('aos-animate'));
  }

  // Failsafe: Ensure no element stays invisible under any circumstances
  setTimeout(() => {
    aosElements.forEach((el) => {
      if (!el.classList.contains('aos-animate')) {
        el.classList.add('aos-animate');
      }
    });
  }, 400);

  // -------------------------------------------------------------
  // 5. CUSTOM CURSOR FOLLOWER
  // -------------------------------------------------------------
  const cursorDot = document.getElementById('cursorDot');
  const cursorOutline = document.getElementById('cursorOutline');

  if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let outlineX = mouseX;
    let outlineY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    const animateCursor = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      cursorOutline.style.left = `${outlineX}px`;
      cursorOutline.style.top = `${outlineY}px`;
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .gallery-item, .soft-badge, .figma-pill');
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      target.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // -------------------------------------------------------------
  // 6. CANVAS STARFIELD BACKGROUND
  // -------------------------------------------------------------
  const canvas = document.getElementById('starCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const STAR_COUNT = Math.min(Math.floor((width * height) / 9000), 100);

    class Star {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.6 + 0.4;
        this.baseAlpha = Math.random() * 0.6 + 0.2;
        this.alpha = this.baseAlpha;
        this.speedX = (Math.random() - 0.5) * 0.12;
        this.speedY = (Math.random() - 0.5) * 0.12;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleFactor = Math.random() * Math.PI;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        this.twinkleFactor += this.twinkleSpeed;
        this.alpha = this.baseAlpha + Math.sin(this.twinkleFactor) * 0.35;
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, this.alpha))})`;
        ctx.shadowBlur = this.size * 2.5;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
        ctx.fill();
        ctx.restore();
      }
    }

    const initStars = () => {
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
      }
    };

    const renderStars = () => {
      ctx.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.update();
        star.draw();
      });
      requestAnimationFrame(renderStars);
    };

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    });

    initStars();
    renderStars();
  }

  // -------------------------------------------------------------
  // 7. MOBILE DRAWER NAVIGATION
  // -------------------------------------------------------------
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

  const toggleMobileMenu = (open) => {
    if (!mobileMenu || !mobileOverlay) return;
    if (open) {
      mobileMenu.classList.add('active');
      mobileOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.remove('active');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.contains('active');
      toggleMobileMenu(!isOpen);
    });
  }

  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', () => toggleMobileMenu(false));
  if (mobileOverlay) mobileOverlay.addEventListener('click', () => toggleMobileMenu(false));
  mobileLinks.forEach((link) => link.addEventListener('click', () => toggleMobileMenu(false)));

  // -------------------------------------------------------------
  // 8. HERO MOUSE PARALLAX
  // -------------------------------------------------------------
  const heroSection = document.querySelector('.hero-section');
  const heroImage = document.getElementById('heroImage');
  const heroBgTitle = document.querySelector('.hero-bg-title');

  if (heroSection && window.matchMedia('(min-width: 992px)').matches) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      if (heroImage) {
        heroImage.style.transform = `translate3d(${x * 16}px, ${y * 10}px, 0) scale(1.01)`;
      }
      if (heroBgTitle) {
        heroBgTitle.style.transform = `translate3d(${x * -20}px, ${y * -12}px, 0)`;
      }
    });

    heroSection.addEventListener('mouseleave', () => {
      if (heroImage) heroImage.style.transform = 'translate3d(0, 0, 0) scale(1)';
      if (heroBgTitle) heroBgTitle.style.transform = 'translate3d(0, 0, 0)';
    });
  }

  // -------------------------------------------------------------
  // 9. 3D TILT EFFECT ON GALLERY & POSTER CARDS
  // -------------------------------------------------------------
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cardWidth = rect.width;
      const cardHeight = rect.height;
      const centerX = rect.left + cardWidth / 2;
      const centerY = rect.top + cardHeight / 2;

      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;

      const rotateX = (-mouseY / (cardHeight / 2)) * 6;
      const rotateY = (mouseX / (cardWidth / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });

  // -------------------------------------------------------------
  // 10. LIGHTBOX MODAL FUNCTIONALITY
  // -------------------------------------------------------------
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
  const lightboxNextBtn = document.getElementById('lightboxNextBtn');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  let currentGalleryIndex = 0;

  const openLightbox = (index) => {
    if (!lightboxModal || !galleryItems[index]) return;
    currentGalleryIndex = index;
    const item = galleryItems[index];

    const imgSrc = item.getAttribute('data-img') || item.querySelector('img')?.src;
    const title = item.getAttribute('data-title') || item.querySelector('h4')?.textContent || 'Artwork';
    const category = item.getAttribute('data-category') || item.querySelector('.overlay-cat')?.textContent || item.querySelector('.overlay-tag')?.textContent || 'Portfolio';

    lightboxImg.src = imgSrc;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightboxCategory.textContent = category;

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNextImage = () => {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  };

  const showPrevImage = () => {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentGalleryIndex);
  };

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      openLightbox(index);
    });
  });

  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', showNextImage);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', showPrevImage);

  window.addEventListener('keydown', (e) => {
    if (!lightboxModal || !lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
  });

  // -------------------------------------------------------------
  // 11. WHATSAPP CONTACT FORM DISPATCHER (NO BACKEND REQUIRED)
  // -------------------------------------------------------------
  const messageForm = document.getElementById('messageForm');
  const formFeedback = document.getElementById('formFeedback');

  const firstNameInput = document.getElementById('firstName');
  const lastNameInput = document.getElementById('lastName');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const messageInput = document.getElementById('message');

  const firstNameError = document.getElementById('firstNameError');
  const lastNameError = document.getElementById('lastNameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const BALA_WHATSAPP_NUMBER = '917904296131';

  const clearFormErrors = () => {
    [firstNameError, lastNameError, emailError, messageError].forEach((err) => {
      if (err) err.textContent = '';
    });
    if (formFeedback) {
      formFeedback.style.display = 'none';
      formFeedback.className = 'form-alert';
    }
  };

  if (messageForm) {
    messageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearFormErrors();

      let isValid = true;
      const firstName = firstNameInput.value.trim();
      const lastName = lastNameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const message = messageInput.value.trim();

      if (!firstName) {
        if (firstNameError) firstNameError.textContent = 'Please enter your first name';
        isValid = false;
      }

      if (!lastName) {
        if (lastNameError) lastNameError.textContent = 'Please enter your last name';
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        if (emailError) emailError.textContent = 'Please enter your email address';
        isValid = false;
      } else if (!emailRegex.test(email)) {
        if (emailError) emailError.textContent = 'Please enter a valid email address';
        isValid = false;
      }

      if (!message) {
        if (messageError) messageError.textContent = 'Please enter your message';
        isValid = false;
      }

      if (!isValid) return;

      const fullName = `${firstName} ${lastName}`.trim();
      const formattedWhatsAppText = 
`Hello Balasubramanian!

*New Portfolio Inquiry:*
*Name:* ${fullName}
*Email:* ${email}
*Phone:* ${phone || 'Not provided'}

*Message:*
${message}

(Sent from Balasubramanian M's Portfolio Website)`;

      const encodedText = encodeURIComponent(formattedWhatsAppText);
      const whatsappUrl = `https://wa.me/${BALA_WHATSAPP_NUMBER}?text=${encodedText}`;

      if (formFeedback) {
        formFeedback.textContent = '✓ Redirecting to WhatsApp chat... Opening now!';
        formFeedback.className = 'form-alert success';
        formFeedback.style.display = 'block';
      }

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        messageForm.reset();
      }, 700);
    });
  }

  // -------------------------------------------------------------
  // 12. SMOOTH SCROLLING FOR ALL INTERNAL LINKS
  // -------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
});
