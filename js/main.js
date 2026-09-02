(function () {
  const header = document.getElementById("header");
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  const modal = document.getElementById("contactModal");
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const links = Array.from(document.querySelectorAll(".nav__link"));

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  const sections = ["home", "services", "technologies", "projects", "blog", "about"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const spy = () => {
    const mark = window.scrollY + 140;
    const ordered = sections.slice().sort((a, b) => a.offsetTop - b.offsetTop);
    let current = ordered[0];
    ordered.forEach((section) => {
      if (section.offsetTop <= mark) current = section;
    });
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${current.id}`);
    });
  };

  window.addEventListener("scroll", spy, { passive: true });
  spy();

  const openModal = () => {
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    const field = modal.querySelector("input");
    if (field) field.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (status) status.textContent = "";
  };

  document.querySelectorAll("[data-open-contact]").forEach((el) => {
    el.addEventListener("click", openModal);
  });

  document.querySelectorAll("[data-close-contact]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !email || !message) {
      status.textContent = "Please fill in name, email and message.";
      return;
    }

    status.textContent = "Thanks — we will get back to you shortly.";
    form.reset();
  });

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const formatStat = (value, decimals, suffix) => {
    if (decimals > 0) {
      return value.toFixed(decimals).padStart(4, "0") + suffix;
    }
    return String(Math.round(value)) + suffix;
  };

  const animateStat = (el, duration) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || "";
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatStat(target * eased, decimals, suffix);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = formatStat(target, decimals, suffix);
    };

    requestAnimationFrame(tick);
  };

  const stats = Array.from(document.querySelectorAll(".stat__value"));
  if (stats.length) {
    const play = () => {
      stats.forEach((el, index) => {
        if (prefersReducedMotion) {
          const decimals = Number(el.dataset.decimals || 0);
          const suffix = el.dataset.suffix || "";
          const target = Number(el.dataset.count);
          el.textContent = formatStat(target, decimals, suffix);
          return;
        }
        window.setTimeout(() => animateStat(el, 1400), index * 90);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          play();
          observer.disconnect();
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(document.querySelector(".stats"));
  }
})();
