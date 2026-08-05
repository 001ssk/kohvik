/* ============================================================
   KOHVIK KANEL — interaktsioonid (puhas JS, ilma raamistiketa)
   1. Kleepuv päis (taust kerimisel)
   2. Mobiilimenüü
   3. Scroll-reveal animatsioonid
   4. Hero parallax
   5. Menüü kategooria-tab'id
   6. Tänase lahtiolekupäeva esiletõst
   7. Broneerimisvormi näidiskäitumine
   8. Aasta jaluses
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  // Kas kasutaja eelistab vähem liikumist?
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* 1. ── Kleepuv päis ── */
  const header = document.getElementById("siteHeader");
  const onScrollHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 40);
  };
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* 2. ── Mobiilimenüü ── */
  const toggle = document.getElementById("navToggle");
  const mobileNav = document.getElementById("mobileNav");

  const closeMenu = () => {
    toggle.setAttribute("aria-expanded", "false");
    mobileNav.hidden = true;
  };
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    mobileNav.hidden = open;
  });
  // Sulge menüü lingile klõpsates
  mobileNav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", closeMenu)
  );

  /* 3. ── Scroll-reveal (fade-in üles) ── */
  const revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* 4. ── Hero parallax ── */
  const parallax = document.querySelector("[data-parallax]");
  if (parallax && !reduceMotion) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const y = window.scrollY;
            // Taust liigub aeglasemalt kui leht → sügavustunne
            if (y < window.innerHeight) {
              parallax.style.transform = `translate3d(0, ${y * 0.35}px, 0)`;
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* 5. ── Menüü kategooria-tab'id ── */
  const tabs = document.querySelectorAll(".menu-tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      // Nullime kõik
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".menu-panel").forEach((p) => {
        p.classList.remove("is-active");
        p.hidden = true;
      });
      // Aktiveerime valitud
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      const panel = document.getElementById(
        tab.getAttribute("aria-controls")
      );
      if (panel) {
        panel.hidden = false;
        panel.classList.add("is-active");
      }
    });
  });

  /* 6. ── Broneerimisvorm (näidis) ──
     NB! Praegu andmeid ei saadeta kuhugi. Päris töö jaoks:
     - suuna vorm oma teenusele (nt Formspree action=""), VÕI
     - saada fetch()-iga oma serverisse / e-posti teenusesse. */
  const form = document.getElementById("reserveForm");
  const status = document.getElementById("formStatus");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const name = document.getElementById("rf-name").value.trim();
      status.textContent = `Aitäh, ${name}! Broneering on kätte saadud — saadame kinnituse e-postiga.`;
      status.classList.add("ok");
      form.reset();
    });
  }

  /* 8. ── Jooksev aasta jaluses ── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});