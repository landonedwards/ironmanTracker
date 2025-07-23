const playButton = document.querySelector(".playButton");
const resetButton = document.querySelector(".resetGameButton");

const main = document.querySelector("main");

function gameShelfModalHTML() {
    return `
    <div class="shelfContainerContainer">
        <div class="shelfContainer">
          <img
            class="shelfImg"
            src="images/misc/game-shelf-full.png"
            alt="Wooden Shelf"
          />
          <div class="gameSelectContainer">
            <img
              class="gameCover"
              id="bindingCover"
              src="images/misc/fe6-cover.png"
              alt="Fire Emblem 6 Cover"
            />
            <img
              class="gameCover"
              id="blazingCover"
              src="images/misc/fe7-cover.png"
              alt="Fire Emblem 7 Cover"
            />
            <img
              class="gameCover"
              id="sacredCover"
              src="images/misc/fe8-cover.png"
              alt="Fire Emblem 8 Cover"
            />
          </div>
        </div>
      </div>
    `;
}

function gameShelfModalHandler(gameDisplayElement) {
    if (!playButton.classList.contains("selected")) {
        main.insertAdjacentHTML("beforeend", gameShelfModalHTML());
    }
    else {
        const gameShelf = document.querySelector(".shelfContainerContainer");
        closeElement(gameShelf);
    }
}

function generateSaveDataContainer() {
    return `
    <div class="saveFilesSpacingContainer">
      <div class="allSaveFilesContainer"></div>
    </div>
    `;
}

function generateSaveDataFileDisplay(gameMode, difficulty, deathCount, lordName, currentChapter, lastPlayedDate) {
    return `
    <div class="saveFileContainer">
      <div class="saveHeader">
        <h4>${gameMode} ${difficulty}</h4>
       </div>
      <div class="fileContentContainer">
        <div class="imgContainer">
          <img src="images/char-sprite/small-sprites/small-${lordName.toLowerCase()}.png" alt="${lordName} Sprite">
        </div>
        <div class="fileDetailsContainer">
          <p>
            ${lastPlayedDate}
            <br>
            Deaths: ${deathCount} | Chapter: ${currentChapter}
          </p>
        </div>
      </div>
    </div>
    `;
}

function closeElement(element) {
    if (element) {
        element.remove();
    }
}

playButton.addEventListener("click", () => {
    gameShelfModalHandler();
    // add/remove the selected class list
    playButton.classList.toggle("selected");
})

resetButton.addEventListener("click", () => {
    resetButton.classList.toggle("selected");
})