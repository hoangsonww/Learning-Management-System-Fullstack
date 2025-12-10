/**
 * Learning Management System Wiki
 * Interactive Features & Animations
 */

// ===================================
// Smooth Scroll & Navigation
// ===================================

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all features
  initNavigation();
  initScrollEffects();
  initProgressBar();
  initTabs();
  initCopyButtons();
  initMermaidDiagrams();
  initAnimations();
  initStats();
  initThemeToggle();
});

// Navigation functionality
function initNavigation() {
  const nav = document.querySelector("nav");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");

  // Scroll effect on navigation
  let lastScroll = 0;
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }

    // Close mobile menu on scroll
    if (navLinks && navLinks.classList.contains("active")) {
      navLinks.classList.remove("active");
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = "☰";
      }
    }

    lastScroll = currentScroll;
  });

  // Mobile menu toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isActive = navLinks.classList.toggle("active");
      mobileMenuBtn.innerHTML = isActive ? "✕" : "☰";

      // Prevent body scroll when menu is open
      if (isActive) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    });
  }

  // Close mobile menu when clicking a link
  const navLinkItems = document.querySelectorAll(".nav-links a");
  navLinkItems.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks) {
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
      }
      if (mobileMenuBtn) {
        mobileMenuBtn.innerHTML = "☰";
      }
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", (e) => {
    if (navLinks && navLinks.classList.contains("active")) {
      if (!nav.contains(e.target)) {
        navLinks.classList.remove("active");
        document.body.style.overflow = "";
        if (mobileMenuBtn) {
          mobileMenuBtn.innerHTML = "☰";
        }
      }
    }
  });

  // Highlight active section in navigation
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute("id");
      }
    });

    navLinkItems.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href").includes(current)) {
        link.classList.add("active");
      }
    });
  });
}

// ===================================
// Scroll Progress Bar
// ===================================

function initProgressBar() {
  const progressBar = document.getElementById("progressBar");

  window.addEventListener("scroll", () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Calculate scroll percentage
    const scrollPercentage =
      (scrollTop / (documentHeight - windowHeight)) * 100;

    // Update progress bar width
    progressBar.style.width = scrollPercentage + "%";
  });
}

// ===================================
// Scroll Effects
// ===================================

function initScrollEffects() {
  // Scroll to top button
  const scrollTopBtn = document.querySelector(".scroll-top");

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // Reveal animations on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document
    .querySelectorAll(".card, .stat-card, .timeline-item")
    .forEach((el) => {
      observer.observe(el);
    });
}

// ===================================
// Tabs Functionality
// ===================================

function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabGroup =
        button.closest(".tabs").getAttribute("data-tab-group") || "default";
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all buttons in this group
      document
        .querySelectorAll(`[data-tab-group="${tabGroup}"] .tab-btn`)
        .forEach((btn) => {
          btn.classList.remove("active");
        });

      // Add active class to clicked button
      button.classList.add("active");

      // Hide all tab contents in this group
      document
        .querySelectorAll(`.tab-content[data-tab-group="${tabGroup}"]`)
        .forEach((content) => {
          content.classList.remove("active");
        });

      // Show target tab content
      const targetContent = document.querySelector(
        `[data-tab="${targetTab}"][data-tab-group="${tabGroup}"].tab-content`,
      );
      if (targetContent) {
        targetContent.classList.add("active");
      }
    });
  });
}

// ===================================
// Copy Code Functionality
// ===================================

function initCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const codeBlock = button.closest(".code-block");
      const code = codeBlock.querySelector("code").textContent;

      try {
        await navigator.clipboard.writeText(code);
        const originalText = button.textContent;
        button.textContent = "✓ Copied!";
        button.style.background = "#10b981";

        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = "";
        }, 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
        button.textContent = "✗ Error";
        button.style.background = "#ef4444";

        setTimeout(() => {
          button.textContent = "Copy";
          button.style.background = "";
        }, 2000);
      }
    });
  });
}

// ===================================
// Mermaid Diagrams
// ===================================

function initMermaidDiagrams() {
  if (typeof mermaid !== "undefined") {
    mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      themeVariables: {
        darkMode: true,
        background: "#1e293b",
        primaryColor: "#2563eb",
        primaryTextColor: "#f1f5f9",
        primaryBorderColor: "#334155",
        lineColor: "#64748b",
        secondaryColor: "#7c3aed",
        tertiaryColor: "#06b6d4",
        fontFamily: "Inter, sans-serif",
      },
      flowchart: {
        curve: "basis",
        padding: 20,
      },
      sequence: {
        actorMargin: 50,
        width: 150,
        height: 65,
        boxMargin: 10,
      },
    });
  }
}

