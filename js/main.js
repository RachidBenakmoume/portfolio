// main.js - Core functionality for portfolio website

// Wait for DOM content to be loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initThemeToggle();
  initLanguageToggle();
  initNavbar();
  initAnimations();
  initParticles();
  initSkillBars();
  initContactForm();
  initSmoothScroll();
  initHeroTyping();
});

// =============================================
// Theme Toggle Functionality
// =============================================
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;
  
  const root = document.documentElement;
  const icon = themeToggle.querySelector('i');
  
  // Check for saved theme preference or use default (dark)
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    const currentTheme = root.classList.contains('light-theme') ? 'light' : 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Re-initialize particles with appropriate colors
    resetParticles();
  });
  
  // Set theme function
  function setTheme(theme) {
    if (theme === 'light') {
      root.classList.add('light-theme');
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      themeToggle.classList.add('light');
      // Update profile image for light theme
      const profileImg = document.querySelector('.about-img');
      if (profileImg) {
        profileImg.src = './assets/profile-pic-light.png';
      }
    } else {
      root.classList.remove('light-theme');
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      themeToggle.classList.remove('light');
      // Update profile image for dark theme
      const profileImg = document.querySelector('.about-img');
      if (profileImg) {
        profileImg.src = './assets/profile-pic-dark.png';
      }
    }
  }
}

// =============================================
// Language Toggle Functionality
// =============================================
function initLanguageToggle() {
  const languageToggle = document.getElementById('languageToggle');
  if (!languageToggle) return;
  const flagElement = languageToggle.querySelector('.flag');
  
  // Check for saved language preference or use default (fr)
  let currentLang = localStorage.getItem('language') || 'fr';
  applyLanguage(currentLang);
  
  // Toggle language on button click
  languageToggle.addEventListener('click', () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    applyLanguage(currentLang);
    localStorage.setItem('language', currentLang);
  });
  
  // Apply language to all elements
 function applyLanguage(lang) {
  // Clear any ongoing typing effect BEFORE updating text


  // Update flag display
  if (lang === 'fr') {
    flagElement.classList.add('flag-fr');
    flagElement.classList.remove('flag-en');
  } else {
    flagElement.classList.add('flag-en');
    flagElement.classList.remove('flag-fr');
  }

  // Refresh project gallery if needed
  if (window.projectsGalleryInstance && typeof window.projectsGalleryInstance.renderProjects === 'function') {
    window.projectsGalleryInstance.renderProjects(window.projectsGalleryInstance.activeFilter || 'all');
  }

  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[lang][key];
      } else {
        element.textContent = translations[lang][key];
      }
    } else if (projectTranslations[lang] && projectTranslations[lang][key]) {
      element.textContent = projectTranslations[lang][key];
    }
  });

    clearTypingEffect();

  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) heroSubtitle.textContent = ''; 
  

  if (typeof resetHeroTyping === 'function') {
    resetHeroTyping();
  }
}
}

// =============================================
// Navbar Functionality
// =============================================
function initNavbar() {
  // Navbar scroll effect
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  // Active nav link on scroll
  window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').substring(1) === current) {
        link.classList.add('active');
      }
    });
  });
}

// =============================================
// AOS Animations
// =============================================
function initAnimations() {
  if (typeof AOS !== 'undefined') {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true
    });
  }
}

// =============================================
// Particle Effects
// =============================================
function initParticles() {
  createParticles();
  
  // Create particles at intervals
  setInterval(() => {
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
      createParticle(particlesContainer);
    }
  }, 1000);
}

function resetParticles() {
  const particlesContainer = document.querySelector('.particles-container');
  if (particlesContainer) {
    particlesContainer.innerHTML = '';
    createParticles();
  }
}

function createParticles() {
  const particlesContainer = document.querySelector('.particles-container');
  if (!particlesContainer) return;
  
  // Create initial particles
  for (let i = 0; i < 30; i++) {
    createParticle(particlesContainer);
  }
}

