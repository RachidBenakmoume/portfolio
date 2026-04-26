// =============================================
// main.js — Cinematic Portfolio Engine
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
});

// =============================================
// PRELOADER
// =============================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progress = document.getElementById('preloaderProgress');
  const counter = document.getElementById('preloaderCounter');
  let count = 0;

  const interval = setInterval(() => {
    count += Math.random() * 3 + 1;
    if (count >= 100) {
      count = 100;
      clearInterval(interval);

      // Init app BEFORE preloader fades — page is ready underneath
      initApp();

      // Brief pause at 100%, then smooth fade out to reveal the page
      setTimeout(() => {
        preloader.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 800);
      }, 200);
    }
    progress.style.width = count + '%';
    counter.textContent = Math.floor(count) + '%';
  }, 30);
}

// =============================================
// INIT APP (after preloader)
// =============================================
function initApp() {
  initLenis();
  initNav();
  initTheme();
  initLanguage();
  initHeroAnimations();
  initScrollAnimations();
  renderProjects();
  initLightbox();
  initContactForm();
  initBackToTop();
  initTilt();
  initMagneticButtons();
  initStatCounters();
  initCardGlow();
  initCustomCursor();
  initHeroTypingEffect();
  initKonamiCode();
}

// =============================================
// LENIS SMOOTH SCROLL
// =============================================
let lenis;
function initLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.4,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    touchMultiplier: 2,
    smoothWheel: true
  });
  // Expose so the plane intro can resume it after the reveal
  window.lenis = lenis;
  // Plane intro is on top — keep the page locked underneath until reveal
  if (document.documentElement.classList.contains('intro-active') && typeof lenis.stop === 'function') {
    lenis.stop();
  }

  // Use GSAP ticker as the single raf source (avoids double-raf conflict)
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Handle anchor clicks with Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        lenis.scrollTo(target, { offset: -80, duration: 1.6 });
        closeMobileMenu();
      }
    });
  });
}

// =============================================
// NAVIGATION
// =============================================
function initNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Active link on scroll
  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  });

  // Mobile hamburger
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }
}

function closeMobileMenu() {
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger) hamburger.classList.remove('active');
  if (mobileMenu) mobileMenu.classList.remove('active');
  document.body.style.overflow = '';
}

// =============================================
// THEME TOGGLE
// =============================================
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);

  const icon = document.querySelector('#themeToggle i');
  if (icon) {
    icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
  }

}

// =============================================
// LANGUAGE TOGGLE
// =============================================
let currentLang = 'fr';

function initLanguage() {
  const toggle = document.getElementById('langToggle');
  if (!toggle) return;

  currentLang = localStorage.getItem('language') || 'fr';
  applyLanguage(currentLang);

  toggle.addEventListener('click', () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    applyLanguage(currentLang, true);
    localStorage.setItem('language', currentLang);
  });
}

function applyLanguage(lang, animate) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update lang label
  const label = document.querySelector('.lang-label');
  if (label) label.textContent = lang === 'fr' ? 'EN' : 'FR';

  // Collect translatable elements
  const elements = document.querySelectorAll('[data-i18n]');

  function updateElement(el) {
    const key = el.getAttribute('data-i18n');
    const text = (translations[lang] && translations[lang][key]) ||
                 (projectTranslations && projectTranslations[lang] && projectTranslations[lang][key]);
    if (!text) return;

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = text;
    } else {
      // Preserve inner HTML for elements with icons
      const icon = el.querySelector('i');
      if (icon) {
        el.innerHTML = '';
        if (el.classList.contains('btn-outline')) {
          el.appendChild(icon);
          const span = document.createElement('span');
          span.textContent = text;
          el.appendChild(span);
        } else {
          const span = document.createElement('span');
          span.textContent = text;
          el.appendChild(span);
          el.appendChild(icon);
        }
      } else {
        el.textContent = text;
      }
    }
  }

  if (animate && typeof gsap !== 'undefined') {
    // Fade out, swap text, fade back in with a subtle blur + slide
    elements.forEach((el, i) => {
      const delay = i * 0.008;
      gsap.to(el, {
        opacity: 0,
        y: -6,
        filter: 'blur(4px)',
        duration: 0.18,
        delay: delay,
        ease: 'power2.in',
        onComplete: () => {
          updateElement(el);
          gsap.fromTo(el,
            { opacity: 0, y: 6, filter: 'blur(4px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.28, ease: 'power2.out' }
          );
        }
      });
    });
    // Re-render projects after animation settles
    setTimeout(() => renderProjects(), 300);
  } else {
    elements.forEach(updateElement);
    renderProjects();
  }
}