// ===================================
// Animated Statistics
// ===================================

function initStats() {
  const stats = document.querySelectorAll(".stat-number");

  const animateValue = (element, start, end, duration) => {
    const startTime = performance.now();
    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeOutQuad = progress * (2 - progress);
      const value = Math.floor(start + (end - start) * easeOutQuad);

      element.textContent = value + (element.getAttribute("data-suffix") || "");

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  };

  const observerOptions = {
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const endValue = parseInt(
          stat.getAttribute("data-value") || stat.textContent,
        );
        animateValue(stat, 0, endValue, 2000);
        observer.unobserve(stat);
      }
    });
  }, observerOptions);

  stats.forEach((stat) => {
    const value = stat.textContent.replace(/\D/g, "");
    stat.setAttribute("data-value", value);
    stat.textContent = "0" + stat.textContent.replace(/\d/g, "");
    observer.observe(stat);
  });
}

// ===================================
// Animation Classes
// ===================================

function initAnimations() {
  // Add stagger animation delays
  document.querySelectorAll(".cards-grid .card").forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
  });

  // Parallax effect on hero
  const hero = document.querySelector(".hero");
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      hero.style.transform = `translateY(${scrolled * 0.5}px)`;
      hero.style.opacity = 1 - scrolled / 600;
    });
  }
}

// ===================================
// Theme Toggle (Optional)
// ===================================

function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  if (!themeToggle) return;

  const currentTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", currentTheme);

  themeToggle.addEventListener("click", () => {
    const theme = document.documentElement.getAttribute("data-theme");
    const newTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

// ===================================
// Search Functionality
// ===================================

function initSearch() {
  const searchInput = document.getElementById("search");
  if (!searchInput) return;

  const searchableElements = document.querySelectorAll(
    "section, .card, h2, h3, p",
  );

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.toLowerCase();

    searchableElements.forEach((element) => {
      const text = element.textContent.toLowerCase();
      const parent = element.closest(".card, section");

      if (text.includes(searchTerm) || searchTerm === "") {
        if (parent) parent.style.display = "";
        element.style.display = "";
      } else {
        if (parent) parent.style.display = "none";
      }
    });
  });
}

// ===================================
// Modal Functionality
// ===================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "flex";
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "";
  }
}

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
    document.body.style.overflow = "";
  }
});

// ===================================
// Tooltip Functionality
// ===================================

function initTooltips() {
  const tooltips = document.querySelectorAll("[data-tooltip]");

  tooltips.forEach((element) => {
    element.addEventListener("mouseenter", (e) => {
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip";
      tooltip.textContent = element.getAttribute("data-tooltip");
      document.body.appendChild(tooltip);

      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${rect.left + rect.width / 2}px`;
      tooltip.style.top = `${rect.top - 40}px`;
      tooltip.style.transform = "translateX(-50%)";
    });

    element.addEventListener("mouseleave", () => {
      const tooltip = document.querySelector(".tooltip");
      if (tooltip) tooltip.remove();
    });
  });
}

// ===================================
// Loading State
// ===================================

function showLoading(element) {
  element.innerHTML = '<span class="loading"></span>';
  element.disabled = true;
}

function hideLoading(element, originalContent) {
  element.innerHTML = originalContent;
  element.disabled = false;
}

// ===================================
// API Request Helper
// ===================================

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok");
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    return null;
  }
}

// ===================================
// Utility Functions
// ===================================

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ===================================
// Export functions for external use
// ===================================

window.LMSWiki = {
  openModal,
  closeModal,
  showLoading,
  hideLoading,
  fetchData,
  debounce,
  throttle,
};

// ===================================
// Easter Egg
// ===================================

let konamiCode = [];
const konamiSequence = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

document.addEventListener("keydown", (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join("") === konamiSequence.join("")) {
    document.body.style.animation = "rainbow 2s linear infinite";
    setTimeout(() => {
      document.body.style.animation = "";
    }, 5000);
  }
});

// ===================================
// Performance Monitoring
// ===================================

if (window.performance && window.performance.timing) {
  window.addEventListener("load", () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
  });
}

// Console welcome message
console.log(
  "%c🚀 Learning Management System Wiki",
  "font-size: 20px; font-weight: bold; color: #2563eb;",
);
console.log(
  "%cBuilt with ❤️ using Angular, Django, MongoDB & Redis",
  "font-size: 14px; color: #7c3aed;",
);
console.log(
  "%cGitHub: https://github.com/hoangsonww/Learning-Management-System-Fullstack",
  "font-size: 12px; color: #06b6d4;",
);
