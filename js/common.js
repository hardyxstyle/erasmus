/* ============================================
   Общи помощни функции — споделени между страници
   ============================================ */

(function () {
  const LANG_KEY = "erasmus_lang";

  window.getLang = function () {
    return localStorage.getItem(LANG_KEY) || "bg";
  };

  window.setLang = function (lang) {
    localStorage.setItem(LANG_KEY, lang);
    document.documentElement.lang = lang;
    window.applyTranslations();
  };

  window.t = function (key) {
    const lang = window.getLang();
    return (window.I18N[lang] && window.I18N[lang][key]) || key;
  };

  window.applyTranslations = function () {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = window.t(el.dataset.i18n);
    });
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.lang === window.getLang() ? "true" : "false");
    });
    document.dispatchEvent(new CustomEvent("langchange"));
  };

  window.initLangSwitch = function () {
    document.querySelectorAll(".lang-switch button").forEach((btn) => {
      btn.addEventListener("click", () => window.setLang(btn.dataset.lang));
    });
    document.documentElement.lang = window.getLang();
    window.applyTranslations();
  };

  // Зарежда всички годишни данни (data файловете трябва вече да са включени през <script>)
  window.getAllYears = function () {
    return (window.ERASMUS_YEARS || [])
      .map((id) => window.ERASMUS_DATA[id])
      .filter(Boolean)
      .sort((a, b) => b.id.localeCompare(a.id)); // най-новата година първо
  };

  window.getYear = function (id) {
    return window.ERASMUS_DATA[id];
  };
  // Mobile nav toggle
  window.initMobileNav = function () {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("is-open"));
    });
  };
})();
