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

// ---------- feature buttons -> generic placeholder page ----------
const featureIcons = {
  "사진 보기": "📷",
  "영상 보기": "🎥",
  "게임 하기": "🎮",
};

document.querySelectorAll(".btn-feature[data-target]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const label = btn.dataset.target;
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
  // reset previous selection state each time the screen opens
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

    // update the home screen mood stat, then return home shortly after
    moodDisplay.textContent = `${emoji} ${label}`;
    setTimeout(() => showScreen("screen-home"), 550);
  });
});

// ---------- SOS button (placeholder, increments help counter) ----------
const helpCountEl = document.getElementById("help-count");
let helpCount = 0;

document.getElementById("btn-sos").addEventListener("click", () => {
  helpCount += 1;
  helpCountEl.textContent = `${helpCount}개`;
});

// ---------- daily message rotator (replaces the old link-open box) ----------
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
