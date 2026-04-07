// gallery/gallery-core.js - Core ProjectsGallery class

// Define the ProjectsGallery class and make it globally available
window.ProjectsGallery = class ProjectsGallery {
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
};