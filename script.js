document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const scrollProgress = document.getElementById("scroll-progress");
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const yearSpan = document.getElementById("year");
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const lightboxClose = document.querySelector(".lightbox-close");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const featureCards = document.querySelectorAll(".feature-card.feature-fade");
  const revealElements = document.querySelectorAll(".reveal");
  const contactForm = document.getElementById("contactForm");
  const successPopup = document.getElementById("successPopup");
  const popupClose = document.querySelector(".popup-close");
  const popupOk = document.querySelector(".popup-ok");

  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  if (hamburger && navbar) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navbar.classList.toggle("open");
    });

    navbar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navbar.classList.contains("open")) {
          navbar.classList.remove("open");
          hamburger.classList.remove("active");
        }
      });
    });
  }

  const handleScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${scrolled}%`;
    }

    if (header) {
      if (scrollY > 80) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }

    if (scrollTopBtn) {
      if (scrollY > 300) scrollTopBtn.classList.add("visible");
      else scrollTopBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", handleScroll);
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = header ? header.offsetHeight : 0;
        const elementPosition = targetElem.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerOffset + 5;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.25,
    }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  const featureObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  featureCards.forEach((card) => featureObserver.observe(card));

  const openLightbox = (src) => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = src;
    lightbox.classList.add("open");
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("open");
    if (lightboxImage) lightboxImage.src = "";
  };

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img");
      if (img && img.src) {
        openLightbox(img.src);
      }
    });
  });

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhone = (phone) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length >= 7;
  };

  const showError = (input, message) => {
    input.classList.add("error");
    const errorSpan = input.parentElement.querySelector(".error-message");
    if (errorSpan) errorSpan.textContent = message;
  };

  const clearError = (input) => {
    input.classList.remove("error");
    const errorSpan = input.parentElement.querySelector(".error-message");
    if (errorSpan) errorSpan.textContent = "";
  };

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = contactForm.querySelector("#name");
      const phoneInput = contactForm.querySelector("#phone");
      const emailInput = contactForm.querySelector("#email");
      const messageInput = contactForm.querySelector("#message");

      let isValid = true;

      if (!nameInput.value.trim()) {
        showError(nameInput, "Please enter your name.");
        isValid = false;
      } else {
        clearError(nameInput);
      }

      if (!phoneInput.value.trim()) {
        showError(phoneInput, "Please enter your phone number.");
        isValid = false;
      } else if (!validatePhone(phoneInput.value.trim())) {
        showError(phoneInput, "Please enter a valid phone number.");
        isValid = false;
      } else {
        clearError(phoneInput);
      }

      if (!emailInput.value.trim()) {
        showError(emailInput, "Please enter your email.");
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        showError(emailInput, "Please enter a valid email address.");
        isValid = false;
      } else {
        clearError(emailInput);
      }

      if (!messageInput.value.trim()) {
        showError(messageInput, "Please enter a message.");
        isValid = false;
      } else {
        clearError(messageInput);
      }

      if (!isValid) return;

      contactForm.reset();
      if (successPopup) {
        successPopup.classList.add("open");
      }
    });
  }

  const closePopup = () => {
    if (successPopup) successPopup.classList.remove("open");
  };

  if (popupClose) popupClose.addEventListener("click", closePopup);
  if (popupOk) popupOk.addEventListener("click", closePopup);
  if (successPopup) {
    successPopup.addEventListener("click", (e) => {
      if (e.target === successPopup) closePopup();
    });
  }
});

