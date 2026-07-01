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
    setGameResult('정답을 선택해 보세요.', 'neutral');
  });
});

const gameResult = document.getElementById('game-result');

function setGameResult(message, state = 'neutral') {
  gameResult.textContent = message;
  gameResult.dataset.state = state;
}

function resetOptionStyles(container) {
  container.querySelectorAll('.game-option').forEach((option) => {
    option.classList.remove('correct', 'wrong');
  });
}

const memoryCards = Array.from(document.querySelectorAll('#memory-game .memory-card'));
const memoryScore = document.getElementById('memory-score');
let memoryState = {
  firstCard: null,
  secondCard: null,
  lockBoard: false,
  matches: 0,
  score: 0,
};

function shuffle(items) {
  const copy = [...items];

  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }

  return copy;
}

function resetMemoryGame() {
  const emojiSet = shuffle(['🌼', '🌼', '🌲', '🌲', '☀️', '☀️']);

  memoryCards.forEach((card, index) => {
    card.dataset.pair = emojiSet[index];
    card.querySelector('.card-front').textContent = emojiSet[index];
    card.classList.remove('is-flipped', 'is-matched');
  });

  memoryState = {
    firstCard: null,
    secondCard: null,
    lockBoard: false,
    matches: 0,
    score: 0,
  };

  memoryScore.textContent = '점수 0';
  setGameResult('같은 그림을 찾아보세요.', 'neutral');
}

memoryCards.forEach((card) => {
  card.addEventListener('click', () => {
    if (memoryState.lockBoard || card.classList.contains('is-flipped') || card.classList.contains('is-matched')) {
      return;
    }

    card.classList.add('is-flipped');

    if (!memoryState.firstCard) {
      memoryState.firstCard = card;
      return;
    }

    memoryState.secondCard = card;
    memoryState.lockBoard = true;

    const firstPair = memoryState.firstCard.dataset.pair;
    const secondPair = memoryState.secondCard.dataset.pair;

    if (firstPair === secondPair) {
      memoryState.firstCard.classList.add('is-matched');
      memoryState.secondCard.classList.add('is-matched');
      memoryState.matches += 1;
      memoryState.score += 1;
      memoryScore.textContent = `점수 ${memoryState.score}`;
      setGameResult('정답이에요! 짝을 찾았어요.', 'success');

      memoryState.firstCard = null;
      memoryState.secondCard = null;
      memoryState.lockBoard = false;

      if (memoryState.matches === 3) {
        setGameResult('모든 짝을 찾았어요! 훌륭해요.', 'success');
      }
    } else {
      setTimeout(() => {
        memoryState.firstCard.classList.remove('is-flipped');
        memoryState.secondCard.classList.remove('is-flipped');
        memoryState.firstCard = null;
        memoryState.secondCard = null;
        memoryState.lockBoard = false;
        setGameResult('다시 한 번 생각해 볼까요?', 'warning');
      }, 900);
    }
  });
});

document.querySelector('[data-reset="memory"]').addEventListener('click', resetMemoryGame);

const numberPanel = document.getElementById('number-game');
const numberOptions = Array.from(numberPanel.querySelectorAll('.game-option'));

numberOptions.forEach((option) => {
  option.addEventListener('click', () => {
    resetOptionStyles(numberPanel);

    if (option.dataset.correct === 'true') {
      option.classList.add('correct');
      setGameResult('정답이에요! 5가 맞습니다.', 'success');
    } else {
      option.classList.add('wrong');
      setGameResult('아쉽지만 5가 정답이에요.', 'warning');
    }
  });
});

document.querySelector('[data-reset="number"]').addEventListener('click', () => {
  resetOptionStyles(numberPanel);
  setGameResult('다시 도전해 보세요.', 'neutral');
});

const colorPanel = document.getElementById('color-game');
const colorOptions = Array.from(colorPanel.querySelectorAll('.game-option'));

colorOptions.forEach((option) => {
  option.addEventListener('click', () => {
    resetOptionStyles(colorPanel);

    if (option.dataset.correct === 'true') {
      option.classList.add('correct');
      setGameResult('정답이에요! 빨간색을 골랐습니다.', 'success');
    } else {
      option.classList.add('wrong');
      setGameResult('다른 색을 선택했어요. 빨간색을 골라 보세요.', 'warning');
    }
  });
});

document.querySelector('[data-reset="color"]').addEventListener('click', () => {
  resetOptionStyles(colorPanel);
  setGameResult('다시 도전해 보세요.', 'neutral');
});

resetMemoryGame();

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
