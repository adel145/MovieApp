console.clear();
gsap.registerPlugin(ScrollTrigger);

// Scroll zoom animation on load
window.addEventListener("load", () => {
  gsap.timeline({
    scrollTrigger: {
      trigger: ".intro",
      start: "top top",
      end: "+=150%",
      pin: true,
      scrub: true
    }
  }).to(".intro img", {
    scale: 2,
    ease: "power1.inOut"
  });

  renderCards();
});

const movieWrapper = document.getElementById("movieWrapper");
const player = document.getElementById("videoPlayer");
const videoEl = document.getElementById("videoElement");
const iframeEl = document.getElementById("videoEmbed");
const closeBtn = document.getElementById("closePlayer");
const prevBtn = document.getElementById("prevEpisode");
const nextBtn = document.getElementById("nextEpisode");

let currentSeries = [];
let currentIndex = 0;

// Render movie/series cards
function renderCards() {
  contentData.forEach(item => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="poster"><img src="${item.img}" alt="${item.title}"></div>
      <div class="details">
        <h1>${item.title}</h1>
        <h2>${item.year} • ${item.duration}</h2>
        <div class="rating">
          ${getStars(item.rating)} <span>${item.rating}/5</span>
        </div>
        <div class="tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}</div>
        <p class="desc">${item.description}</p>
        <div class="cast">
          <h3>Cast</h3>
          <ul>
            ${item.cast.map(c => `<li><img src="${c.img}" title="${c.name}"></li>`).join("")}
          </ul>
        </div>
      </div>
    `;
    card.addEventListener("click", () => openPlayer(item));
    movieWrapper.appendChild(card);
  });
}

// Open player with appropriate content
function openPlayer(item) {
  player.classList.remove("hidden");

  // Reset both players
  videoEl.pause();
  videoEl.src = "";
  videoEl.classList.add("hidden");
  iframeEl.src = "";
  iframeEl.classList.add("hidden");

  if (item.type === "movie") {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";

    if (item.videoEmbed) {
      iframeEl.src = item.videoEmbed;
      iframeEl.classList.remove("hidden");
    } else if (item.video) {
      videoEl.src = item.video;
      videoEl.classList.remove("hidden");
      videoEl.play();
    }

  } else if (item.type === "series") {
    currentSeries = item.embeds || item.videos || [];
    currentIndex = 0;
    playSeriesEpisode();
    prevBtn.style.display = "inline-block";
    nextBtn.style.display = "inline-block";
  }
}

// Play current episode in series
function playSeriesEpisode() {
  const link = currentSeries[currentIndex];

  // Reset players
  videoEl.pause();
  videoEl.src = "";
  iframeEl.src = "";
  videoEl.classList.add("hidden");
  iframeEl.classList.add("hidden");

  if (link.includes("embed")) {
    iframeEl.src = link;
    iframeEl.classList.remove("hidden");
  } else {
    videoEl.src = link;
    videoEl.classList.remove("hidden");
    videoEl.play();
  }
}

// Auto-play next episode (if .mp4 only)
videoEl.addEventListener("ended", () => {
  if (currentSeries.length > 0 && currentIndex < currentSeries.length - 1) {
    currentIndex++;
    playSeriesEpisode();
  } else {
    closePlayer();
  }
});

prevBtn.addEventListener("click", () => {
  if (currentIndex > 0) {
    currentIndex--;
    playSeriesEpisode();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentIndex < currentSeries.length - 1) {
    currentIndex++;
    playSeriesEpisode();
  }
});

closeBtn.addEventListener("click", () => {
  closePlayer();
});

// Hide player and reset content
function closePlayer() {
  videoEl.pause();
  videoEl.src = "";
  iframeEl.src = "";
  videoEl.classList.add("hidden");
  iframeEl.classList.add("hidden");
  player.classList.add("hidden");
  currentSeries = [];
  currentIndex = 0;
}

// Convert rating number to star icons
function getStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  return "★".repeat(fullStars) + (halfStar ? "½" : "") + "☆".repeat(5 - fullStars - (halfStar ? 1 : 0));
}
