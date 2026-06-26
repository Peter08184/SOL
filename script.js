document.querySelectorAll('[data-target]').forEach((button) => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const screens = document.querySelectorAll('.screen');

    screens.forEach((screen) => {
      screen.classList.toggle('active', screen.id === targetId);
    });
  });
});

document.querySelectorAll('.game-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.game-tab').forEach((item) => item.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.game-panel').forEach((panel) => panel.classList.remove('active'));
    document.getElementById(`${tab.dataset.game}-game`).classList.add('active');
    document.getElementById('game-result').textContent = '정답을 선택해 보세요.';
  });
});

document.querySelectorAll('.game-option').forEach((option) => {
  option.addEventListener('click', () => {
    const result = document.getElementById('game-result');
    if (option.dataset.correct === 'true') {
      result.textContent = '맞았어요! 잘했어요.';
    } else {
      result.textContent = '다시 생각해 볼까요?';
    }
  });
});

const linkInput = document.getElementById('link-input');
const openLinkButton = document.getElementById('open-link-btn');

if (linkInput && openLinkButton) {
  const openLink = () => {
    const value = linkInput.value.trim();
    if (!value) {
      return;
    }

    const normalizedValue = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    window.open(normalizedValue, '_blank', 'noopener,noreferrer');
  };

  openLinkButton.addEventListener('click', openLink);
  linkInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      openLink();
    }
  });
}
