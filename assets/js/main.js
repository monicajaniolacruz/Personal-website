/**
 * Template Name: Personal
 * Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
 * Updated: Aug 07 2024 with Bootstrap v5.3.3
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector("body");
    const selectHeader = document.querySelector("#header");
    if (
      !selectHeader.classList.contains("scroll-up-sticky") &&
      !selectHeader.classList.contains("sticky-top") &&
      !selectHeader.classList.contains("fixed-top")
    )
      return;
    window.scrollY > 100
      ? selectBody.classList.add("scrolled")
      : selectBody.classList.remove("scrolled");
  }

  document.addEventListener("scroll", toggleScrolled);
  window.addEventListener("load", toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function mobileNavToogle() {
    document.querySelector("body").classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll("#navmenu a").forEach((navmenu) => {
    navmenu.addEventListener("click", () => {
      if (document.querySelector(".mobile-nav-active")) {
        mobileNavToogle();
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach((navmenu) => {
    navmenu.addEventListener("click", function (e) {
      e.preventDefault();
      this.parentNode.classList.toggle("active");
      this.parentNode.nextElementSibling.classList.toggle("dropdown-active");
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.style.opacity = "0";
      preloader.style.transition = "opacity 1s ease";
      setTimeout(() => {
        preloader.remove();
      }, 1000);
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100
        ? scrollTop.classList.add("active")
        : scrollTop.classList.remove("active");
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  window.addEventListener("load", toggleScrollTop);
  document.addEventListener("scroll", toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  }
  window.addEventListener("load", aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector(".typed");
  if (selectTyped) {
    let typed_strings = selectTyped.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll(".skills-animation");
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: "80%",
      handler: function (direction) {
        let progress = item.querySelectorAll(".progress .progress-bar");
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  });

  /**
   * Init swiper sliders
   */
  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function (swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({ selector: ".glightbox" });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll(".isotope-layout").forEach(function (isotopeItem) {
    let layout = isotopeItem.getAttribute("data-layout") ?? "masonry";
    let filter = isotopeItem.getAttribute("data-default-filter") ?? "*";
    let sort = isotopeItem.getAttribute("data-sort") ?? "original-order";

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector(".isotope-container"), function () {
      initIsotope = new Isotope(
        isotopeItem.querySelector(".isotope-container"),
        {
          itemSelector: ".isotope-item",
          layoutMode: layout,
          filter: filter,
          sortBy: sort,
        }
      );
    });

    isotopeItem
      .querySelectorAll(".isotope-filters li")
      .forEach(function (filters) {
        filters.addEventListener(
          "click",
          function () {
            isotopeItem
              .querySelector(".isotope-filters .filter-active")
              .classList.remove("filter-active");
            this.classList.add("filter-active");
            initIsotope.arrange({
              filter: this.getAttribute("data-filter"),
            });
            if (typeof aosInit === "function") {
              aosInit();
            }
          },
          false
        );
      });
  });

  // Editable About Section with persistence + save/cancel + keyboard shortcut
  document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.getElementById("editBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const editableContent = document.getElementById("editableContent");
    const status = document.getElementById("status");
    const STORAGE_KEY = "about_section_content_v1";

    if (!editBtn || !editableContent || !status) return;

    let isEditing = false;
    let originalHTML = editableContent.innerHTML;

    // Load saved content if exists
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      editableContent.innerHTML = saved;
      originalHTML = saved;
      status.textContent = "Saved";
    }

    function enterEditMode() {
      isEditing = true;
      editableContent.contentEditable = "true";
      editableContent.focus();
      editBtn.textContent = "Save";
      cancelBtn.style.display = "inline-block";
      status.textContent = "Editing — changes not saved";
      // place caret at end
      placeCaretAtEnd(editableContent);
    }

    function exitEditMode(save = false) {
      isEditing = false;
      editableContent.contentEditable = "false";
      cancelBtn.style.display = "none";

      if (save) {
        const html = editableContent.innerHTML;
        localStorage.setItem(STORAGE_KEY, html);
        originalHTML = html;
        status.textContent = "Saved";
      } else {
        // revert to previous
        editableContent.innerHTML = originalHTML;
        status.textContent = "Changes discarded";
        // short delay then show saved
        setTimeout(() => (status.textContent = "Saved"), 1200);
      }

      editBtn.textContent = "Edit";
    }

    editBtn.addEventListener("click", () => {
      if (!isEditing) {
        enterEditMode();
      } else {
        // Save action
        exitEditMode(true);
      }
    });

    cancelBtn.addEventListener("click", () => {
      if (!isEditing) return;
      exitEditMode(false);
    });

    // Mark as dirty when user types
    editableContent.addEventListener("input", () => {
      if (isEditing) status.textContent = "Editing — changes not saved";
    });

    // Keyboard shortcut: Ctrl/Cmd + S => save
    document.addEventListener("keydown", (e) => {
      const isSave = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s";
      if (isSave && isEditing) {
        e.preventDefault();
        exitEditMode(true);
      }
    });

    // Utility: place caret at end of an element
    function placeCaretAtEnd(el) {
      el.focus();
      if (
        typeof window.getSelection !== "undefined" &&
        typeof document.createRange !== "undefined"
      ) {
        const range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }

    // Optional: a method to reset saved content (for debugging)
    window.resetAboutSection = function () {
      localStorage.removeItem(STORAGE_KEY);
      editableContent.innerHTML = originalHTML;
      status.textContent = "Saved (reset)";
    };
  });

  /**
   * Theme Toggle + Hero Image Switch
   */
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const heroImg = document.querySelector("#hero img");

  function updateHeroImage() {
    if (!heroImg) return; // avoid errors if hero not found
    if (body.classList.contains("light-mode")) {
      heroImg.src = "assets/img/pics/Eternal-life-light.gif";
    } else {
      heroImg.src = "assets/img/pics/Eternal life.gif";
    }
  }

  // Load saved theme
  if (localStorage.getItem("theme") === "light") {
    body.classList.add("light-mode");
    themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
  } else {
    body.classList.add("dark-mode");
    themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
  }

  // Set the correct hero image on load
  updateHeroImage();

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    body.classList.toggle("light-mode");
    body.classList.toggle("dark-mode");

    if (body.classList.contains("light-mode")) {
      themeToggle.innerHTML = '<i class="bi bi-sun"></i>';
      localStorage.setItem("theme", "light");
    } else {
      themeToggle.innerHTML = '<i class="bi bi-moon"></i>';
      localStorage.setItem("theme", "dark");
    }

    updateHeroImage();
  });
})();