// =============================================
// HERO ANIMATIONS (GSAP)
// =============================================
function initHeroAnimations() {
  if (typeof gsap === 'undefined') {
    document.querySelectorAll('.hero-tag, .hero-title, .hero-desc, .hero-buttons, .hero-scroll').forEach(el => {
      el.style.opacity = '1';
    });
    return;
  }

  // CSS already hides everything — no gsap.set needed
  const tl = gsap.timeline();

  tl.to('.hero-tag', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  })
  .to('.hero-name-line', {
    opacity: 1,
    y: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power4.out'
  }, '-=0.4')
  .to('.hero-title', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.5')
  .to('.hero-desc', {
    opacity: 1,
    y: 0,
    duration: 0.7,
    ease: 'power3.out'
  }, '-=0.4')
  .to('.hero-buttons', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.3')
  .to('.hero-scroll', {
    opacity: 1,
    duration: 0.6,
    ease: 'power3.out'
  }, '-=0.2');

  // Animate background shapes with floating
  gsap.to('.shape-1', {
    x: 30, y: -20, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });
  gsap.to('.shape-2', {
    x: -20, y: 30, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });
  gsap.to('.shape-3', {
    x: 25, y: 25, duration: 7, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });
  gsap.to('.shape-4', {
    x: -15, y: -15, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });
  gsap.to('.shape-5', {
    x: 20, y: -30, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut'
  });

  // Mouse-driven parallax on hero shapes
  const heroSection = document.getElementById('hero');
  if (heroSection && !('ontouchstart' in window)) {
    const shapes = document.querySelectorAll('.shape');
    const depths = [0.03, 0.05, 0.04, 0.06, 0.02];
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      shapes.forEach((shape, i) => {
        const depth = depths[i] || 0.03;
        gsap.to(shape, {
          x: cx * rect.width * depth,
          y: cy * rect.height * depth,
          duration: 1,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      });
    });
  }
}

// =============================================
// SCROLL ANIMATIONS (GSAP ScrollTrigger)
// =============================================
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Section headers — split text reveal
  gsap.utils.toArray('.section-header').forEach(header => {
    const tag = header.querySelector('.section-tag');
    const title = header.querySelector('.section-title');

    if (tag) {
      gsap.from(tag, {
        scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' },
        x: -30, opacity: 0, duration: 0.6, ease: 'power3.out'
      });
    }

    if (title) {
      // Split title text into spans for letter animation
      const text = title.textContent;
      title.innerHTML = text.split('').map(ch =>
        ch === ' ' ? ' ' : `<span class="split-char">${ch}</span>`
      ).join('');
      title.style.overflow = 'hidden';

      gsap.from(title.querySelectorAll('.split-char'), {
        scrollTrigger: { trigger: header, start: 'top 85%', toggleActions: 'play none none none' },
        y: 60, opacity: 0, rotateX: -90, duration: 0.6, stagger: 0.02, ease: 'back.out(1.7)'
      });
    }
  });

  // About section elements
  gsap.utils.toArray('.about-bio, .about-stats, .about-location').forEach((el, i) => {
    gsap.fromTo(el,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  });

  // About tech card — slide in from right
  const techCard = document.querySelector('.about-tech-card');
  if (techCard) {
    gsap.fromTo(techCard,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: techCard, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
    gsap.fromTo(techCard.querySelectorAll('.tech-item'),
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, stagger: 0.05, delay: 0.3, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: techCard, start: 'top 90%', toggleActions: 'play none none none' }
      }
    );
  }

  // Timeline items — staggered with line draw
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
      x: -50, opacity: 0, duration: 0.8, ease: 'power3.out'
    });
    const dot = item.querySelector('.timeline-dot');
    if (dot) {
      gsap.from(dot, {
        scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
        scale: 0, duration: 0.4, delay: 0.2, ease: 'back.out(2)'
      });
    }
  });

  // Project cards — staggered with 3D rotation
  gsap.utils.toArray('.project-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
      y: 80, opacity: 0, rotateY: -5, scale: 0.95, duration: 0.9, ease: 'power3.out'
    });
  });

  // Education cards — staggered cascade
  gsap.utils.toArray('.edu-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
      y: 50, opacity: 0, scale: 0.9, duration: 0.7, delay: i * 0.12, ease: 'power3.out'
    });
  });

  // Contact grid
  gsap.from('.contact-info', {
    scrollTrigger: { trigger: '.contact-grid', start: 'top 85%', toggleActions: 'play none none none' },
    x: -50, opacity: 0, duration: 0.8, ease: 'power3.out'
  });

  gsap.from('.contact-form', {
    scrollTrigger: { trigger: '.contact-grid', start: 'top 85%', toggleActions: 'play none none none' },
    x: 50, opacity: 0, duration: 0.8, delay: 0.15, ease: 'power3.out'
  });
}

