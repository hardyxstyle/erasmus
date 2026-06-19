(function () {
  function renderYearsGrid() {
    const grid = document.getElementById("years-grid");
    const years = window.getAllYears();
    const lang = window.getLang();

    if (!years.length) {
      grid.innerHTML = `<p style="opacity:.6">${lang === 'bg' ? 'Все още няма добавени години.' : 'No years added yet.'}</p>`;
      return;
    }

    grid.innerHTML = years.map((y) => {
      const visitedStamps = y.visits
        .filter(v => v.country && v.country.bg !== "Предстои")
        .map(v => `<span class="country-stamp"><span class="country-stamp__dot"></span>${v.country[lang]}</span>`)
        .join("");

      return `
        <a class="year-card ${y.isCurrent ? 'year-card--current' : ''}" href="year.html?y=${y.id}">
          <div class="year-card__period">${y.period[lang]}</div>
          <h3 class="year-card__title">${y.title[lang]}</h3>
          <p class="year-card__desc">${y.summary[lang]}</p>
          <div class="year-card__stamps">${visitedStamps}</div>
        </a>
      `;
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.initLangSwitch();
    window.initMobileNav();
    renderYearsGrid();
  });
  document.addEventListener("langchange", renderYearsGrid);
})();
