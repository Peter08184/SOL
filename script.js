// ---------- screen navigation ----------
function showScreen(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.remove("active"));
  const target = document.getElementById(id);
  if (target) target.classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

document.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => showScreen(btn.dataset.back));
});

// ---------- feature buttons ----------
// "사진 보기"는 실제 구현된 화면(screen-photo)으로,
// 나머지("영상 보기", "게임 하기")는 기존처럼 준비중 화면으로 이동합니다.
const featureIcons = {
  "게임 하기": "🎮",
};

document.querySelectorAll(".btn-feature[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const label = btn.dataset.target;

    if (label === "사진 보기") {
      refreshPhotoHero();
      showScreen("screen-photo");
      return;
    }
    if (label === "영상 보기") {
      refreshVideoHero();
      showScreen("screen-video");
      return;
    }

    document.getElementById("generic-title").textContent = label;
    document.getElementById("generic-icon").textContent = featureIcons[label] || "✨";
    document.getElementById("generic-badge").textContent = "준비 중";
    showScreen("screen-generic");
  });
});

// ---------- mood check ----------
const moodDisplay = document.getElementById("mood-display");
const moodHint = document.getElementById("mood-hint");

document.getElementById("btn-mood-check").addEventListener("click", () => {
  document.querySelectorAll(".mood-option").forEach((el) => el.classList.remove("selected"));
  moodHint.textContent = "\u00A0";
  showScreen("screen-mood");
});

document.querySelectorAll(".mood-option").forEach((option) => {
  option.addEventListener("click", () => {
    document.querySelectorAll(".mood-option").forEach((el) => el.classList.remove("selected"));
    option.classList.add("selected");

    const emoji = option.dataset.emoji;
    const label = option.dataset.label;
    moodHint.textContent = `${label}(으)로 저장할게요.`;

    moodDisplay.textContent = `${emoji} ${label}`;
    setTimeout(() => showScreen("screen-home"), 550);
  });
});

// ---------- settings / theme ----------
const THEME_STORAGE_KEY = "eldtree-theme";
const THEME_NAMES = {
  orange: "따뜻한 오렌지",
  blue: "차분한 하늘색",
  green: "싱그러운 초록",
  purple: "은은한 라벤더",
  pink: "포근한 로즈",
};

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {}

  document.querySelectorAll(".theme-option").forEach((btn) => {
    btn.classList.toggle("selected", btn.dataset.theme === theme);
  });
}

const btnSettings = document.getElementById("btn-settings");
const themeHint = document.getElementById("theme-hint");

if (btnSettings) {
  btnSettings.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") || "orange";
    document.querySelectorAll(".theme-option").forEach((btn) => {
      btn.classList.toggle("selected", btn.dataset.theme === current);
    });
    if (themeHint) themeHint.textContent = "\u00A0";
    showScreen("screen-settings");
  });
}

document.querySelectorAll(".theme-option").forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    applyTheme(theme);
    if (themeHint) themeHint.textContent = `${THEME_NAMES[theme] || ""} 테마로 바꿨어요.`;
  });
});

// ---------- 랜덤 도형 배경 ----------
(function initBackgroundShapes() {
  const container = document.getElementById("bg-shapes");
  if (!container) return;

  const shapeClasses = ["bg-shape-circle", "bg-shape-square", "bg-shape-triangle"];
  const count = 16;

  for (let i = 0; i < count; i++) {
    const shape = document.createElement("span");
    const shapeClass = shapeClasses[Math.floor(Math.random() * shapeClasses.length)];
    shape.className = `bg-shape ${shapeClass}`;

    const size = 26 + Math.random() * 74;
    shape.style.width = `${size}px`;
    shape.style.height = `${size}px`;
    shape.style.top = `${Math.random() * 100}%`;
    shape.style.left = `${Math.random() * 100}%`;
    shape.style.transform = `rotate(${Math.random() * 360}deg)`;
    shape.style.opacity = (0.05 + Math.random() * 0.09).toFixed(2);
    shape.style.background = Math.random() > 0.5 ? "var(--accent-1)" : "var(--accent-2)";

    container.appendChild(shape);
  }
})();