// =============================================
// RENDER PROJECTS
// =============================================
function renderProjects() {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  const lang = currentLang || 'fr';
  grid.innerHTML = '';

  projects.forEach((project, index) => {
    const id = project.id;
    const t = projectTranslations[lang];
    const title = t[`project${id}_title`] || '';
    const desc = t[`project${id}_desc`] || '';
    const tags = t[`project${id}_tags`] || [];
    const isPublic = project.isPublic;
    const images = project.images;
    const num = String(index + 1).padStart(2, '0');

    const linkText = isPublic
      ? (translations[lang].viewProject || 'View project')
      : (translations[lang].privateProject || 'Private project');
    const linkIcon = isPublic ? '<i class="fas fa-arrow-right"></i>' : '<i class="fas fa-lock"></i>';
    const linkClass = isPublic ? 'project-link' : 'project-link private';

    const galleryLabel = translations[lang].viewGallery || 'View gallery';

    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-image" data-project-id="${id}">
        <img src="${images[0]}" alt="${title}" loading="lazy" />
        ${images.length > 1 ? `
          <span class="project-image-count">${images.length} images</span>
          <div class="project-image-overlay">
            <button class="project-gallery-btn" data-project-id="${id}">
              <i class="fas fa-images"></i>
              <span>${galleryLabel}</span>
            </button>
          </div>
        ` : ''}
      </div>
      <div class="project-info">
        <div class="project-number">PROJECT ${num}</div>
        <h3 class="project-title">${title}</h3>
        <p class="project-desc">${desc}</p>
        <div class="project-tags">
          ${tags.map(tag => `<span>${tag}</span>`).join('')}
        </div>
        <span class="${linkClass}">
          ${linkText} ${linkIcon}
        </span>
      </div>
    `;

    grid.appendChild(card);
  });

  // Bind gallery button clicks
  grid.querySelectorAll('.project-gallery-btn, .project-image[data-project-id]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const projectId = parseInt(el.getAttribute('data-project-id'));
      const project = projects.find(p => p.id === projectId);
      if (project && project.images.length > 0) {
        openLightbox(project.images, 0);
      }
    });
  });

  // Re-init scroll animations for new elements
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

// =============================================
// LIGHTBOX
// =============================================
let lightboxImages = [];
let lightboxIndex = 0;

function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');

  if (!lightbox) return;

  closeBtn.addEventListener('click', closeLightbox);
  prevBtn.addEventListener('click', () => navigateLightbox(-1));
  nextBtn.addEventListener('click', () => navigateLightbox(1));

  // Close on backdrop click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });
}

function openLightbox(images, index) {
  lightboxImages = images;
  lightboxIndex = index;
  updateLightboxImage();

  const lightbox = document.getElementById('lightbox');
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (lenis) lenis.stop();
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
  if (lenis) lenis.start();
}

function navigateLightbox(dir) {
  lightboxIndex = (lightboxIndex + dir + lightboxImages.length) % lightboxImages.length;
  updateLightboxImage();
}

function updateLightboxImage() {
  const img = document.getElementById('lightboxImg');
  const counter = document.getElementById('lightboxCounter');
  img.src = lightboxImages[lightboxIndex];
  img.alt = `Project image ${lightboxIndex + 1} of ${lightboxImages.length}`;
  counter.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

// =============================================
// CONTACT FORM
// =============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  let isSending = false;
  let lastSentAt = 0;
  const COOLDOWN_MS = 60000; // 1 minute between messages

  // Sync reCAPTCHA theme with site theme
  function updateRecaptchaTheme() {
    const container = document.querySelector('.form-recaptcha');
    if (!container || typeof grecaptcha === 'undefined') return;
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const newTheme = isDark ? 'dark' : 'light';

    // Remove old widget and create a fresh div
    container.innerHTML = '<div class="g-recaptcha" id="recaptchaWidget"></div>';
    const newWidget = container.querySelector('#recaptchaWidget');
    grecaptcha.render(newWidget, {
      sitekey: '6LdbK6osAAAAANejs5eeJB4EaeuBN5N5fj8qhCpB',
      theme: newTheme
    });
  }

  // Watch for theme changes
  const observer = new MutationObserver(() => updateRecaptchaTheme());
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = form.querySelector('.btn-submit');
    const lang = currentLang || 'fr';

    // Honeypot check — if filled, silently pretend success
    const honeypot = document.getElementById('formWebsite');
    if (honeypot && honeypot.value) {
      alert(translations[lang].alert_success);
      form.reset();
      return;
    }

    // reCAPTCHA check
    if (typeof grecaptcha !== 'undefined') {
      const response = grecaptcha.getResponse();
      if (!response) {
        alert(lang === 'fr'
          ? 'Veuillez valider le reCAPTCHA.'
          : 'Please complete the reCAPTCHA.');
        return;
      }
    }

    // Block if already sending
    if (isSending) return;

    // Rate limit: 1 message per minute
    const now = Date.now();
    const remaining = COOLDOWN_MS - (now - lastSentAt);
    if (lastSentAt && remaining > 0) {
      const secs = Math.ceil(remaining / 1000);
      alert(lang === 'fr'
        ? `Veuillez patienter ${secs}s avant d'envoyer un autre message.`
        : `Please wait ${secs}s before sending another message.`);
      return;
    }

    isSending = true;
    btn.classList.add('loading');
    btn.disabled = true;

    const formData = {
      from_name: document.getElementById('formName').value,
      from_email: document.getElementById('formEmail').value,
      subject: document.getElementById('formSubject').value,
      message: document.getElementById('formMessage').value,
      'g-recaptcha-response': typeof grecaptcha !== 'undefined' ? grecaptcha.getResponse() : ''
    };

    if (typeof emailjs !== 'undefined') {
      emailjs.send("service_4co3s35", "template_exicoof", formData)
        .then(() => {
          lastSentAt = Date.now();
          alert(translations[lang].alert_success);
          form.reset();
          if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
          btn.classList.remove('loading');
          btn.disabled = false;
          isSending = false;
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          alert(translations[lang].alert_error);
          if (typeof grecaptcha !== 'undefined') grecaptcha.reset();
          btn.classList.remove('loading');
          btn.disabled = false;
          isSending = false;
        });
    }
  });
}

