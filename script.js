const word = document.getElementById("word");
const text = document.getElementById("text");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const endgameEl = document.getElementById("end-game-container");
const settingsBtn = document.getElementById("settings-btn");
const settings = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");
const difficultySelect = document.getElementById("difficulty");
const categorySelect = document.getElementById("category");

// List of words for game
const words = [
  // General
  { word: "capalot", category: "general" },
  { word: "jolly", category: "general" },
  { word: "merry", category: "general" },
  { word: "retain", category: "general" },
  { word: "enjoin", category: "general" },
  { word: "concurrently", category: "general" },
  { word: "amazing", category: "general" },
  { word: "lively", category: "general" },
  { word: "happy", category: "general" },
  { word: "melodious", category: "general" },
  { word: "arcade", category: "general" },

  // animals
  { word: "lion", category: "animals" },
  { word: "elephant", category: "animals" },
  { word: "giraffe", category: "animals" },
  { word: "porcupine", category: "animals" },
  { word: "eel", category: "animals" },
  { word: "goat", category: "animals" },
  { word: "ram", category: "animals" },
  { word: "rhino", category: "animals" },
  { word: "hippo", category: "animals" },
  { word: "pig", category: "animals" },
  { word: "sheep", category: "animals" },

  // Technology
  { word: "computer", category: "technology" },
  { word: "router", category: "technology" },
  { word: "internet", category: "technology" },
  { word: "hardware", category: "technology" },
  { word: "memory", category: "technology" },
  { word: "disk", category: "technology" },
  { word: "processor", category: "technology" },
  { word: "firmware", category: "technology" },
  { word: "encryption", category: "technology" },
  { word: "algorithm", category: "technology" },
  { word: "metadata", category: "technology" },

];

// List of power-up words
const powerUps = [
  { word: "super", effect: "time", value: 5 },
  { word: "double", effect: "score", value: 2 },
];

// Initially
let randomWord;
let score = 0;
let time = 10;

// Set default difficulty as medium or fetch previous from local storage
let difficulty =
  localStorage.getItem("difficulty") !== null
    ? localStorage.getItem("difficulty")
    : "medium";
	
// Set default category as general or fetch previous from local storage
let category =
  localStorage.getItem("category") !== null
    ? localStorage.getItem("category")
    : "general";

// Set difficulty and category select values
difficultySelect.value = difficulty;
categorySelect.value = category;

// Focus on text on start
text.focus();

// Start counting down
const timeInterval = setInterval(updateTime, 1000);

// Generate random word from array
function getRandomWord() {
  const categoryWords = words.filter(word => word.category === category);
  return categoryWords[Math.floor(Math.random() * categoryWords.length)];
}

// Generate random power-up from array
function getRandomPowerUp() {
  return powerUps[Math.floor(Math.random() * powerUps.length)];
}

// Add word to DOM
function addWordToDOM() {
  const shouldGeneratePowerUp = Math.random() < 0.1; // 10% chance to generate a power-up
  if (shouldGeneratePowerUp) {
    randomWord = getRandomPowerUp();
    word.innerHTML = `${randomWord.word} (Power-Up)`;
  } else {
    randomWord = getRandomWord();
    word.innerHTML = `${randomWord.word} (${randomWord.category})`;
  }
}

// Update score
function updateScore() {
  score++;
  scoreEl.innerHTML = score;
}

// Update time
function updateTime() {
  time--;
  timeEl.innerHTML = time + "s";

  if (time === 0) {
    clearInterval(timeInterval);
    // end game
    gameOver();
  }
}

// Handle power-up effects
function applyPowerUpEffect(effect, value) {
  switch (effect) {
    case "time":
      time += value;
      break;
    case "score":
      updateScore(); // Double the score
      break;
    // Add more cases for other power-up effects
  }
}

// Game over, show end screen
function gameOver() {
  endgameEl.innerHTML = `
    <h1>Time ran out</h1>
    <p>Your final score is ${score}</p>
    <button onclick="location.reload()">Reload</button>
  `;

  endgameEl.style.display = "flex";
}

addWordToDOM();

// Event listeners

// Typing
text.addEventListener("input", (e) => {
  const insertedText = e.target.value;

  if (insertedText === randomWord.word) {
    if (randomWord.effect) {
      applyPowerUpEffect(randomWord.effect, randomWord.value);
    } else {
      updateScore();
    }

    addWordToDOM();

    // Clear
    e.target.value = "";

    if (difficulty === "hard") {
      time += 2;
    } else if (difficulty === "medium") {
      time += 3;
    } else {
      time += 5;
    }

    updateTime();
  }
});

// Settings btn click
settingsBtn.addEventListener("click", () => settings.classList.toggle("hide"));

// Settings select
settingsForm.addEventListener("change", (e) => {
  if (e.target.id === "difficulty") {
    difficulty = e.target.value;
    localStorage.setItem("difficulty", difficulty);
  } else if (e.target.id === "category") {
    category = e.target.value;
    localStorage.setItem("category", category);
    addWordToDOM(); // Refresh the displayed word when the category changes
  }
});
