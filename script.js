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
  "영상 보기": "🎥",
  "게임 하기": "🎮",
};

document.querySelectorAll(".btn-feature[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const label = btn.dataset.target;

    if (label === "사진 보기") {
      showScreen("screen-photo");
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

// ---------- SOS button ----------
const helpCountEl = document.getElementById("help-count");
let helpCount = 0;

document.getElementById("btn-sos").addEventListener("click", () => {
  helpCount += 1;
  helpCountEl.textContent = `${helpCount}개`;
});

// ---------- daily message rotator ----------
const dailyMessages = [
  "오늘 하루도 가족과 함께라서 든든해요.",
  "잠깐 창밖을 보며 숨을 크게 쉬어 보세요.",
  "물 한 잔 마시고 잠시 쉬어가도 좋아요.",
  "오늘도 무사히 하루를 보내고 계세요.",
  "필요할 땐 언제든 도움 요청 버튼을 눌러주세요.",
];

let messageIndex = 0;
const messageEl = document.getElementById("daily-message");

document.getElementById("btn-refresh-message").addEventListener("click", () => {
  messageIndex = (messageIndex + 1) % dailyMessages.length;
  messageEl.textContent = dailyMessages[messageIndex];
});

// ---------- photo feature ----------
const photoUpload = document.getElementById("photo-upload");
const uploadPhotoBtn = document.getElementById("upload-photo-btn");
const unclassifiedAlbum = document.getElementById("unclassified-album");
const deleteBtn = document.getElementById("delete-unclassified");
const photoHomeView = document.getElementById("photo-home-view");
const albumView = document.getElementById("album-view");
const backToGallery = document.getElementById("back-to-gallery");

let allPhotos = [];

if (uploadPhotoBtn && photoUpload) {
  uploadPhotoBtn.addEventListener("click", () => photoUpload.click());
}

if (photoUpload && unclassifiedAlbum) {
  const albumCover = unclassifiedAlbum.querySelector(".album-cover");
  const albumCount = unclassifiedAlbum.querySelector(".album-count");

  photoUpload.addEventListener("change", (event) => {
    const files = [...event.target.files];

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      allPhotos.push(url);
    });

    albumCover.innerHTML = "";

    allPhotos.slice(0, 4).forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
      albumCover.appendChild(img);
    });

    albumCount.textContent = `사진 ${allPhotos.length}장`;
  });

  unclassifiedAlbum.addEventListener("click", () => {
    if (allPhotos.length === 0) return;

    photoHomeView.style.display = "none";
    albumView.classList.add("active");

    document.getElementById("album-title").textContent = "분류 안됨";

    const mosaic = document.getElementById("photo-mosaic");
    mosaic.innerHTML = "";

    allPhotos.forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
      mosaic.appendChild(img);
    });
  });

  if (deleteBtn) {
    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      const ok = confirm("삭제하시겠습니까?");
      if (!ok) return;

      allPhotos = [];
      albumCover.innerHTML = "";
      albumCount.textContent = "사진 0장";
    });
  }
}

if (backToGallery) {
  backToGallery.addEventListener("click", () => {
    albumView.classList.remove("active");
    photoHomeView.style.display = "block";
  });
}

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
  } catch (e) {
    /* 저장 실패 시 조용히 무시 (테마 적용 자체는 계속 동작) */
  }

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

    if (themeHint) {
      themeHint.textContent = `${THEME_NAMES[theme] || ""} 테마로 바꿨어요.`;
    }
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

    const size = 26 + Math.random() * 74; // 26px ~ 100px
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
