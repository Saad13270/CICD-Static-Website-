class WebsiteApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupMobileMenu();
    this.setupScrollEffects();
    this.setupForms();
    this.setupPortfolioFilter();
    this.setupAccordions();
    this.setupModals();
    this.setupSmoothScroll();
    this.setActiveNavLink();
  }

  // Navigation and Mobile Menu
  setupNavigation() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMobile = document.querySelector('.nav__mobile');
    const navMobileLinks = document.querySelectorAll('.nav__mobile-link');

    if (navToggle && navMobile) {
      navToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Close mobile menu when clicking on a link
      navMobileLinks.forEach(link => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });

      // Close mobile menu when pressing ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMobile.classList.contains('nav__mobile--open')) {
          this.closeMobileMenu();
        }
      });

      // Trap focus in mobile menu when open
      this.setupFocusTrap(navMobile);
    }
  }

  toggleMobileMenu() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMobile = document.querySelector('.nav__mobile');

    navToggle.classList.toggle('nav__toggle--active');
    navMobile.classList.toggle('nav__mobile--open');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = navMobile.classList.contains('nav__mobile--open') ? 'hidden' : '';
    
    // Update ARIA attributes
    const isOpen = navMobile.classList.contains('nav__mobile--open');
    navToggle.setAttribute('aria-expanded', isOpen);
    navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  }

  closeMobileMenu() {
    const navToggle = document.querySelector('.nav__toggle');
    const navMobile = document.querySelector('.nav__mobile');

    navToggle.classList.remove('nav__toggle--active');
    navMobile.classList.remove('nav__mobile--open');
    document.body.style.overflow = '';
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  setupMobileMenu() {
    // Set up ARIA attributes
    const navToggle = document.querySelector('.nav__toggle');
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'Open menu');
      navToggle.setAttribute('aria-controls', 'mobile-menu');
    }

    const navMobile = document.querySelector('.nav__mobile');
    if (navMobile) {
      navMobile.setAttribute('id', 'mobile-menu');
    }
  }

  setupFocusTrap(modal) {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Scroll Effects
  setupScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Add shadow to header when scrolled
      if (currentScrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', this.throttle(handleScroll, 100));
  }

  // Set Active Navigation Link
  setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('nav__link--active');
        link.classList.add('nav__mobile-link--active');
      }
    });
  }

  // Form Handling
  setupForms() {
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleContactForm(contactForm);
      });

      // Real-time validation
      const inputs = contactForm.querySelectorAll('input, textarea');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });
    }
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = `${this.capitalizeFirst(fieldName)} is required.`;
    }

    // Email validation
    if (fieldName === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }

    // Show error if invalid
    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('form__input--error');
    
    let errorElement = field.parentNode.querySelector('.form__error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'form__error';
      field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('form__input--error');
    const errorElement = field.parentNode.querySelector('.form__error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  handleContactForm(form) {
    const formData = new FormData(form);
    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;

    // Validate all fields
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Simulate form submission
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        this.showSuccessMessage(form);
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 1500);
    }
  }

  showSuccessMessage(form) {
    let successElement = form.querySelector('.form__success');
    if (!successElement) {
      successElement = document.createElement('div');
      successElement.className = 'form__success';
      form.insertBefore(successElement, form.firstChild);
    }
    successElement.textContent = 'Thank you! Your message has been sent successfully.';
    successElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Portfolio Filter
  setupPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('filter-btn--active'));
        button.classList.add('filter-btn--active');

        // Filter items
        portfolioItems.forEach(item => {
          const categories = item.dataset.category.split(' ');
          if (filter === 'all' || categories.includes(filter)) {
            item.style.display = 'block';
            // Trigger reflow for animation
            item.offsetHeight;
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
              if (item.style.opacity === '0') {
                item.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  // Accordion
  setupAccordions() {
    const accordions = document.querySelectorAll('.accordion__trigger');
    
    accordions.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const content = trigger.nextElementSibling;
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        
        // Close all other accordions in the same group
        const accordionGroup = trigger.closest('.accordion');
        if (accordionGroup) {
          accordionGroup.querySelectorAll('.accordion__trigger').forEach(otherTrigger => {
            if (otherTrigger !== trigger) {
              otherTrigger.setAttribute('aria-expanded', 'false');
              otherTrigger.nextElementSibling.classList.remove('accordion__content--open');
            }
          });
        }
        
        // Toggle current accordion
        trigger.setAttribute('aria-expanded', !isOpen);
        content.classList.toggle('accordion__content--open');
      });
    });
  }

  // Modal System
  setupModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloses = document.querySelectorAll('.modal__close');

    modalTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = trigger.dataset.modal;
        const modal = document.querySelector(`#${modalId}`);
        if (modal) {
          this.openModal(modal);
        }
      });
    });

    modalCloses.forEach(close => {
      close.addEventListener('click', () => {
        const modal = close.closest('.modal');
        this.closeModal(modal);
      });
    });

    modals.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal(modal);
        }
      });

      // Close modal on ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal--open')) {
          this.closeModal(modal);
        }
      });

      this.setupFocusTrap(modal);
    });
  }

  openModal(modal) {
    modal.classList.add('modal--open');
    document.body.style.overflow = 'hidden';
    
    // Focus first focusable element
    const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  closeModal(modal) {
    modal.classList.remove('modal--open');
    document.body.style.overflow = '';
  }

  // Smooth Scroll
  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // Utility Functions
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Animation on scroll (simple intersection observer)
  setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new WebsiteApp();
});

// Handle reduced motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.style.setProperty('--transition-fast', '0ms');
  document.documentElement.style.setProperty('--transition-base', '0ms');
  document.documentElement.style.setProperty('--transition-slow', '0ms');
}

