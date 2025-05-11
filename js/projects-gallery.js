// projects-gallery.js - All gallery functionality in one file

// Define the ProjectsGallery class
class ProjectsGallery {
  constructor() {
    // DOM elements
    this.projectsContainer = document.getElementById('projects-container');
    this.paginationContainer = document.getElementById('slider-pagination');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    
    // State variables
    this.activeFilter = 'all';
    this.currentPosition = 0;
    this.projectsPerPage = this.calculateProjectsPerPage();
    this.filteredProjects = [];
    this.activeGallery = null;

    // Initialize if the container exists
    if (this.projectsContainer) {
      this.init();
    }
  }
  
  // Initialize the gallery
  init() {
    // Remove loading placeholder
    this.projectsContainer.innerHTML = '';
    
    // Setup filter buttons
    this.setupFilterButtons();
    
    // Setup navigation buttons
    this.setupNavButtons();
    
    // Setup swipe functionality
    this.setupSwipeHandling();
    
    // Handle window resize
    window.addEventListener('resize', () => {
      const newProjectsPerPage = this.calculateProjectsPerPage();
      if (newProjectsPerPage !== this.projectsPerPage) {
        this.projectsPerPage = newProjectsPerPage;
        this.currentPosition = 0;
        this.updateSliderPosition();
        this.setupPagination();
      }
    });
    
    // Initial render
    this.renderProjects('all');
  }
  