function createParticle(container) {
  const root = document.documentElement;
  const particle = document.createElement('span');
  particle.classList.add('particle');
  
  // Random position
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  
  // Random size
  const size = Math.random() * 8 + 4;
  
  // Random color - different colors for light/dark mode
  let colors;
  if (root.classList.contains('light-theme')) {
    colors = ['#6200EE', '#03DAC6', '#B00020', '#3700B3', '#018786'];
  } else {
    colors = ['#BB86FC', '#03DAC6', '#CF6679', '#8A2BE2', '#4A00E0'];
  }
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  // Random animation duration
  const duration = Math.random() * 6 + 3;
  
  particle.style.width = size + 'px';
  particle.style.height = size + 'px';
  particle.style.left = posX + '%';
  particle.style.top = posY + '%';
  particle.style.backgroundColor = color;
  particle.style.animation = `move ${duration}s infinite linear`;
  
  container.appendChild(particle);
  
  // Remove particle after animation ends
  setTimeout(() => {
    particle.remove();
  }, duration * 1000);
}

// =============================================
// Skill Bars Animation
// =============================================
function initSkillBars() {
  // Create intersection observer for skill bars
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('progress-bar')) {
          const progress = entry.target.getAttribute('data-progress');
          entry.target.style.width = progress + '%';
        }
      }
    });
  }, { threshold: 0.1 });
  
  // Observe all progress bars
  const progressBars = document.querySelectorAll('.progress-bar');
  progressBars.forEach(bar => {
    observer.observe(bar);
  });
}

// =============================================
// Contact Form
// =============================================
function initContactForm() {
  const contactForm = document.querySelector('.contact-form');
  if (!contactForm) return;
  
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get current language
    const lang = localStorage.getItem('language') || 'fr';
    
    // Get form values
    const formData = {
      from_name: contactForm.querySelector('input[type="text"]').value,
      from_email: contactForm.querySelector('input[type="email"]').value,
      subject: contactForm.querySelector('input[placeholder="' + translations[lang].contact_subject + '"]').value,
      message: contactForm.querySelector('textarea').value
    };
    
    // Send email using EmailJS
    if (typeof emailjs !== 'undefined') {
      emailjs.send("service_4co3s35", "template_exicoof", formData)
        .then(() => {
          alert(lang === 'fr' ? "Message envoyé avec succès !" : "Message sent successfully!");
          contactForm.reset();
        })
        .catch((error) => {
          console.error("EmailJS Error:", error);
          alert(lang === 'fr' ? 
            "Une erreur est survenue lors de l'envoi du message." : 
            "An error occurred while sending the message.");
        });
    }
  });
}

// =============================================
// Smooth Scroll
// =============================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70,
          behavior: 'smooth'
        });
        
        // Update URL without reloading page
        history.pushState(null, null, targetId);
      }
    });
  });
}

// =============================================
// Hero Typing Effect
// =============================================
let typingTimeouts = [];

function initHeroTyping() {
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (!heroSubtitle) return;
  
  const lang = localStorage.getItem('language') || 'fr';
  const text = translations[lang].hero_title;
  startTypingEffect(heroSubtitle, text);
}

function resetHeroTyping() {
  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (!heroSubtitle) return;

  var lang = localStorage.getItem('language') || 'fr';
    if(lang == 'fr')  {lang = 'en'} else {lang = 'fr'};

  const text = translations[lang].hero_title;

  startTypingEffect(heroSubtitle, text);
}

function clearTypingEffect() {
  typingTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
  typingTimeouts = [];
}

function startTypingEffect(element, text) {
  clearTypingEffect(); // Clear existing timeouts
  element.textContent = '';

  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      const timeoutId = setTimeout(typeWriter, 100);
      typingTimeouts.push(timeoutId);
    }
  };

  const startTimeoutId = setTimeout(typeWriter, 500);
  typingTimeouts.push(startTimeoutId);
}

// =============================================
// Utility Functions
// =============================================
function isElementInViewport(el) {
  if (!el) return false;
  
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}