/* ======================================================================
   사진 / 영상 공용 라이브러리 로직
   ====================================================================== */

const UNSORTED_LABEL = "분류 안됨";

// 기본 앨범(카테고리) - 사진/영상 각각 독립적으로 관리되며 사용자가 추가/삭제 가능
let photoCategories = ["손주 사진", "추억 모음", "명절 모임"];
let videoCategories = ["손주 사진", "추억 모음", "명절 모임"];

function makeId() {
  return `m${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

// ---- 데모용 초기 사진 데이터 ----
let photoItems = [
  { id: makeId(), url: "https://picsum.photos/500?4", category: "손주 사진" },
  { id: makeId(), url: "https://picsum.photos/500?5", category: "손주 사진", recommended: true },
  { id: makeId(), url: "https://picsum.photos/500?6", category: "손주 사진", recommended: true },
  { id: makeId(), url: "https://picsum.photos/500?7", category: "추억 모음" },
  { id: makeId(), url: "https://picsum.photos/500?8", category: "추억 모음", recommended: true },
  { id: makeId(), url: "https://picsum.photos/500?9", category: "추억 모음" },
  { id: makeId(), url: "https://picsum.photos/500?10", category: "추억 모음", throwback: true },
  { id: makeId(), url: "https://picsum.photos/500?11", category: "명절 모임", throwback: true },
  { id: makeId(), url: "https://picsum.photos/500?12", category: "명절 모임" },
  { id: makeId(), url: "https://picsum.photos/500?13", category: "명절 모임", throwback: true },
];

// ---- 데모용 초기 영상 데이터 (공개 샘플 영상 사용) ----
let videoItems = [
  {
    id: makeId(),
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://picsum.photos/500?101",
    category: "손주 사진",
    recommended: true,
  },
  {
    id: makeId(),
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://picsum.photos/500?102",
    category: "추억 모음",
  },
  {
    id: makeId(),
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "https://picsum.photos/500?103",
    category: "명절 모임",
    throwback: true,
  },
];

// ---------- 전체화면 뷰어 (사진/영상 공용, 단일 항목) ----------
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightbox-content");
const lightboxClose = document.getElementById("lightbox-close");

function showLightbox(item, kind) {
  lightboxContent.innerHTML = "";

  if (kind === "video") {
    const video = document.createElement("video");
    video.src = item.url;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    lightboxContent.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = item.url;
    img.alt = "";
    lightboxContent.appendChild(img);
  }

  lightbox.classList.add("active");
}

function hideLightbox() {
  lightbox.classList.remove("active");
  lightboxContent.innerHTML = "";
}

lightboxClose.addEventListener("click", hideLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) hideLightbox();
});

// ---------- 스토리형 뷰어 (사진 추천 / 1년 전 오늘 전용) ----------
const storyViewer = document.getElementById("story-viewer");
const storySlidesEl = document.getElementById("story-slides");
const storyProgressEl = document.getElementById("story-progress");
const storyClose = document.getElementById("story-close");

let storyIndex = 0;
let storyTimer = null;
const STORY_DURATION = 3500;

function showStory(items, kind) {
  if (!items.length) return;
  storyIndex = 0;

  storySlidesEl.innerHTML = "";
  storyProgressEl.innerHTML = "";

  items.forEach((item, i) => {
    const slide = document.createElement("div");
    slide.className = "story-slide" + (i === 0 ? " active" : "");

    if (kind === "video") {
      const video = document.createElement("video");
      video.src = item.url;
      video.muted = true;
      video.autoplay = true;
      video.playsInline = true;
      video.loop = true;
      slide.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = item.url;
      img.alt = "";
      slide.appendChild(img);
    }

    storySlidesEl.appendChild(slide);

    const seg = document.createElement("div");
    seg.className = "story-segment";
    const fill = document.createElement("div");
    fill.className = "story-segment-fill";
    seg.appendChild(fill);
    storyProgressEl.appendChild(seg);
  });

  storyViewer.classList.add("active");
  playStoryStep(items);
}

function playStoryStep(items) {
  clearTimeout(storyTimer);
  const fills = storyProgressEl.querySelectorAll(".story-segment-fill");

  fills.forEach((fill, i) => {
    fill.classList.remove("filling");
    fill.style.animation = "none";
    if (i < storyIndex) {
      fill.classList.add("done");
      fill.style.width = "100%";
    } else {
      fill.classList.remove("done");
      fill.style.width = "0%";
    }
  });

  // 리플로우를 강제해 애니메이션을 다시 시작시킴
  void storyProgressEl.offsetWidth;
  fills[storyIndex].style.animation = "";
  fills[storyIndex].classList.add("filling");

  storyTimer = setTimeout(() => {
    const slides = storySlidesEl.querySelectorAll(".story-slide");
    slides[storyIndex].classList.remove("active");
    storyIndex = (storyIndex + 1) % items.length;
    slides[storyIndex].classList.add("active");
    playStoryStep(items);
  }, STORY_DURATION);
}

function hideStory() {
  storyViewer.classList.remove("active");
  clearTimeout(storyTimer);
  storySlidesEl.innerHTML = "";
  storyProgressEl.innerHTML = "";
}

storyClose.addEventListener("click", hideStory);
storyViewer.addEventListener("click", (e) => {
  if (e.target === storyViewer) hideStory();
});

// ---------- 앨범 이동 선택 시트 (사진/영상 공용) ----------
const categorySheetOverlay = document.getElementById("category-sheet-overlay");
const categorySheetOptions = document.getElementById("category-sheet-options");
const categorySheetCancel = document.getElementById("category-sheet-cancel");

function showCategorySheet(categories, onPick) {
  categorySheetOptions.innerHTML = "";

  [UNSORTED_LABEL, ...categories].forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "sheet-option";
    btn.textContent = cat;
    btn.addEventListener("click", () => {
      onPick(cat);
      hideCategorySheet();
    });
    categorySheetOptions.appendChild(btn);
  });

  categorySheetOverlay.classList.add("active");
}

function hideCategorySheet() {
  categorySheetOverlay.classList.remove("active");
}

categorySheetCancel.addEventListener("click", hideCategorySheet);
categorySheetOverlay.addEventListener("click", (e) => {
  if (e.target === categorySheetOverlay) hideCategorySheet();
});

// ---------- 앨범 관리 시트 (앨범 추가 / 삭제, 사진·영상 공용) ----------
const albumManageOverlay = document.getElementById("album-manage-overlay");
const albumManageListEl = document.getElementById("album-manage-list");
const albumManageInput = document.getElementById("album-manage-input");
const albumManageAddBtn = document.getElementById("album-manage-add-btn");
const albumManageClose = document.getElementById("album-manage-close");

let manageContext = null;

function openAlbumManager(ctx) {
  manageContext = ctx;
  albumManageInput.value = "";
  renderAlbumManageList();
  albumManageOverlay.classList.add("active");
}

function closeAlbumManager() {
  albumManageOverlay.classList.remove("active");
  manageContext = null;
}

function renderAlbumManageList() {
  albumManageListEl.innerHTML = "";

  if (manageContext.categories.length === 0) {
    const empty = document.createElement("p");
    empty.className = "manage-empty";
    empty.textContent = "등록된 앨범이 없어요. 아래에서 새 앨범을 추가해 보세요.";
    albumManageListEl.appendChild(empty);
    return;
  }

  manageContext.categories.forEach((cat) => {
    const row = document.createElement("div");
    row.className = "manage-row";

    const name = document.createElement("span");
    name.className = "manage-row-name";
    name.textContent = cat;

    const delBtn = document.createElement("button");
    delBtn.className = "manage-row-delete";
    delBtn.textContent = "✕ 삭제";
    delBtn.addEventListener("click", () => {
      const ok = confirm(
        `"${cat}" 앨범을 삭제하면 안에 있던 항목은 모두 "${UNSORTED_LABEL}"으로 이동해요.\n삭제하시겠습니까?`
      );
      if (!ok) return;

      const idx = manageContext.categories.indexOf(cat);
      if (idx > -1) manageContext.categories.splice(idx, 1);

      manageContext.items.forEach((it) => {
        if (it.category === cat) it.category = UNSORTED_LABEL;
      });

      if (
        manageContext.albumViewEl.classList.contains("active") &&
        manageContext.albumTitleEl.textContent === cat
      ) {
        manageContext.closeAlbum();
      }

      manageContext.renderGallery();
      renderAlbumManageList();
    });

    row.appendChild(name);
    row.appendChild(delBtn);
    albumManageListEl.appendChild(row);
  });
}

albumManageAddBtn.addEventListener("click", () => {
  if (!manageContext) return;
  const val = albumManageInput.value.trim();
  if (!val) return;

  if (val === UNSORTED_LABEL || manageContext.categories.includes(val)) {
    alert("이미 있는 이름이거나 사용할 수 없는 이름이에요.");
    return;
  }

  manageContext.categories.push(val);
  albumManageInput.value = "";
  manageContext.renderGallery();
  renderAlbumManageList();
});

albumManageClose.addEventListener("click", closeAlbumManager);
albumManageOverlay.addEventListener("click", (e) => {
  if (e.target === albumManageOverlay) closeAlbumManager();
});

// 업로드한 영상의 미리보기 썸네일(포스터 이미지)을 영상의 한 장면에서 캡처
function capturePosterFromVideoFile(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.muted = true;
    video.src = URL.createObjectURL(file);

    let done = false;
    function finish() {
      if (done) return;
      done = true;
      try {
        const canvas = document.createElement("canvas");
        const ratio = video.videoHeight && video.videoWidth ? video.videoHeight / video.videoWidth : 1;
        canvas.width = 400;
        canvas.height = Math.max(1, Math.round(400 * ratio));
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      } catch (e) {
        resolve("");
      }
    }

    video.addEventListener("loadeddata", () => {
      try {
        video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
      } catch (e) {
        finish();
      }
    });
    video.addEventListener("seeked", finish);
    video.addEventListener("error", () => resolve(""));
    setTimeout(finish, 2000);
  });
}

// ---------- 갤러리 컨트롤러 (사진/영상 공용) ----------
function createGalleryController(config) {
  function countByCategory(cat) {
    return config.items.filter((it) => it.category === cat).length;
  }

  function coverThumbs(cat) {
    return config.items.filter((it) => it.category === cat).slice(0, 4);
  }

  function thumbSrc(item) {
    return item.poster || item.url;
  }

  function renderGallery() {
    const allCats = [UNSORTED_LABEL, ...config.categories];
    config.albumGridEl.innerHTML = "";

    allCats.forEach((cat) => {
      const list = coverThumbs(cat);
      const count = countByCategory(cat);

      const card = document.createElement("div");
      card.className = "album-card";

      const cover = document.createElement("div");
      cover.className = "album-cover";

      list.forEach((item) => {
        const img = document.createElement("img");
        img.src = thumbSrc(item);
        img.alt = "";
        cover.appendChild(img);
      });

      const info = document.createElement("div");
      info.className = "album-info";
      info.innerHTML = `
        <div class="album-name">${cat}</div>
        <div class="album-count">${config.unit} ${count}${config.unitSuffix}</div>
      `;

      card.appendChild(cover);
      card.appendChild(info);
      card.addEventListener("click", () => openAlbum(cat));

      config.albumGridEl.appendChild(card);
    });

    if (config.afterRender) config.afterRender();
  }

  function openAlbum(cat) {
    config.albumTitleEl.textContent = cat;
    renderMosaic(cat);
    config.homeViewEl.style.display = "none";
    config.albumViewEl.classList.add("active");
  }

  function closeAlbum() {
    config.albumViewEl.classList.remove("active");
    config.homeViewEl.style.display = "block";
  }

  function renderMosaic(cat) {
    const list = config.items.filter((it) => it.category === cat);
    config.mosaicEl.innerHTML = "";

    if (list.length === 0) {
      const empty = document.createElement("p");
      empty.className = "mosaic-empty";
      empty.textContent = `아직 ${config.unit === "사진" ? "사진이" : "영상이"} 없어요.`;
      config.mosaicEl.appendChild(empty);
      return;
    }

    list.forEach((item) => {
      const cell = document.createElement("div");
      cell.className = "photo-item";

      const menuBtn = document.createElement("button");
      menuBtn.className = "photo-menu-btn";
      menuBtn.setAttribute("aria-label", "앨범 이동");
      menuBtn.textContent = "⋮";
      menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showCategorySheet(config.categories, (chosenCat) => {
          item.category = chosenCat;
          renderMosaic(cat);
          renderGallery();
        });
      });

      const thumb = document.createElement("img");
      thumb.className = "photo-thumb";
      thumb.src = thumbSrc(item);
      thumb.alt = "";
      thumb.addEventListener("click", () => showLightbox(item, config.kind));

      const delBtn = document.createElement("button");
      delBtn.className = "photo-delete-btn";
      delBtn.setAttribute("aria-label", "삭제");
      delBtn.textContent = "✕";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const ok = confirm("삭제하시겠습니까?");
        if (!ok) return;
        const idx = config.items.findIndex((it) => it.id === item.id);
        if (idx > -1) config.items.splice(idx, 1);
        renderMosaic(cat);
        renderGallery();
      });

      cell.appendChild(menuBtn);
      cell.appendChild(thumb);
      cell.appendChild(delBtn);

      if (config.kind === "video") {
        const badge = document.createElement("div");
        badge.className = "media-play-badge";
        badge.innerHTML = "<span>▶</span>";
        cell.appendChild(badge);
      }

      config.mosaicEl.appendChild(cell);
    });
  }

  if (config.uploadInputEl) {
    config.uploadInputEl.addEventListener("change", (e) => {
      const files = [...e.target.files];

      files.forEach((file) => {
        const url = URL.createObjectURL(file);
        const newItem = { id: makeId(), category: UNSORTED_LABEL, url };

        if (config.kind === "video") {
          newItem.poster = "";
          capturePosterFromVideoFile(file).then((poster) => {
            newItem.poster = poster;
            renderGallery();
            if (config.albumViewEl.classList.contains("active")) {
              renderMosaic(config.albumTitleEl.textContent);
            }
          });
        }

        config.items.push(newItem);
      });

      renderGallery();
      e.target.value = "";
    });
  }

  if (config.backBtnEl) {
    config.backBtnEl.addEventListener("click", closeAlbum);
  }

  if (config.recommendCardEl) {
    config.recommendCardEl.addEventListener("click", () => {
      if (config.onOpenRecommend) {
        config.onOpenRecommend();
        return;
      }
      const found = config.items.find((it) => it.recommended);
      if (found) showLightbox(found, config.kind);
      else alert(`아직 추천할 ${config.unit}이 없어요.`);
    });
  }

  if (config.throwbackCardEl) {
    config.throwbackCardEl.addEventListener("click", () => {
      if (config.onOpenThrowback) {
        config.onOpenThrowback();
        return;
      }
      const found = config.items.find((it) => it.throwback);
      if (found) showLightbox(found, config.kind);
      else alert(`아직 1년 전 ${config.unit}이 없어요.`);
    });
  }

  renderGallery();

  return {
    renderGallery,
    closeAlbum,
    categories: config.categories,
    items: config.items,
    albumViewEl: config.albumViewEl,
    albumTitleEl: config.albumTitleEl,
  };
}

// ---------- 히어로 카드 (사진/영상 공용): 추천 / 1년 전 오늘 중 랜덤으로 하나 표시 ----------
let currentHeroGroup = [];
let currentHeroKind = "photo";

function makeHeroRefresher(opts) {
  // opts: { items, cardEl, titleEl, subtitleEl, kind, recommendCaption, throwbackCaption }
  return function refresh() {
    if (!opts.cardEl) return;

    const hasRecommend = opts.items.some((p) => p.recommended);
    const hasThrowback = opts.items.some((p) => p.throwback);
    const availableTypes = [];
    if (hasRecommend) availableTypes.push("recommend");
    if (hasThrowback) availableTypes.push("throwback");

    if (availableTypes.length === 0) {
      opts.cardEl.classList.add("hidden");
      if (currentHeroKind === opts.kind) currentHeroGroup = [];
      return;
    }

    const chosenType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const group =
      chosenType === "recommend"
        ? opts.items.filter((p) => p.recommended)
        : opts.items.filter((p) => p.throwback);

    opts.cardEl.classList.remove("hidden");
    const coverUrl = opts.kind === "video" ? group[0].poster || group[0].url : group[0].url;
    opts.cardEl.style.backgroundImage = `url('${coverUrl}')`;

    if (chosenType === "recommend") {
      opts.titleEl.textContent = "추천";
      opts.subtitleEl.textContent = opts.recommendCaption;
    } else {
      opts.titleEl.textContent = "1년 전 오늘";
      opts.subtitleEl.textContent = opts.throwbackCaption;
    }

    opts.cardEl.onclick = () => {
      currentHeroGroup = group;
      currentHeroKind = opts.kind;
      showStory(group, opts.kind);
    };
  };
}

const refreshPhotoHero = makeHeroRefresher({
  items: photoItems,
  cardEl: document.getElementById("photo-hero-card"),
  titleEl: document.getElementById("photo-hero-title"),
  subtitleEl: document.getElementById("photo-hero-subtitle"),
  kind: "photo",
  recommendCaption: "⭐ 가장 많이 본 추억",
  throwbackCaption: "🕒 작년 오늘의 사진",
});

const refreshVideoHero = makeHeroRefresher({
  items: videoItems,
  cardEl: document.getElementById("video-hero-card"),
  titleEl: document.getElementById("video-hero-title"),
  subtitleEl: document.getElementById("video-hero-subtitle"),
  kind: "video",
  recommendCaption: "⭐ 가장 많이 본 영상",
  throwbackCaption: "🕒 작년 오늘의 영상",
});

// ---------- 사진 갤러리 초기화 ----------
const photoController = createGalleryController({
  kind: "photo",
  items: photoItems,
  categories: photoCategories,
  unit: "사진",
  unitSuffix: "장",
  homeViewEl: document.getElementById("photo-home-view"),
  albumViewEl: document.getElementById("photo-album-view"),
  albumGridEl: document.getElementById("photo-album-grid"),
  mosaicEl: document.getElementById("photo-mosaic"),
  albumTitleEl: document.getElementById("photo-album-title"),
  uploadInputEl: document.getElementById("photo-upload"),
  backBtnEl: document.getElementById("photo-back-to-gallery"),
});

refreshPhotoHero();

const uploadPhotoBtn = document.getElementById("upload-photo-btn");
const photoUploadInput = document.getElementById("photo-upload");
if (uploadPhotoBtn && photoUploadInput) {
  uploadPhotoBtn.addEventListener("click", () => photoUploadInput.click());
}

const photoManageBtn = document.getElementById("photo-manage-btn");
if (photoManageBtn) {
  photoManageBtn.addEventListener("click", () => openAlbumManager(photoController));
}

// ---------- 영상 갤러리 초기화 ----------
const videoController = createGalleryController({
  kind: "video",
  items: videoItems,
  categories: videoCategories,
  unit: "영상",
  unitSuffix: "개",
  homeViewEl: document.getElementById("video-home-view"),
  albumViewEl: document.getElementById("video-album-view"),
  albumGridEl: document.getElementById("video-album-grid"),
  mosaicEl: document.getElementById("video-mosaic"),
  albumTitleEl: document.getElementById("video-album-title"),
  uploadInputEl: document.getElementById("video-upload"),
  backBtnEl: document.getElementById("video-back-to-gallery"),
});

refreshVideoHero();

const uploadVideoBtn = document.getElementById("upload-video-btn");
const videoUploadInput = document.getElementById("video-upload");
if (uploadVideoBtn && videoUploadInput) {
  uploadVideoBtn.addEventListener("click", () => videoUploadInput.click());
}

const videoManageBtn = document.getElementById("video-manage-btn");
if (videoManageBtn) {
  videoManageBtn.addEventListener("click", () => openAlbumManager(videoController));
}
