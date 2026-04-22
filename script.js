const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

const menuToggle = document.getElementById("menu-toggle");
const siteNav = document.getElementById("site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const sections = Array.from(document.querySelectorAll("main section[id]"));
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("active", active);
      });
    });
  },
  { threshold: 0.45 }
);

sections.forEach((section) => navObserver.observe(section));

const revealEls = document.querySelectorAll(".fade-in");
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.16 }
);

revealEls.forEach((el) => revealObserver.observe(el));

const photoGrid = document.querySelector(".photo-grid");
const photoLightbox = document.getElementById("photo-lightbox");
const photoLightboxImage = document.getElementById("photo-lightbox-image");
const photoLightboxClose = document.getElementById("photo-lightbox-close");

if (photoGrid && photoLightbox && photoLightboxImage && photoLightboxClose) {
  const openLightbox = (sourceImage) => {
    const src = sourceImage.getAttribute("src");
    if (!src) return;

    photoLightboxImage.setAttribute("src", src);
    photoLightboxImage.setAttribute("alt", sourceImage.getAttribute("alt") || "Expanded photo");
    photoLightbox.classList.add("open");
    photoLightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    photoLightbox.classList.remove("open");
    photoLightbox.setAttribute("aria-hidden", "true");
    photoLightboxImage.setAttribute("src", "");
    document.body.style.overflow = "";
  };

  photoGrid.querySelectorAll("img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => openLightbox(img));
  });

  photoGrid.querySelectorAll(".photo-card").forEach((card) => {
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      const image = card.querySelector("img");
      if (!image) return;
      event.preventDefault();
      openLightbox(image);
    });
  });

  photoLightboxClose.addEventListener("click", closeLightbox);
  photoLightbox.addEventListener("click", (event) => {
    if (event.target === photoLightbox) {
      closeLightbox();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && photoLightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

const cursorGlow = document.getElementById("cursor-glow");
if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  let glowX = window.innerWidth / 2;
  let glowY = window.innerHeight / 2;

  window.addEventListener("mousemove", (event) => {
    glowX = event.clientX;
    glowY = event.clientY;
    cursorGlow.style.opacity = "1";
  });

  window.addEventListener("mouseleave", () => {
    cursorGlow.style.opacity = "0";
  });

  function animateGlow() {
    cursorGlow.style.left = `${glowX}px`;
    cursorGlow.style.top = `${glowY}px`;
    requestAnimationFrame(animateGlow);
  }

  animateGlow();
}

const canvas = document.getElementById("particle-canvas");
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {
  const particles = [];
  const count = 65;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.55,
      vy: (Math.random() - 0.5) * 0.55,
      radius: Math.random() * 1.8 + 0.6,
    };
  }

  function init() {
    resize();
    particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(103, 232, 249, 0.85)";
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.hypot(dx, dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${1 - dist / 110})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  init();
  draw();
  window.addEventListener("resize", init);
}