  // Calculate visible projects based on screen size
  calculateProjectsPerPage() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 1200) return 3;
    if (viewportWidth >= 768) return 2;
    return 1;
  }
  
  // ----- NAVIGATION METHODS -----
  
  // Setup filter buttons
  setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter projects
        const filter = button.getAttribute('data-filter');
        this.activeFilter = filter;
        this.renderProjects(filter);
        
        // Reset position
        this.currentPosition = 0;
        this.updateSliderPosition();
      });
    });
  }
  
  // Setup navigation buttons
  setupNavButtons() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => {
        this.navigateSlider('prev');
      });
    }
    
    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => {
        this.navigateSlider('next');
      });
    }
  }
  
  // Setup swipe functionality
  setupSwipeHandling() {
    let touchStartX = 0;
    let touchEndX = 0;
    
    this.projectsContainer.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    this.projectsContainer.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });
  }
  
  // Handle swipe gesture
  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    if (endX < startX - swipeThreshold) {
      // Swipe left - next slide
      this.navigateSlider('next');
    } else if (endX > startX + swipeThreshold) {
      // Swipe right - previous slide
      this.navigateSlider('prev');
    }
  }
  
  // Navigate slider
  navigateSlider(direction) {
    const maxPosition = Math.max(0, this.filteredProjects.length - this.projectsPerPage);
    
    if (direction === 'prev') {
      this.currentPosition = Math.max(0, this.currentPosition - 1);
    } else {
      this.currentPosition = Math.min(maxPosition, this.currentPosition + 1);
    }
    
    this.updateSliderPosition();
    this.updateActivePaginationDot();
  }
  
  // Update slider position
  updateSliderPosition() {
    const cardWidth = this.projectsContainer.querySelector('.project-card')?.offsetWidth || 370;
    const cardMargin = 20; // Gap between cards
    const offset = this.currentPosition * -(cardWidth + cardMargin);
    
    this.projectsContainer.style.transform = `translateX(${offset}px)`;
    
    // Update button states
    this.updateNavigationState();
  }
  
  // Update navigation button states
  updateNavigationState() {
    const maxPosition = Math.max(0, this.filteredProjects.length - this.projectsPerPage);
    
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentPosition === 0;
      this.prevBtn.style.opacity = this.currentPosition === 0 ? '0.3' : '0.7';
    }
    
    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentPosition >= maxPosition;
      this.nextBtn.style.opacity = this.currentPosition >= maxPosition ? '0.3' : '0.7';
    }
  }
  
  // ----- RENDERING METHODS -----
  
  // Render projects based on filter
  renderProjects(filter) {
    // Clear existing projects
    this.projectsContainer.innerHTML = '';
    
    // Get current language
    const currentLang = localStorage.getItem('language') || 'fr';
    
    // Filter projects
    if (filter === 'featured') {
      // Example: projects with ids 1, 2, 5 are featured
      this.filteredProjects = projects.filter(project => [1, 2, 5].includes(project.id));
    } else {
      this.filteredProjects = [...projects];
    }
    
    // Check if there are projects to display
    if (this.filteredProjects.length === 0) {
      const noProjectsMsg = document.createElement('div');
      noProjectsMsg.className = 'no-projects-message';
      noProjectsMsg.setAttribute('data-i18n', 'noProjects');
      noProjectsMsg.textContent = translations[currentLang].noProjects;
      this.projectsContainer.appendChild(noProjectsMsg);
      
      // Hide pagination and navigation
      if (this.paginationContainer) this.paginationContainer.innerHTML = '';
      if (this.prevBtn) this.prevBtn.style.display = 'none';
      if (this.nextBtn) this.nextBtn.style.display = 'none';
      
      return;
    }
    
    // Show navigation buttons
    if (this.prevBtn) this.prevBtn.style.display = 'flex';
    if (this.nextBtn) this.nextBtn.style.display = 'flex';
    
    // Create project cards
    this.filteredProjects.forEach(project => {
      const card = this.createProjectCard(project, currentLang);
      this.projectsContainer.appendChild(card);
    });
    
    // Update state
    this.updateNavigationState();
    this.setupPagination();
  }
  
  // Create a project card with gallery functionality
  createProjectCard(project, lang) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('data-aos', 'fade-up');
    
    // Get translations for this project
    const projectId = project.id;
    const title = projectTranslations[lang][`project${projectId}_title`] || '';
    const description = projectTranslations[lang][`project${projectId}_desc`] || '';
    const tags = project.tags || [];
    
    // Image gallery container
    const imgContainer = document.createElement('div');
    imgContainer.className = 'project-img-gallery';
    
    // Main image container with first image
    const imgMain = document.createElement('div');
    imgMain.className = 'project-img';
    
    const img = document.createElement('img');
    img.src = project.images[0];
    img.alt = title;
    imgMain.appendChild(img);
    
    // Add image count badge if multiple images
    if (project.images.length > 0) {
      const imgCount = document.createElement('div');
      imgCount.className = 'image-count';
      imgCount.innerHTML = `<i class="fas fa-images"></i> ${project.images.length}`;
      imgMain.appendChild(imgCount);
      
      // Make clickable only if multiple images
      imgMain.classList.add('has-gallery');
      imgMain.addEventListener('click', () => {
        this.openGallery(project, lang);
      });
    }
    
    imgContainer.appendChild(imgMain);
    
    // Project content
    const content = document.createElement('div');
    content.className = 'project-content';
    
    // Title
    const titleEl = document.createElement('h3');
    titleEl.className = 'project-title';
    titleEl.textContent = title;
    titleEl.setAttribute('data-i18n', `project${projectId}_title`);
    
    // Tags
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'project-tags';
    
    tags.forEach(tag => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag';
      tagEl.textContent = tag;
      tagsContainer.appendChild(tagEl);
    });
    
    // Description
    const descEl = document.createElement('p');
    descEl.className = 'project-description';
    descEl.textContent = description;
    descEl.setAttribute('data-i18n', `project${projectId}_desc`);
    
    // Link
    const link = document.createElement('a');
    link.className = 'project-link';
    link.href = project.link;
    
    const linkIcon = project.isPublic ? 
      '<i class="fas fa-external-link-alt me-2"></i>' : 
      '<i class="fas fa-lock me-2"></i>';
     
    const linkText = project.isPublic ? 
      projectTranslations[lang].viewProject : 
      projectTranslations[lang].privateProject;
      
    link.innerHTML = `${linkIcon}<span>${linkText}</span>`;
    link.setAttribute('data-i18n', `project${projectId}_link`);
    
    // Assemble the card
    content.appendChild(titleEl);
    content.appendChild(tagsContainer);
    content.appendChild(descEl);
    content.appendChild(link);
    
    card.appendChild(imgContainer);
    card.appendChild(content);
    
    return card;
  }
  
  // ----- MODAL METHODS -----
  
  // Open gallery modal
  openGallery(project, lang) {
    // Create modal overlay
    const galleryModal = document.createElement('div');
    galleryModal.className = 'gallery-modal';
    
    // Create gallery content
    const galleryContent = document.createElement('div');
    galleryContent.className = 'gallery-content';
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'gallery-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.setAttribute('title', translations[lang].closeGallery);
    closeBtn.addEventListener('click', () => {
      document.body.removeChild(galleryModal);
      document.body.classList.remove('modal-open');
      this.activeGallery = null;
    });
    
    // Create main image container
    const imgContainer = document.createElement('div');
    imgContainer.className = 'gallery-images';
    
    // Main image display
    const mainImg = document.createElement('div');
    mainImg.className = 'gallery-main-image';
    
    const img = document.createElement('img');
    img.src = project.images[0];
    img.alt = projectTranslations[lang][`project${project.id}_title`] || '';
    mainImg.appendChild(img);
    
    // Navigation buttons
    const navPrev = document.createElement('button');
    navPrev.className = 'gallery-nav gallery-prev';
    navPrev.innerHTML = '<i class="fas fa-chevron-left"></i>';
    navPrev.setAttribute('title', translations[lang].prevImage);
    
    const navNext = document.createElement('button');
    navNext.className = 'gallery-nav gallery-next';
    navNext.innerHTML = '<i class="fas fa-chevron-right"></i>';
    navNext.setAttribute('title', translations[lang].nextImage);
    
    // Image counter
    const counter = document.createElement('div');
    counter.className = 'gallery-counter';
    
    // Thumbnails container
    const thumbsContainer = document.createElement('div');
    thumbsContainer.className = 'gallery-thumbnails';
    
    // Current image index
    let currentIndex = 0;
    
    // Create thumbnails
    project.images.forEach((imgSrc, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'gallery-thumb';
      if (index === 0) thumb.classList.add('active');
      
      const thumbImg = document.createElement('img');
      thumbImg.src = imgSrc;
      thumbImg.alt = `${projectTranslations[lang][`project${project.id}_title`]} - ${index + 1}`;
      
      thumb.appendChild(thumbImg);
      thumb.addEventListener('click', () => {
        currentIndex = index;
        updateGalleryImage();
      });
      
      thumbsContainer.appendChild(thumb);
    });
    
    // Update gallery image
    const updateGalleryImage = () => {
      // Update main image
      img.src = project.images[currentIndex];
      
      // Update counter
      counter.textContent = projectTranslations[lang].imageCounter
        .replace('{current}', currentIndex + 1)
        .replace('{total}', project.images.length);
      
      // Update thumbnails
      const thumbs = thumbsContainer.querySelectorAll('.gallery-thumb');
      thumbs.forEach((thumb, idx) => {
        if (idx === currentIndex) {
          thumb.classList.add('active');
        } else {
          thumb.classList.remove('active');
        }
      });
      
      // Update navigation buttons
      navPrev.style.opacity = currentIndex > 0 ? '1' : '0.3';
      navNext.style.opacity = currentIndex < project.images.length - 1 ? '1' : '0.3';
    };
    
    // Add event listeners for navigation
    navPrev.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateGalleryImage();
      }
    });
    
    navNext.addEventListener('click', () => {
      if (currentIndex < project.images.length - 1) {
        currentIndex++;
        updateGalleryImage();
      }
    });
    
    // Add keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        if (currentIndex > 0) {
          currentIndex--;
          updateGalleryImage();
        }
      } else if (e.key === 'ArrowRight') {
        if (currentIndex < project.images.length - 1) {
          currentIndex++;
          updateGalleryImage();
        }
      } else if (e.key === 'Escape') {
  if (document.body.contains(galleryModal)) {
    document.body.removeChild(galleryModal);
  }
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleKeyDown);
  this.activeGallery = null;
}
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    // Initialize gallery
    updateGalleryImage();
    
    // Assemble the gallery
    imgContainer.appendChild(navPrev);
    imgContainer.appendChild(mainImg);
    imgContainer.appendChild(counter);
    imgContainer.appendChild(navNext);
    
    galleryContent.appendChild(closeBtn);
    galleryContent.appendChild(imgContainer);
    galleryContent.appendChild(thumbsContainer);
    
    galleryModal.appendChild(galleryContent);
    
    // Add to body and track active gallery
    document.body.appendChild(galleryModal);
    document.body.classList.add('modal-open');
    this.activeGallery = galleryModal;
    
    // Animate entrance
    setTimeout(() => {
      galleryModal.classList.add('show');
    }, 10);
  }
  
  // ----- PAGINATION METHODS -----
  
  // Setup pagination
  setupPagination() {
    if (!this.paginationContainer) return;
    
    this.paginationContainer.innerHTML = '';
    
    const totalPages = Math.ceil(this.filteredProjects.length-2);
    
    // Skip pagination if only one page
    if (totalPages <= 1) return;
    
    // Create pagination dots
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('div');
      dot.className = `pagination-dot ${i === this.currentPosition ? 'active' : ''}`;
      
      dot.addEventListener('click', () => {
        this.currentPosition = i;
        this.updateSliderPosition();
        this.updateActivePaginationDot();
      });
      
      this.paginationContainer.appendChild(dot);
    }
  }
  
  // Update active pagination dot
  updateActivePaginationDot() {
    if (!this.paginationContainer) return;
    
    const dots = this.paginationContainer.querySelectorAll('.pagination-dot');
    dots.forEach((dot, index) => {
      if (index === this.currentPosition) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create and initialize projects gallery
  window.projectsGalleryInstance = new ProjectsGallery();
});