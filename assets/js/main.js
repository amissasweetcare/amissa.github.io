/**
 * Main JavaScript for Amissa SweetCare Website
 * Handles component loading, navigation, and interactive features
 */

// Global variables
let isMenuOpen = false;
let currentPage = "";

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", function () {
  initializeWebsite();
});

/**
 * Initialize website functionality
 */
async function initializeWebsite() {
  try {
    // Determine current page
    currentPage = getCurrentPage();

    // Load components
    await loadComponents();

    // Initialize navigation
    initializeNavigation();

    // Initialize interactive features
    initializeInteractiveFeatures();

    // Initialize scroll effects
    initializeScrollEffects();

    console.log("🎉 Amissa SweetCare website initialized successfully!");
  } catch (error) {
    console.error("❌ Error initializing website:", error);
    showErrorFallback();
  }
}

/**
 * Get current page name from URL
 */
function getCurrentPage() {
  const path = window.location.pathname;
  const page = path.split("/").pop() || "index.html";
  return page.replace(".html", "") || "index";
}

/**
 * Load navbar and footer components from partials folder
 */
async function loadComponents() {
  const components = [
    { id: "navbar-container", file: "partials/navbar.html" },
    { id: "footer-container", file: "partials/footer.html" },
  ];

  const loadPromises = components.map(async (component) => {
    try {
      const response = await fetch(component.file);
      if (!response.ok) {
        throw new Error(`Failed to load ${component.file}: ${response.status}`);
      }

      const html = await response.text();
      const container = document.getElementById(component.id);

      if (container) {
        container.innerHTML = html;
        console.log(`✅ Loaded ${component.file}`);
      } else {
        console.warn(`⚠️ Container ${component.id} not found`);
      }
    } catch (error) {
      console.error(`❌ Error loading ${component.file}:`, error);
      loadComponentFallback(component.id);
    }
  });

  await Promise.all(loadPromises);

  // Small delay to ensure DOM is updated
  await new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Load fallback content if component loading fails
 */
function loadComponentFallback(componentId) {
  const container = document.getElementById(componentId);
  if (!container) return;

  if (componentId === "navbar-container") {
    container.innerHTML = `
            <nav class="bg-white shadow-lg sticky top-0 z-50">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between items-center h-16">
                        <div class="flex items-center">
                            <span class="text-xl font-bold text-green-600">SWEETCARE</span>
                        </div>
                        <div class="hidden md:flex space-x-8">
                            <a href="index.html" class="text-gray-700 hover:text-green-600">Home</a>
                            <a href="about.html" class="text-gray-700 hover:text-green-600">About</a>
                            <a href="product.html" class="text-gray-700 hover:text-green-600">Product</a>
                            <a href="team.html" class="text-gray-700 hover:text-green-600">Team</a>
                            <a href="gallery.html" class="text-gray-700 hover:text-green-600">Gallery</a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
  } else if (componentId === "footer-container") {
    container.innerHTML = `
            <footer class="bg-gray-800 text-white py-8">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p>&copy; 2025 Amissa SweetCare. All rights reserved.</p>
                </div>
            </footer>
        `;
  }
}

/**
 * Initialize navigation functionality
 */
function initializeNavigation() {
  // Mobile menu toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
        if (isMenuOpen) {
          closeMobileMenu();
        }
      }
    });

    // Close mobile menu on escape key
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMenuOpen) {
        closeMobileMenu();
      }
    });
  }

  // Set active navigation item
  setActiveNavigation();

  // Handle navigation clicks
  const navLinks = document.querySelectorAll("nav a[href]");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Close mobile menu if open
      if (isMenuOpen) {
        closeMobileMenu();
      }

      // Handle smooth scrolling for anchor links
      const href = this.getAttribute("href");
      if (href.startsWith("#")) {
        e.preventDefault();
        scrollToElement(href);
      }
    });
  });
}

/**
 * Toggle mobile menu
 */
function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");

  if (!mobileMenu || !mobileMenuBtn) return;

  isMenuOpen = !isMenuOpen;

  if (isMenuOpen) {
    mobileMenu.classList.add("active");
    mobileMenuBtn.classList.add("active");
    document.body.style.overflow = "hidden";
  } else {
    closeMobileMenu();
  }
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");

  if (!mobileMenu || !mobileMenuBtn) return;

  mobileMenu.classList.remove("active");
  mobileMenuBtn.classList.remove("active");
  document.body.style.overflow = "";
  isMenuOpen = false;
}

/**
 * Set active navigation item based on current page
 */
function setActiveNavigation() {
  const navLinks = document.querySelectorAll("nav a[href]");

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    const linkPage = href.replace(".html", "").replace("index", "") || "index";

    if (
      linkPage === currentPage ||
      (currentPage === "index" && href === "index.html")
    ) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    } else {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    }
  });
}

/**
 * Initialize interactive features
 */
function initializeInteractiveFeatures() {
  // Back to top button
  initializeBackToTop();

  // Newsletter subscription
  initializeNewsletter();

  // Contact form handling
  initializeContactForms();

  // Image lazy loading
  initializeLazyLoading();

  // Smooth scrolling for all anchor links
  initializeSmoothScrolling();

  // Initialize tooltips and popovers
  initializeTooltips();
}

/**
 * Initialize back to top button
 */
function initializeBackToTop() {
  const backToTop = document.getElementById("back-to-top");

  if (backToTop) {
    // Show/hide based on scroll position
    window.addEventListener(
      "scroll",
      throttle(function () {
        if (window.pageYOffset > 300) {
          backToTop.classList.remove("opacity-0", "invisible");
          backToTop.classList.add("opacity-100", "visible");
        } else {
          backToTop.classList.add("opacity-0", "invisible");
          backToTop.classList.remove("opacity-100", "visible");
        }
      }, 100)
    );

    // Click handler
    backToTop.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
}

/**
 * Initialize newsletter subscription
 */
function initializeNewsletter() {
  const newsletterForms = document.querySelectorAll(
    'form[id*="newsletter"], .newsletter-form'
  );

  newsletterForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      handleNewsletterSubmission(this);
    });
  });

  // Handle newsletter buttons (non-form)
  const newsletterButtons = document.querySelectorAll("[data-newsletter-btn]");
  newsletterButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const emailInput = this.parentElement.querySelector(
        'input[type="email"]'
      );
      if (emailInput && emailInput.value) {
        handleNewsletterSubmission(null, emailInput.value);
        this.innerHTML = '<i class="fas fa-check"></i>';
        this.classList.add("bg-green-500");
        setTimeout(() => {
          this.innerHTML = '<i class="fas fa-paper-plane"></i>';
          this.classList.remove("bg-green-500");
          emailInput.value = "";
        }, 2000);
      }
    });
  });
}

/**
 * Handle newsletter subscription
 */
function handleNewsletterSubmission(form, email = null) {
  const emailAddress = email || form.querySelector('input[type="email"]').value;

  if (!isValidEmail(emailAddress)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  // Simulate API call
  showNotification("Subscribing...", "info");

  setTimeout(() => {
    showNotification("Successfully subscribed to newsletter!", "success");
    if (form) form.reset();

    // Track subscription (for analytics)
    trackEvent("Newsletter", "Subscribe", emailAddress);
  }, 1000);
}

/**
 * Initialize contact forms
 */
function initializeContactForms() {
  const contactForms = document.querySelectorAll(
    'form[id*="contact"], .contact-form'
  );

  contactForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      handleContactSubmission(this);
    });

    // Real-time validation
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this);
      });

      input.addEventListener("input", function () {
        clearFieldError(this);
      });
    });
  });
}

/**
 * Handle contact form submission
 */
function handleContactSubmission(form) {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Validate form
  if (!validateContactForm(form)) {
    showNotification("Please correct the errors and try again", "error");
    return;
  }

  // Show loading state
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
  submitBtn.disabled = true;

  // Simulate API call
  setTimeout(() => {
    showNotification(
      "Message sent successfully! We'll get back to you soon.",
      "success"
    );
    form.reset();

    // Reset button
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;

    // Track form submission
    trackEvent("Contact", "Submit", data.subject || "General");
  }, 2000);
}

/**
 * Initialize lazy loading for images
 */
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    images.forEach((img) => {
      img.src = img.dataset.src;
      img.classList.remove("lazy");
    });
  }
}

/**
 * Initialize smooth scrolling
 */
function initializeSmoothScrolling() {
  const scrollLinks = document.querySelectorAll('a[href^="#"]');

  scrollLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      scrollToElement(targetId);
    });
  });
}

/**
 * Initialize tooltips
 */
function initializeTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]");

  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip);
    element.addEventListener("mouseleave", hideTooltip);
  });
}

/**
 * Initialize scroll effects
 */
function initializeScrollEffects() {
  // Navbar background on scroll
  const navbar = document.querySelector("nav");
  if (navbar) {
    window.addEventListener(
      "scroll",
      throttle(function () {
        if (window.pageYOffset > 50) {
          navbar.classList.add("scrolled");
        } else {
          navbar.classList.remove("scrolled");
        }
      }, 100)
    );
  }

  // Fade in animations on scroll
  initializeScrollAnimations();
}

/**
 * Initialize scroll animations
 */
function initializeScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".fade-in-up, .fade-in, .slide-in-left, .slide-in-right"
  );

  if ("IntersectionObserver" in window) {
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    animatedElements.forEach((el) => animationObserver.observe(el));
  }
}

/**
 * Scroll to element smoothly
 */
function scrollToElement(targetId) {
  const target = document.querySelector(targetId);
  if (!target) return;

  const headerOffset = document.querySelector("nav")?.offsetHeight || 0;
  const elementPosition = target.getBoundingClientRect().top;
  const offsetPosition =
    elementPosition + window.pageYOffset - headerOffset - 20;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

/**
 * Utility Functions
 */

// Throttle function for performance
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Debounce function
function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

// Form validation
function validateContactForm(form) {
  let isValid = true;
  const requiredFields = form.querySelectorAll(
    "input[required], textarea[required]"
  );

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(field) {
  const value = field.value.trim();
  const fieldType = field.type;
  const isRequired = field.hasAttribute("required");

  // Clear previous errors
  clearFieldError(field);

  // Required field validation
  if (isRequired && !value) {
    showFieldError(field, "This field is required");
    return false;
  }

  // Type-specific validation
  if (value) {
    switch (fieldType) {
      case "email":
        if (!isValidEmail(value)) {
          showFieldError(field, "Please enter a valid email address");
          return false;
        }
        break;
      case "tel":
        if (!isValidPhone(value)) {
          showFieldError(field, "Please enter a valid phone number");
          return false;
        }
        break;
      case "url":
        try {
          new URL(value);
        } catch {
          showFieldError(field, "Please enter a valid URL");
          return false;
        }
        break;
    }
  }

  return true;
}

function showFieldError(field, message) {
  field.classList.add("error");

  // Remove existing error message
  const existingError = field.parentElement.querySelector(".field-error");
  if (existingError) {
    existingError.remove();
  }

  // Add new error message
  const errorElement = document.createElement("div");
  errorElement.className = "field-error text-red-500 text-sm mt-1";
  errorElement.textContent = message;
  field.parentElement.appendChild(errorElement);
}

function clearFieldError(field) {
  field.classList.remove("error");
  const errorElement = field.parentElement.querySelector(".field-error");
  if (errorElement) {
    errorElement.remove();
  }
}

// Notification system
function showNotification(message, type = "info", duration = 5000) {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification");
  existingNotifications.forEach((notif) => notif.remove());

  const notification = document.createElement("div");
  notification.className = `notification fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;

  // Set colors based on type
  switch (type) {
    case "success":
      notification.classList.add("bg-green-500", "text-white");
      break;
    case "error":
      notification.classList.add("bg-red-500", "text-white");
      break;
    case "warning":
      notification.classList.add("bg-yellow-500", "text-white");
      break;
    default:
      notification.classList.add("bg-blue-500", "text-white");
  }

  notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${message}</span>
            <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);

  // Auto remove
  if (duration > 0) {
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 300);
    }, duration);
  }
}

