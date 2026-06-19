(function () {
  function getYearIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("y");
  }

  function mediaMarkup(visit) {
    if (visit.coverImage) {
      return `<img src="${visit.coverImage}" alt="${visit.country[window.getLang()]}" loading="lazy">`;
    }
    return `<span class="visit-card__media-placeholder">${window.t('view_year') === 'View year' ? 'No photo yet' : 'Няма снимка все още'}</span>`;
  }

  function render() {
    const yearId = getYearIdFromUrl();
    const year = window.getYear(yearId);
    const lang = window.getLang();

    if (!year) {
      document.getElementById("year-content").innerHTML = `<div class="container"><p>Годината не е намерена.</p></div>`;
      return;
    }

    document.title = `${year.period[lang]} · Erasmus Archive`;
    document.getElementById("year-period").textContent = year.period[lang];
    document.getElementById("year-title").textContent = year.title[lang];
    document.getElementById("year-summary").textContent = year.summary[lang];

    const outgoing = year.visits.filter(v => v.role === "outgoing");
    const incoming = year.visits.filter(v => v.role === "incoming");

    function cardHtml(v) {
      return `
        <a class="visit-card" href="visit.html?y=${year.id}&v=${v.slug}">
          <div class="visit-card__media">${mediaMarkup(v)}</div>
          <div class="visit-card__body">
            <div class="visit-card__type">${v.type[lang]}</div>
            <h3 class="visit-card__country">${v.country[lang]}</h3>
            <p class="visit-card__desc">${v.summary[lang]}</p>
            <span class="visit-card__link">${window.t('view_year')} →</span>
          </div>
        </a>
      `;
    }

    let html = "";
    if (outgoing.length) {
      html += `<div class="visit-group-label">${lang === 'bg' ? 'Къде ходихме ние' : 'Where we travelled'}</div>`;
      html += `<div class="visits-grid">${outgoing.map(cardHtml).join("")}</div>`;
    }
    if (incoming.length) {
      html += `<div class="visit-group-label">${lang === 'bg' ? 'Кой ни посети' : 'Who visited us'}</div>`;
      html += `<div class="visits-grid">${incoming.map(cardHtml).join("")}</div>`;
    }
    document.getElementById("visits-container").innerHTML = html;
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.initLangSwitch(); window.initMobileNav();
    render();
  });
  document.addEventListener("langchange", render);
})();