// =============================================
// BACK TO TOP
// =============================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// =============================================
// 3D TILT EFFECT ON CARDS
// =============================================
function initTilt() {
  if ('ontouchstart' in window) return;

  const tiltElements = document.querySelectorAll('.about-tech-card, .project-card, .edu-card, .timeline-card');

  tiltElements.forEach(el => {
    el.style.willChange = 'transform';

    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(el, {
        rotateY: x * 10,
        rotateX: -y * 10,
        scale: 1.02,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });
}

// =============================================
// MAGNETIC BUTTONS
// =============================================
function initMagneticButtons() {
  if ('ontouchstart' in window) return;

  const magnets = document.querySelectorAll('.btn-primary, .btn-outline, .social-link, .back-to-top');

  magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });
}

// =============================================
// ANIMATED STAT COUNTERS
// =============================================
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  statNumbers.forEach(el => {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(\+?)$/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = match[2] || '';
    el.textContent = '0' + suffix;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      onUpdate: () => {
        el.textContent = Math.floor(obj.val) + suffix;
      }
    });
  });
}

// =============================================
// CARD GLOW EFFECT (cursor-following gradient)
// =============================================
function initCardGlow() {
  if ('ontouchstart' in window) return;

  const glowCards = document.querySelectorAll('.about-tech-card, .timeline-card, .edu-card');

  glowCards.forEach(card => {
    card.style.position = 'relative';

    const glow = document.createElement('div');
    glow.className = 'card-glow';
    card.appendChild(glow);

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      glow.style.opacity = '1';
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
    });

    card.addEventListener('mouseleave', () => {
      glow.style.opacity = '0';
    });
  });
}

