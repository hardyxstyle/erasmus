(function () {
  function getParams() {
    const p = new URLSearchParams(window.location.search);
    return { y: p.get("y"), v: p.get("v") };
  }

  function isYouTube(url) {
    return /youtube\.com|youtu\.be/.test(url);
  }
  function youTubeEmbed(url) {
    const idMatch = url.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
    const id = idMatch ? idMatch[1] : "";
    return `https://www.youtube.com/embed/${id}`;
  }
  function isVideoFile(url) {
    return /\.(mp4|webm|mov)$/i.test(url);
  }

  let currentGallery = [];
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    renderLightbox();
    document.getElementById("lightbox").classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    document.getElementById("lightbox").classList.remove("is-open");
    document.body.style.overflow = "";
    document.getElementById("lightbox-content").innerHTML = "";
  }
  function renderLightbox() {
    const item = currentGallery[currentIndex];
    const container = document.getElementById("lightbox-content");
    if (!item) return;

    if (item.type === "youtube") {
      container.innerHTML = `<iframe src="${youTubeEmbed(item.src)}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    } else if (item.type === "video") {
      container.innerHTML = `<video src="${item.src}" controls autoplay></video>`;
    } else {
      container.innerHTML = `<img src="${item.src}" alt="${item.caption || ''}">`;
    }
  }

  function buildGalleryItem(src) {
    if (isYouTube(src)) return { type: "youtube", src };
    if (isVideoFile(src)) return { type: "video", src };
    return { type: "image", src };
  }

  function thumbMarkup(item) {
    if (item.type === "youtube") {
      const idMatch = item.src.match(/(?:v=|youtu\.be\/)([\w-]{11})/);
      const thumb = idMatch ? `https://img.youtube.com/vi/${idMatch[1]}/hqdefault.jpg` : "";
      return `<img src="${thumb}" loading="lazy" alt="">
        <span class="gallery-item__play"><svg viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></span>`;
    }
    if (item.type === "video") {
      return `<video src="${item.src}#t=0.1" preload="metadata" muted></video>
        <span class="gallery-item__play"><svg viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg></span>`;
    }
    return `<img src="${item.src}" loading="lazy" alt="">`;
  }

  function paragraphsHtml(text) {
    return text.split(/\n\n+/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join("");
  }

  function renderItinerary(visit, lang, galleryItems) {
    const section = document.getElementById("itinerary-section");
    const list = document.getElementById("itinerary-list");

    if (!visit.itinerary || !visit.itinerary.length) {
      section.hidden = true;
      return;
    }
    section.hidden = false;

    list.innerHTML = visit.itinerary.map((day, i) => {
      const dayPhotos = day.photos || [];
      let photosHtml = "";
      if (dayPhotos.length) {
        photosHtml = `<div class="itinerary-day__photos">` + dayPhotos.map((src) => {
          const globalIndex = galleryItems.length;
          galleryItems.push(buildGalleryItem(src));
          return `<div class="itinerary-day__photo" data-index="${globalIndex}"><img src="${src}" loading="lazy" alt=""></div>`;
        }).join("") + `</div>`;
      }
      return `
        <div class="itinerary-day">
          <div class="itinerary-day__marker">${String(i + 1).padStart(2, '0')}</div>
          <h3 class="itinerary-day__title">${day.title[lang]}</h3>
          <div class="itinerary-day__text">${paragraphsHtml(day.text[lang])}</div>
          ${photosHtml}
        </div>
      `;
    }).join("");

    list.querySelectorAll(".itinerary-day__photo").forEach(el => {
      el.addEventListener("click", () => openLightbox(parseInt(el.dataset.index, 10)));
    });
  }

  function render() {
    currentGallery = [];
    const { y, v } = getParams();
    const year = window.getYear(y);
    const lang = window.getLang();
    if (!year) return;
    const visit = year.visits.find(x => x.slug === v);
    if (!visit) return;

    document.title = `${visit.country[lang]} · Erasmus Archive`;
    document.getElementById("breadcrumb-year").textContent = year.period[lang];
    document.getElementById("breadcrumb-year").href = `year.html?y=${year.id}`;
    document.getElementById("visit-country-crumb").textContent = visit.country[lang];
    document.getElementById("visit-country").textContent = visit.country[lang];
    document.getElementById("visit-desc").textContent = visit.summary[lang];
    document.getElementById("meta-type").textContent = visit.type[lang];
    document.getElementById("meta-date").textContent = visit.dateRange[lang];

    const introSection = document.getElementById("intro-video-section");
    const introVideo = document.getElementById("intro-video");
    if (visit.introVideo) {
      introSection.hidden = false;
      if (introVideo.getAttribute("src") !== visit.introVideo) {
        introVideo.setAttribute("src", visit.introVideo);
      }
    } else {
      introSection.hidden = true;
    }

    renderItinerary(visit, lang, currentGallery);

    const itineraryHead = document.getElementById("itinerary-head");
    itineraryHead.textContent = itineraryHead.dataset[lang];
    const galleryHead = document.getElementById("gallery-head");
    galleryHead.textContent = galleryHead.dataset[lang];

    const extraGallery = (visit.gallery || []).map(buildGalleryItem);
    const grid = document.getElementById("gallery-grid");

    if (extraGallery.length === 0) {
      grid.innerHTML = `<div class="gallery-empty">${lang === 'bg' ? 'Снимките и видеата от това посещение ще бъдат добавени скоро.' : 'Photos and videos from this visit will be added soon.'}</div>`;
      return;
    }

    const baseIndex = currentGallery.length;
    currentGallery = currentGallery.concat(extraGallery);

    grid.innerHTML = extraGallery.map((item, i) =>
      `<div class="gallery-item" data-index="${baseIndex + i}">${thumbMarkup(item)}</div>`
    ).join("");

    grid.querySelectorAll(".gallery-item").forEach(el => {
      el.addEventListener("click", () => openLightbox(parseInt(el.dataset.index, 10)));
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    window.initLangSwitch(); window.initMobileNav();
    render();

    document.getElementById("lightbox-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox").addEventListener("click", (e) => {
      if (e.target.id === "lightbox") closeLightbox();
    });
    document.getElementById("lightbox-prev").addEventListener("click", () => {
      currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
      renderLightbox();
    });
    document.getElementById("lightbox-next").addEventListener("click", () => {
      currentIndex = (currentIndex + 1) % currentGallery.length;
      renderLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (!document.getElementById("lightbox").classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") document.getElementById("lightbox-prev").click();
      if (e.key === "ArrowRight") document.getElementById("lightbox-next").click();
    });
  });
  document.addEventListener("langchange", render);
})();
