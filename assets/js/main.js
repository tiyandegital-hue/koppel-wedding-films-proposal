/* ============================================================
   SITE CONFIG — one swappable place.
   BUSINESS_NAME is a PLACEHOLDER: the lead's real business name
   is UNCONFIRMED. Confirm with Christian Koppel before presenting
   this name as fact. Swap the string below and every page updates.
   ============================================================ */
const SITE = {
  BUSINESS_NAME: "Koppel Wedding Films", // [PLACEHOLDER — confirm with Christian]
  MONOGRAM: "CK",
  YEAR: new Date().getFullYear()
};

(function () {
  // Inject business name + year wherever [data-site] appears
  document.querySelectorAll("[data-site='name']").forEach(function (el) {
    el.textContent = SITE.BUSINESS_NAME;
  });
  document.querySelectorAll("[data-site='year']").forEach(function (el) {
    el.textContent = SITE.YEAR;
  });
  document.title = document.title.replace(/\{\{SITE_NAME\}\}/g, SITE.BUSINESS_NAME);

  // Mobile nav
  var burger = document.getElementById("burger");
  var links = document.getElementById("navLinks");
  if (burger && links) {
    burger.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      burger.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); burger.classList.remove("open"); });
    });
  }

  // Active nav link
  var page = document.body.getAttribute("data-page");
  if (page && links) {
    links.querySelectorAll("a[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === page) a.classList.add("active");
    });
  }

  // Reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  // Films filter
  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll(".film-card");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("on"); });
      chip.classList.add("on");
      var f = chip.getAttribute("data-filter");
      cards.forEach(function (card) {
        card.classList.toggle("hide", f !== "all" && card.getAttribute("data-format") !== f);
      });
    });
  });

  // Film detail modal
  var modal = document.getElementById("filmModal");
  if (modal) {
    var mTitle = modal.querySelector("[data-m='title']");
    var mMeta = modal.querySelector("[data-m='meta']");
    var mStill = modal.querySelector("[data-m='still']");
    var mStory = modal.querySelector("[data-m='story']");
    var order = Array.prototype.slice.call(cards);
    var idx = 0;

    function fill(i) {
      var c = order[i];
      mTitle.textContent = c.getAttribute("data-couple");
      mMeta.textContent = c.getAttribute("data-venue") + "  ·  " + c.getAttribute("data-duration") + "  ·  " + c.getAttribute("data-format-label");
      mStill.textContent = "[FILM STILL PLACEHOLDER]";
      mStory.textContent = "[STORY PLACEHOLDER — the couple's day, in a few honest lines, to be written with Christian.]";
      modal.querySelector("[data-m='count']").textContent = (i + 1) + " / " + order.length;
    }
    function openModal(i) { idx = (i + order.length) % order.length; fill(idx); modal.classList.add("open"); document.body.style.overflow = "hidden"; }
    function closeModal() { modal.classList.remove("open"); document.body.style.overflow = ""; }

    order.forEach(function (c, i) {
      c.addEventListener("click", function () { openModal(i); });
      c.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(i); } });
      c.setAttribute("tabindex", "0");
      c.setAttribute("role", "button");
    });
    modal.querySelector(".modal-veil").addEventListener("click", closeModal);
    modal.querySelector(".modal-x").addEventListener("click", closeModal);
    modal.querySelector("[data-m='prev']").addEventListener("click", function () { openModal(idx - 1); });
    modal.querySelector("[data-m='next']").addEventListener("click", function () { openModal(idx + 1); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  }

  // FAQ accordion
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    q.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
      q.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // Contact form → thank-you state (front-end only)
  var form = document.getElementById("inquiryForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.style.display = "none";
      document.getElementById("thanks").classList.add("show");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