// =============================================
// CUSTOM CURSOR
// =============================================
function initCustomCursor() {
  if ('ontouchstart' in window || window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  // Show cursor on first move
  document.addEventListener('mousemove', function onFirst(e) {
    dot.classList.add('visible');
    ring.classList.add('visible');
    mouseX = e.clientX;
    mouseY = e.clientY;
    ringX = mouseX;
    ringY = mouseY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    document.removeEventListener('mousemove', onFirst);
  });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover detection
  const hoverTargets = 'a, button, input, textarea, .project-card, .edu-card, .timeline-card, .tech-item, .social-link, .btn-terminal';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    }
  });

  // Click shrink
  document.addEventListener('mousedown', () => {
    dot.classList.add('clicking');
    ring.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    dot.classList.remove('clicking');
    ring.classList.remove('clicking');
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.classList.remove('visible');
    ring.classList.remove('visible');
  });
  document.addEventListener('mouseenter', () => {
    dot.classList.add('visible');
    ring.classList.add('visible');
  });

  // Hide default cursor
  document.body.style.cursor = 'none';
  document.querySelectorAll('a, button, input, textarea').forEach(el => {
    el.style.cursor = 'none';
  });
}

// =============================================
// HERO TYPING EFFECT
// =============================================
function initHeroTypingEffect() {
  const titleEl = document.querySelector('.hero-title');
  if (!titleEl) return;

  const lang = localStorage.getItem('language') || 'fr';
  const fullText = (translations[lang] && translations[lang]['hero_title']) || titleEl.textContent;

  // Wait for the GSAP hero animation to reveal the title first
  // The title animates in around 1.5s after preloader, so we wait
  const startDelay = 1800;

  // Clear text initially (GSAP will handle opacity)
  titleEl.textContent = '';

  // Create cursor element
  const cursor = document.createElement('span');
  cursor.className = 'hero-typing-cursor';

  setTimeout(() => {
    let i = 0;
    titleEl.textContent = '';
    titleEl.appendChild(cursor);

    function typeChar() {
      if (i < fullText.length) {
        // Insert character before cursor
        cursor.before(document.createTextNode(fullText[i]));
        i++;
        const speed = 40 + Math.random() * 40; // Natural variance
        setTimeout(typeChar, speed);
      } else {
        // Remove cursor after a pause
        setTimeout(() => {
          cursor.style.animation = 'none';
          cursor.style.opacity = '0';
          cursor.style.transition = 'opacity 0.5s ease';
        }, 1500);
      }
    }
    typeChar();
  }, startDelay);
}

// =============================================
// KONAMI CODE EASTER EGG
// =============================================
function initKonamiCode() {
  const konamiSequence = ['r', 'a', 'c', 'h', 'i', 'd'];
  let konamiIndex = 0;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'konami-overlay';
  overlay.innerHTML = `
    <div class="konami-content">
      <img src="assets/skeleton-skeleton-dance.gif" alt="Spooky dance" class="konami-gif" />
      <div class="konami-title">You typed my name...</div>
      <div class="konami-subtitle">Now you're stuck in the vibe zone. No escape.</div>
      <button class="konami-close">Let me out</button>
    </div>
  `;
  document.body.appendChild(overlay);

  const closeBtn = overlay.querySelector('.konami-close');
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    stopConfetti();
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      stopConfetti();
    }
  });

  let confettiInterval = null;

  function spawnConfetti() {
    const colors = ['#6c63ff', '#ff5f57', '#febc2e', '#28c840', '#5c9eff', '#c678dd', '#56d4dd'];
    confettiInterval = setInterval(() => {
      for (let i = 0; i < 3; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 8 + 5) + 'px';
        confetti.style.height = (Math.random() * 8 + 5) + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(confetti);

        const rotation = Math.random() * 360;
        const xDrift = (Math.random() - 0.5) * 200;

        if (typeof gsap !== 'undefined') {
          gsap.to(confetti, {
            y: window.innerHeight + 20,
            x: xDrift,
            rotation: rotation,
            duration: Math.random() * 2 + 2,
            ease: 'power1.in',
            onComplete: () => confetti.remove()
          });
        } else {
          setTimeout(() => confetti.remove(), 3000);
        }
      }
    }, 100);
  }

  function stopConfetti() {
    if (confettiInterval) {
      clearInterval(confettiInterval);
      confettiInterval = null;
    }
    // Clean remaining confetti after a moment
    setTimeout(() => {
      document.querySelectorAll('.confetti').forEach(c => c.remove());
    }, 3000);
  }

  document.addEventListener('keydown', (e) => {
    // Don't trigger in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const expected = konamiSequence[konamiIndex];
    if (e.key === expected || e.key.toLowerCase() === expected) {
      konamiIndex++;
      if (konamiIndex === konamiSequence.length) {
        konamiIndex = 0;
        overlay.classList.add('active');
        spawnConfetti();
      }
    } else {
      konamiIndex = 0;
    }
  });
}