// Tooltip functions
function showTooltip(e) {
  const element = e.target;
  const tooltipText = element.getAttribute("data-tooltip");

  if (!tooltipText) return;

  const tooltip = document.createElement("div");
  tooltip.className =
    "tooltip absolute bg-gray-800 text-white text-sm rounded px-2 py-1 z-50 pointer-events-none";
  tooltip.textContent = tooltipText;
  tooltip.id = "active-tooltip";

  document.body.appendChild(tooltip);

  // Position tooltip
  const rect = element.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  tooltip.style.left = rect.left + (rect.width - tooltipRect.width) / 2 + "px";
  tooltip.style.top = rect.top - tooltipRect.height - 5 + "px";

  // Ensure tooltip is visible
  if (parseInt(tooltip.style.top) < 0) {
    tooltip.style.top = rect.bottom + 5 + "px";
  }
}

function hideTooltip() {
  const tooltip = document.getElementById("active-tooltip");
  if (tooltip) {
    tooltip.remove();
  }
}

// Analytics tracking
function trackEvent(category, action, label = "", value = 0) {
  // Google Analytics 4
  if (typeof gtag !== "undefined") {
    gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }

  // Console log for development
  console.log("📊 Event tracked:", { category, action, label, value });
}

// Error handling
function showErrorFallback() {
  console.warn("🔄 Loading fallback content...");

  // Show basic navigation if components failed to load
  if (!document.querySelector("nav")) {
    loadComponentFallback("navbar-container");
  }

  if (!document.querySelector("footer")) {
    loadComponentFallback("footer-container");
  }

  showNotification(
    "Some features may be limited. Please refresh the page.",
    "warning",
    10000
  );
}

// Page visibility handling
document.addEventListener("visibilitychange", function () {
  if (document.hidden) {
    // Page is hidden
    console.log("👋 Page hidden");
  } else {
    // Page is visible
    console.log("👁️ Page visible");
    // Refresh dynamic content if needed
  }
});

// Window resize handling
window.addEventListener(
  "resize",
  debounce(function () {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 768 && isMenuOpen) {
      closeMobileMenu();
    }

    // Recalculate any position-dependent elements
    const tooltip = document.getElementById("active-tooltip");
    if (tooltip) {
      hideTooltip();
    }
  }, 250)
);

// Export functions for global access (if needed)
window.AmissaSweetCare = {
  showNotification,
  trackEvent,
  scrollToElement,
  validateField,
  isValidEmail,
  isValidPhone,
};

console.log("📁 main.js loaded successfully!");
