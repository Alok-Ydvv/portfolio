const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile navigation toggle
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.getElementById("nav-links");

const setMenu = (open) => {
  navLinks.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
};

navToggle.addEventListener("click", () => {
  setMenu(!navLinks.classList.contains("is-open"));
});

// Close the mobile menu when a link is tapped
navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

// Header shadow + back-to-top visibility on scroll
const header = document.querySelector(".site-header");
const backToTop = document.getElementById("back-to-top");

const onScroll = () => {
  const y = window.scrollY;
  header.classList.toggle("is-scrolled", y > 10);
  backToTop.classList.toggle("is-visible", y > 600);
};

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Highlight the nav link for the section currently in view
const navAnchors = document.querySelectorAll("[data-nav]");
const sectionMap = new Map();

navAnchors.forEach((a) => {
  const target = document.querySelector(a.getAttribute("href"));
  if (target) sectionMap.set(target, a);
});

const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navAnchors.forEach((a) => a.classList.remove("is-active"));
      const link = sectionMap.get(entry.target);
      if (link) link.classList.add("is-active");
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);

sectionMap.forEach((_, section) => activeObserver.observe(section));

// Typing effect in the hero
const typedEl = document.getElementById("typed");
const phrases = [
  "Building with Python & Django",
  "Crafting mobile apps with Flutter",
  "Creating UIs with React",
  "Exploring FastAPI, LangChain & FAISS",
];

if (typedEl) {
  if (prefersReducedMotion) {
    typedEl.textContent = phrases[0];
  } else {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, 1800);
          return;
        }
        setTimeout(tick, 70);
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 400);
          return;
        }
        setTimeout(tick, 35);
      }
    };

    tick();
  }
}

// Mouse-follow spotlight on cards
if (!prefersReducedMotion) {
  document.querySelectorAll("[data-glow]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  });
}

// Fade-in elements as they scroll into view
const revealTargets = document.querySelectorAll(
  ".about-grid > *, .skills-grid > *, .projects-grid > *, .timeline-item, .stat, .contact-card, .section-title, .contact-lead"
);

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  revealTargets.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}
