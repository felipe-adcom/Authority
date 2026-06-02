/* =========================================================================
   AUTHORITY — Masters in Betting · interactions
   - Sticky header state
   - Mobile menu
   - Accessible services accordion (one open at a time)
   - Scroll reveal (IntersectionObserver)
   - Metric count-up
   - Form: front-end validation + success state
   No external dependencies. Respects prefers-reduced-motion.
   ========================================================================= */
(function () {
  "use strict";
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---- Current year ---- */
  const y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  /* ---- Sticky header ---- */
  const header = $(".site-header");
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const toggle = $(".nav-toggle");
  const menu = $("#mobileMenu");
  if (toggle && menu) {
    const setMenu = (open) => {
      menu.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    $$(".mobile-menu a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  /* ---- Services accordion ---- */
  const acc = $("#servicesAccordion");
  if (acc) {
    const items = $$(".svc", acc);
    const closeItem = (item) => {
      const head = $(".svc__head", item);
      const panel = $(".svc__panel", item);
      item.classList.remove("is-open");
      head.setAttribute("aria-expanded", "false");
      panel.style.height = panel.scrollHeight + "px";
      requestAnimationFrame(() => { panel.style.height = "0px"; });
    };
    const openItem = (item) => {
      const head = $(".svc__head", item);
      const panel = $(".svc__panel", item);
      item.classList.add("is-open");
      head.setAttribute("aria-expanded", "true");
      const inner = $(".svc__panel-inner", panel);
      panel.style.height = inner.offsetHeight + "px";
      // release to auto after transition so it reflows on resize
      panel.addEventListener("transitionend", function te() {
        if (item.classList.contains("is-open")) panel.style.height = "auto";
        panel.removeEventListener("transitionend", te);
      });
    };
    items.forEach((item) => {
      const head = $(".svc__head", item);
      head.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        items.forEach((o) => { if (o !== item && o.classList.contains("is-open")) closeItem(o); });
        isOpen ? closeItem(item) : openItem(item);
      });
    });
    // Open the first by default for context
    if (items[0]) openItem(items[0]);
    // Keep heights correct on resize
    window.addEventListener("resize", () => {
      const open = $(".svc.is-open .svc__panel", acc);
      if (open) open.style.height = "auto";
    });
  }

  /* ---- Scroll reveal ---- */
  const reveal = $$("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    reveal.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveal.forEach((el) => io.observe(el));
  }

  /* ---- Metric count-up ---- */
  const counters = $$("[data-count]");
  if (counters.length && !prefersReduced && "IntersectionObserver" in window) {
    const fmt = (n) => n.toLocaleString("es-CO");
    const run = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || "";
      const dur = 1400; const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { run(en.target); cio.unobserve(en.target); } });
    }, { threshold: 0.5 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---- Hero pointer parallax ---- */
  const heroVisual = $(".hero__visual");
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  if (heroVisual && !prefersReduced && finePointer) {
    const layers = $$("[data-par]", heroVisual);
    const hero = $(".hero");
    let raf = 0, tx = 0, ty = 0;
    const apply = () => {
      raf = 0;
      layers.forEach((el) => {
        const p = parseFloat(el.dataset.par) || 0;
        el.style.setProperty("--px", (tx * p).toFixed(1) + "px");
        el.style.setProperty("--py", (ty * p).toFixed(1) + "px");
      });
    };
    const onMove = (e) => {
      const r = heroVisual.getBoundingClientRect();
      // pointer offset from visual center, clamped, scaled to a travel budget
      tx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2))) * 26;
      ty = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2))) * 26;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const reset = () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); };
    (hero || heroVisual).addEventListener("pointermove", onMove, { passive: true });
    (hero || heroVisual).addEventListener("pointerleave", reset, { passive: true });
  }

  /* ---- Form validation + success ---- */
  const form = $("#diagForm");
  const card = $("#formCard");
  if (form && card) {
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fieldOf = (input) => input.closest(".field");

    const validateField = (input) => {
      const field = fieldOf(input);
      let ok = true;
      if (input.hasAttribute("required") && !input.value.trim()) ok = false;
      if (ok && input.type === "email" && input.value && !emailRe.test(input.value.trim())) ok = false;
      field.classList.toggle("has-error", !ok);
      return ok;
    };

    $$("input, select, textarea", form).forEach((input) => {
      input.addEventListener("blur", () => { if (input.value || input.hasAttribute("required")) validateField(input); });
      input.addEventListener("input", () => { if (fieldOf(input).classList.contains("has-error")) validateField(input); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const required = $$("[required]", form);
      let firstBad = null, allOk = true;
      required.forEach((input) => { if (!validateField(input)) { allOk = false; if (!firstBad) firstBad = input; } });
      if (!allOk) { firstBad && firstBad.focus(); return; }

      // Build the payload that should be sent to a backend.
      const payload = Object.fromEntries(new FormData(form).entries());

      /* ----------------------------------------------------------------
         BACKEND INTEGRATION POINT
         No backend is configured yet. Connect AUTHORITY's CRM / email /
         webhook here. Example:

         fetch("https://your-endpoint/leads", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(payload)
         }).then(...).catch(...);

         For now we log and show the success state.
      ----------------------------------------------------------------- */
      console.log("[AUTHORITY] diagnóstico solicitado:", payload);

      card.classList.add("is-sent");
      card.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "center" });
    });
  }
})();
