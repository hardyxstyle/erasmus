(function () {
  function renderStats() {
    const yearsStatEl = document.getElementById("stat-years");
    if (!yearsStatEl) return; // тази страница няма статистики

    const years = window.getAllYears();
    const countries = new Set();
    let visitCount = 0;
    years.forEach((y) => {
      y.visits.forEach((v) => {
        visitCount++;
        if (v.country && v.country.bg !== "Предстои") countries.add(v.country.bg);
      });
    });

    yearsStatEl.textContent = years.length;
    document.getElementById("stat-countries").textContent = countries.size;
    document.getElementById("stat-visits").textContent = visitCount;
  }

  function renderYearsGrid() {
    const grid = document.getElementById("years-grid");
    const years = window.getAllYears();
    const lang = window.getLang();

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

  function render() {
    renderStats();
    renderYearsGrid();
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.initLangSwitch(); window.initMobileNav();
    render();
  });
  document.addEventListener("langchange", render);
})();
