// Screen navigation
document.querySelectorAll('[data-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const screens = document.querySelectorAll('.screen');

    screens.forEach((screen) => {
      screen.classList.toggle('active', screen.id === targetId);
    });

    document.getElementById(targetId)?.scrollIntoView({ block: 'start' });
  });
});

// Game tabs
document.querySelectorAll('.game-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.game-tab').forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.game-panel').forEach((panel) => panel.classList.remove('active'));
    document.getElementById(`${tab.dataset.game}-game`).classList.add('active');

    document.querySelectorAll('.game-option').forEach((opt) => {
      opt.classList.remove('is-correct', 'is-wrong');
    });
    document.getElementById('game-result').textContent = '정답을 선택해 보세요.';
  });
});

// Game answers: clear color + text feedback, not text alone
document.querySelectorAll('.game-option').forEach((option) => {
  option.addEventListener('click', () => {
    const result = document.getElementById('game-result');
    const panel = option.closest('.game-panel');

    panel.querySelectorAll('.game-option').forEach((opt) => opt.classList.remove('is-correct', 'is-wrong'));

    if (option.dataset.correct === 'true') {
      option.classList.add('is-correct');
      result.textContent = '✓ 맞았어요! 잘했어요.';
    } else {
      option.classList.add('is-wrong');
      result.textContent = '다시 생각해 볼까요?';
    }
  });
});

// Mood check-in
document.querySelectorAll('.mood-option').forEach((option) => {
  option.addEventListener('click', () => {
    document.querySelectorAll('.mood-option').forEach((opt) => opt.classList.remove('selected'));
    option.classList.add('selected');

    const labels = {
      great: '오늘 기분이 좋다고 알려주셨어요. 좋은 하루 보내세요!',
      okay: '오늘 기분을 기록했어요.',
      low: '오늘 기분이 안 좋으시군요. 가족에게 알려드릴까요?',
    };
    document.getElementById('mood-result').textContent = labels[option.dataset.mood] || '오늘의 기분을 선택해 주세요.';
  });
});

// Open a URL safely in a new tab
function openUrl(value) {
  if (!value) return;
  const normalizedValue = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  window.open(normalizedValue, '_blank', 'noopener,noreferrer');
}

// Preset shortcut buttons
document.querySelectorAll('.shortcut-btn').forEach((button) => {
  button.addEventListener('click', () => openUrl(button.dataset.url));
});

// Custom URL input
const linkInput = document.getElementById('link-input');
const openLinkButton = document.getElementById('open-link-btn');

if (linkInput && openLinkButton) {
  const openLink = () => openUrl(linkInput.value.trim());

  openLinkButton.addEventListener('click', openLink);
  linkInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      openLink();
    }
  });
}

// "글자 크게" text size toggle, persists for the session
const textSizeBtn = document.getElementById('text-size-btn');
if (textSizeBtn) {
  textSizeBtn.addEventListener('click', () => {
    const isLarge = document.documentElement.classList.toggle('text-xl');
    textSizeBtn.setAttribute('aria-pressed', String(isLarge));
  });
}

// Help request (placeholder hook for a real family-alert action)
const helpBtn = document.getElementById('help-btn');
if (helpBtn) {
  helpBtn.addEventListener('click', () => {
    helpBtn.querySelector('.quick-value').textContent = '🔔 요청을 보냈어요';
  });
}
