const characters = [
    { id: 1, charName: "Eliwood", HP: 80, Str: 45, Mag: 0, Dex: 50, Spd: 40, Lck: 45, Def: 30, Res: 35, image: "images/char-sprite/eliwood.png", joinChapter: 11, status: "alive", deathChapter: null, deathNote: null },
    { id: 2, charName: "Lyn", HP: 70, Str: 40, Mag: 0, Dex: 60, Spd: 60, Lck: 55, Def: 20, Res: 30, image: "images/char-sprite/lyn.png", joinChapter: 15, status: "alive", deathChapter: null, deathNote: null },
    { id: 3, charName: "Hector", HP: 90, Str: 60, Mag: 0, Dex: 45, Spd: 35, Lck: 30, Def: 50, Res: 25, image: "images/char-sprite/hector.png", joinChapter: 12, status: "alive", deathChapter: null, deathNote: null },
    { id: 4, charName: "Sain", HP: 80, Str: 60, Mag: 0, Dex: 35, Spd: 40, Lck: 35, Def: 20, Res: 20, image: "images/char-sprite/sain.png", joinChapter: 15, status: "alive", deathChapter: null, deathNote: null },
    { id: 5, charName: "Kent", HP: 85, Str: 40, Mag: 0, Dex: 50, Spd: 45, Lck: 20, Def: 25, Res: 25, image: "images/char-sprite/kent.png", joinChapter: 15, status: "alive", deathChapter: null, deathNote: null },
    { id: 6, charName: "Florina", HP: 60, Str: 40, Mag: 0, Dex: 50, Spd: 55, Lck: 50, Def: 15, Res: 35, image: "images/char-sprite/florina.png", joinChapter: 15, status: "alive", deathChapter: null, deathNote: null },
    { id: 7, charName: "Wil", HP: 75, Str: 50, Mag: 0, Dex: 50, Spd: 40, Lck: 40, Def: 20, Res: 25, image: "images/char-sprite/wil.png", joinChapter: 15, status: "alive", deathChapter: null, deathNote: null },
    { id: 8, charName: "Dorcas", HP: 80, Str: 60, Mag: 0, Dex: 40, Spd: 20, Lck: 45, Def: 25, Res: 15, image: "images/char-sprite/dorcas.png", joinChapter: 11, status: "alive", deathChapter: null, deathNote: null },
    { id: 9, charName: "Serra", HP: 50, Str: 0, Mag: 50, Dex: 30, Spd: 40, Lck: 60, Def: 15, Res: 55, image: "images/char-sprite/serra.png", joinChapter: 13, status: "alive", deathChapter: null, deathNote: null },
    { id: 10, charName: "Erk", HP: 65, Str: 0, Mag: 40, Dex: 40, Spd: 50, Lck: 30, Def: 20, Res: 40, image: "images/char-sprite/erk.png", joinChapter: 14, status: "alive", deathChapter: null, deathNote: null },
    { id: 11, charName: "Rath", HP: 80, Str: 50, Mag: 0, Dex: 40, Spd: 50, Lck: 30, Def: 10, Res: 25, image: "images/char-sprite/rath.png", joinChapter: 21, status: "alive", deathChapter: null, deathNote: null },
    { id: 12, charName: "Matthew", HP: 75, Str: 30, Mag: 0, Dex: 40, Spd: 70, Lck: 50, Def: 25, Res: 20, image: "images/char-sprite/matthew.png", joinChapter: 13, status: "alive", deathChapter: null, deathNote: null },
    { id: 13, charName: "Wallace", HP: 70, Str: 45, Mag: 0, Dex: 40, Spd: 20, Lck: 30, Def: 35, Res: 35, image: "images/char-sprite/wallace.png", joinChapter: 23, status: "alive", deathChapter: null, deathNote: null },
    { id: 14, charName: "Lowen", HP: 90, Str: 30, Mag: 0, Dex: 30, Spd: 30, Lck: 50, Def: 40, Res: 30, image: "images/char-sprite/lowen.png", joinChapter: 11, status: "alive", deathChapter: null, deathNote: null },
    { id: 15, charName: "Rebecca", HP: 60, Str: 40, Mag: 0, Dex: 50, Spd: 60, Lck: 50, Def: 15, Res: 30, image: "images/char-sprite/rebecca.png", joinChapter: 11, status: "alive", deathChapter: null, deathNote: null },
    { id: 16, charName: "Marcus", HP: 65, Str: 30, Mag: 0, Dex: 50, Spd: 25, Lck: 30, Def: 15, Res: 35, image: "images/char-sprite/marcus.png", joinChapter: 11, status: "alive", deathChapter: null, deathNote: null },
    { id: 17, charName: "Bartre", HP: 85, Str: 50, Mag: 0, Dex: 35, Spd: 40, Lck: 30, Def: 30, Res: 25, image: "images/char-sprite/bartre.png", joinChapter: 11, status: "alive", deathChapter: null, deathNote: null },
    { id: 18, charName: "Oswin", HP: 90, Str: 40, Mag: 0, Dex: 30, Spd: 30, Lck: 35, Def: 55, Res: 30, image: "images/char-sprite/oswin.png", joinChapter: 12, status: "alive", deathChapter: null, deathNote: null },
    { id: 19, charName: "Guy", HP: 75, Str: 30, Mag: 0, Dex: 50, Spd: 70, Lck: 45, Def: 15, Res: 25, image: "images/char-sprite/guy.png", joinChapter: 13, status: "alive", deathChapter: null, deathNote: null },
    { id: 20, charName: "Merlinus", HP: 120, Str: 0, Mag: 0, Dex: 90, Spd: 90, Lck: 100, Def: 30, Res: 15, image: "images/char-sprite/merlinus.png", joinChapter: 14, status: "alive", deathChapter: null, deathNote: null },
    { id: 21, charName: "Priscilla", HP: 45, Str: 0, Mag: 40, Dex: 50, Spd: 40, Lck: 65, Def: 15, Res: 50, image: "images/char-sprite/priscilla.png", joinChapter: 14, status: "alive", deathChapter: null, deathNote: null },
    { id: 22, charName: "Raven", HP: 85, Str: 55, Mag: 0, Dex: 40, Spd: 45, Lck: 35, Def: 25, Res: 15, image: "images/char-sprite/raven.png", joinChapter: 16, status: "alive", deathChapter: null, deathNote: null },
    { id: 23, charName: "Lucius", HP: 55, Str: 0, Mag: 60, Dex: 50, Spd: 40, Lck: 20, Def: 10, Res: 60, image: "images/char-sprite/lucius.png", joinChapter: 16, status: "alive", deathChapter: null, deathNote: null },
    { id: 24, charName: "Canas", HP: 70, Str: 45, Mag: 0, Dex: 40, Spd: 35, Lck: 25, Def: 25, Res: 45, image: "images/char-sprite/canas.png", joinChapter: 16, status: "alive", deathChapter: null, deathNote: null },
    { id: 25, charName: "Dart", HP: 70, Str: 65, Mag: 0, Dex: 20, Spd: 60, Lck: 35, Def: 20, Res: 15, image: "images/char-sprite/dart.png", joinChapter: 18, status: "alive", deathChapter: null, deathNote: null },
    { id: 26, charName: "Fiora", HP: 70, Str: 35, Mag: 0, Dex: 60, Spd: 50, Lck: 30, Def: 20, Res: 50, image: "images/char-sprite/fiora.png", joinChapter: 18, status: "alive", deathChapter: null, deathNote: null },
    { id: 27, charName: "Legault", HP: 60, Str: 25, Mag: 0, Dex: 45, Spd: 60, Lck: 60, Def: 25, Res: 25, image: "images/char-sprite/legault.png", joinChapter: 19, status: "alive", deathChapter: null, deathNote: null },
    // Add nils for the chapters he's in and then swap back to ninian
    { id: 28, charName: "Ninian", HP: 85, Str: 5, Mag: 0, Dex: 5, Spd: 70, Lck: 80, Def: 30, Res: 70, image: "images/char-sprite/ninian.png", joinChapter: 20, status: "alive", deathChapter: null, deathNote: null },
    { id: 29, charName: "Isadora", HP: 75, Str: 30, Mag: 0, Dex: 35, Spd: 50, Lck: 45, Def: 20, Res: 25, image: "images/char-sprite/isadora.png", joinChapter: 21, status: "alive", deathChapter: null, deathNote: null },
    { id: 30, charName: "Heath", HP: 80, Str: 50, Mag: 0, Dex: 50, Spd: 45, Lck: 20, Def: 30, Res: 20, image: "images/char-sprite/heath.png", joinChapter: 21, status: "alive", deathChapter: null, deathNote: null },
    { id: 31, charName: "Hawkeye", HP: 50, Str: 40, Mag: 0, Dex: 30, Spd: 25, Lck: 40, Def: 20, Res: 35, image: "images/char-sprite/hawkeye.png", joinChapter: 22, status: "alive", deathChapter: null, deathNote: null },
    { id: 32, charName: "Geitz", HP: 85, Str: 50, Mag: 0, Dex: 30, Spd: 40, Lck: 40, Def: 20, Res: 20, image: "images/char-sprite/geitz.png", joinChapter: 23, status: "alive", deathChapter: null, deathNote: null },
    { id: 33, charName: "Farina", HP: 75, Str: 50, Mag: 0, Dex: 40, Spd: 45, Lck: 45, Def: 25, Res: 30, image: "images/char-sprite/farina.png", joinChapter: 999, status: "alive", deathChapter: null, deathNote: null }, // PLACEHOLDER because Hector Mode only (will implement later)
    { id: 34, charName: "Pent", HP: 50, Str: 0, Mag: 30, Dex: 20, Spd: 40, Lck: 40, Def: 30, Res: 35, image: "images/char-sprite/pent.png", joinChapter: 24, status: "alive", deathChapter: null, deathNote: null },
    { id: 35, charName: "Louise", HP: 60, Str: 40, Mag: 0, Dex: 40, Spd: 40, Lck: 30, Def: 20, Res: 30, image: "images/char-sprite/louise.png", joinChapter: 24, status: "alive", deathChapter: null, deathNote: null },
    { id: 36, charName: "Karel", HP: 70, Str: 30, Mag: 0, Dex: 50, Spd: 50, Lck: 30, Def: 10, Res: 15, image: "images/char-sprite/karel.png", joinChapter: 25, status: "alive", deathChapter: null, deathNote: null },
    { id: 37, charName: "Harken", HP: 80, Str: 35, Mag: 0, Dex: 30, Spd: 40, Lck: 20, Def: 30, Res: 25, image: "images/char-sprite/harken.png", joinChapter: 25, status: "alive", deathChapter: null, deathNote: null },
    { id: 38, charName: "Nino", HP: 55, Str: 0, Mag: 50, Dex: 55, Spd: 60, Lck: 45, Def: 15, Res: 50, image: "images/char-sprite/nino.png", joinChapter: 26, status: "alive", deathChapter: null, deathNote: null },
    { id: 39, charName: "Jaffar", HP: 65, Str: 15, Mag: 0, Dex: 40, Spd: 35, Lck: 20, Def: 30, Res: 30, image: "images/char-sprite/jaffar.png", joinChapter: 26, status: "alive", deathChapter: null, deathNote: null },
    { id: 40, charName: "Vaida", HP: 60, Str: 45, Mag: 0, Dex: 25, Spd: 40, Lck: 30, Def: 25, Res: 15, image: "images/char-sprite/vaida.png", joinChapter: 27, status: "alive", deathChapter: null, deathNote: null },
    { id: 41, charName: "Karla", HP: 60, Str: 25, Mag: 0, Dex: 45, Spd: 55, Lck: 40, Def: 10, Res: 20, image: "images/char-sprite/karla.png", joinChapter: 999, status: "alive", deathChapter: null, deathNote: null }, // PLACEHOLDER because Hector Mode only (will implement later)
    { id: 42, charName: "Renault", HP: 60, Str: 40, Mag: 0, Dex: 30, Spd: 35, Lck: 15, Def: 20, Res: 40, image: "images/char-sprite/renault.png", joinChapter: 30, status: "alive", deathChapter: null, deathNote: null },
    { id: 43, charName: "Athos", HP: 0, Str: 0, Mag: 0, Dex: 0, Spd: 0, Lck: 0, Def: 0, Res: 0, image: "images/char-sprite/athos.png", joinChapter: 31, status: "alive", deathChapter: null, deathNote: null }
];


// variable declarations 

// key for storing dead characters in localStorage
const LOCAL_STORAGE_KEY = "fireEmblemIronmanSave";

const charContainer = document.querySelector(".characterContainer");
const chapSelect = document.querySelector("#chapSelect");

let currentChapter;

const navChapterButtons = document.querySelectorAll(".navChapter");
const prevButton = document.querySelector("#prevButton");
const nextButton = document.querySelector("#nextButton");

function loadGameDataFromStorage() {
    // grab the array of characters saved in local storage
    const savedGameDataString = localStorage.getItem(LOCAL_STORAGE_KEY);

    // if there's no saved data, return (keep all characters in their initial state)
    if (!savedGameDataString) {
        return;
    }

    // parse the string into an object
    const loadedGameData = JSON.parse(savedGameDataString);
    // check if there's a characters property in the loaded game data
    if (loadedGameData.characters) {        
        // load character state
        loadedGameData.characters.forEach(loadedChar => {
            // find the corresponding character in the global characters array
            const existingChar = characters.find(c => c.id == loadedChar.id);
            if (existingChar) {
                // update the character's status, death chapter, and death note
                existingChar.status = loadedChar.status;
                existingChar.deathChapter = loadedChar.deathChapter;
                existingChar.deathNote = loadedChar.deathNote;
            }
        });

        // check if the current chapter property exists in loaded data
        if (loadedGameData.currentChapter != null) {
            // update global chapter variable
            currentChapter = loadedGameData.currentChapter;
            // update dropdown to reflect the loaded chapter
            chapSelect.value = currentChapter;
        }
    }
}

function saveGameDataToStorage() {
    const saveData = {
        // the characters array 
        characters: characters,
        // the current chapter (global variable)
        currentChapter: currentChapter
    };
    // saves global characters array in string format to localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(saveData));
}

function populateChapterDropdown() {
    // For Eliwood mode (which is the default; will implement others later.)
    for (let i = 11; i <= 31; i++) {
        const chapterNum = document.createElement("option");
        chapterNum.value = i;
        chapterNum.textContent = `Chapter ${i}`;
        chapSelect.append(chapterNum);
    }

    // initialize chapter to chapter 11 (first Eliwood chapter)
    chapSelect.selectedIndex = 1;
    currentChapter = chapSelect.value;
}

// filter helper function
function filterJoinChapter(character) {
    return character.joinChapter <= chapSelect.value;
}

function filterCharactersByChapter() {
    const chapSelected = chapSelect.value;
    // if no specific chapter is selected, display characters for all chapters.
    if (chapSelected == "All" || chapSelected == "") {
        return characters;
    }
    // get and return filtered characters
    const filteredChars = characters.filter(filterJoinChapter);
    return filteredChars;
}

function updateChapter(direction) {
    // grab current chapter selection
    let currentChapterIndex = chapSelect.selectedIndex;
    let newChapterIndex;
    
    if (direction == "next") {
        newChapterIndex = currentChapterIndex + 1;
        // if on the last chapter, keep current selection
        if (newChapterIndex >= chapSelect.options.length) {
            newChapterIndex = currentChapterIndex;
        }
    }

    if (direction == "prev") {
        newChapterIndex = currentChapterIndex - 1;
        // if on the first chapter, keep current selection
        if (newChapterIndex < 0) {
            newChapterIndex = currentChapterIndex;
        }
    }

    // update current chapter selection based on whether it was the 'next' or 'prev' button
    chapSelect.selectedIndex = newChapterIndex;
    // updates the stored chapter value with the one at the new index
    currentChapter = chapSelect.options[newChapterIndex].value;
}

function displayCharacters(characters) {
    characters.forEach(char => {
        // container to add spacing between each display
        const displayContainer = document.createElement("div");
        displayContainer.classList.add("displayContainer");

        const unitDisplay = document.createElement("div");
        unitDisplay.classList.add("charDisplay");
        // assign the id of the character object to a custom attribute on the div for future reference
        unitDisplay.dataset.charId = char.id;

        // check character status and add 'dead' class if needed
        if (char.status == "deceased") {
            unitDisplay.classList.add("dead");
        }

        const portrait = document.createElement("img");
        portrait.src = char.image;
        portrait.alt = char.charName;

        const bigX = document.createElement("img");
        bigX.src = "images/misc/redX.png";
        bigX.alt = "Big red X";
        bigX.classList.add("redXIcon");

        const name = document.createElement("p");
        name.textContent = char.charName;

        unitDisplay.append(portrait, bigX, name);
        displayContainer.append(unitDisplay);
        charContainer.append(displayContainer);
});
}

function generateDeathConfirmationModal(characterName, chapter) {
    // creates the html for a modal to confirm if the character died
    return `
      <div class="deathModal">
        <div class="modalContent">
          <div class="closeButtonContainer">
            <button class="closeButton">X</button>
          </div>

          <div class="modalDetailsContainer">
            <div class="modalDetails">
              <p><span class="deathModalSpecialText chapterText">Chapter ${chapter}</span></p>
              <div class="characterModalInfo">
                <div class="portraitContainer">
                  <img src="images/char-sprite/${characterName}.png">
                </div>
                <p>Did <span class="deathModalSpecialText">${characterName}</span> fall in battle?</p>
              </div>
            </div>

            <div class="deathConfirmationContainer">
              <button id="yesButton">Yes</button>
              <button id="noButton">No</button>
            </div>
          </div>

          <div class="deathNoteSection hidden"> 
            <p>How did <span class="deathModalSpecialText">${characterName}</span> meet their end? (Optional)</p>
            <textarea id="deathNoteInput" rows="6" placeholder="Crit by a sniper ambush spawn..."></textarea>
            <div class="noteOptionsContainer">
              <button id="saveNoteButton">Save</button>
              <button id="cancelNoteButton">Cancel</button>
            </div>
          </div>

        </div>
      </div>
    `;
}

function modalHandler(characterDisplayElement) {
    // grab unique attribute on character display
    const charDisplayId = characterDisplayElement.dataset.charId;
    let characterForModal;

    // grab the first character object that has the ID
    characterForModal = characters.find(c => c.id == charDisplayId);

    // if no character object is found, prevent the modal from opening.
    if (!characterForModal) {
        console.error("Character not found for modal.")
        return;
    }

    // grab the character's name
    const characterName = characterForModal.charName.toLowerCase();
    // display the modal
    document.body.insertAdjacentHTML("beforeend", generateDeathConfirmationModal(characterName, currentChapter));

    const yesButton = document.querySelector("#yesButton");
    const noButton = document.querySelector("#noButton");
    const closeButton = document.querySelector(".closeButton");

    // if yes is clicked, move on to prompting for death note
    yesButton.addEventListener("click", () => {
        promptForDeathNote(characterForModal, characterDisplayElement);
    });
    // otherwise, close the modal
    noButton.addEventListener("click", closeDeathModal);
    closeButton.addEventListener("click", closeDeathModal);
}

function promptForDeathNote(character, characterDisplayElement) {
    // grab and remove the death confirmation text
    const modalDetails = document.querySelector(".modalDetailsContainer");
    modalDetails.remove();

    const deathNoteSection = document.querySelector(".deathNoteSection");
    // show the death note prompt and input box
    deathNoteSection.classList.remove("hidden");

    const deathNoteInputBox = document.querySelector("#deathNoteInput");
    const saveButton = document.querySelector("#saveNoteButton");
    const cancelButton = document.querySelector("#cancelNoteButton");

    saveButton.addEventListener("click", () => {
        // grab death note provided by the user
        const deathNote = deathNoteInputBox.value.trim();
        // if user leaves it blank, provide a generic death description
        if (deathNote == "") {
            deathNote = "Died fighting for a better future.";
        }
        saveDeathNote(character, deathNote, characterDisplayElement);
    });

    cancelButton.addEventListener("click", closeDeathModal)
}

function closeDeathModal() {
    const deathModal = document.querySelector(".deathModal");
    deathModal.remove();
}

function saveDeathNote(character, deathNote, characterDisplayElement) {
    // update character's status, death chapter, and death note in characters array
    character.status = "deceased";
    character.deathChapter = currentChapter;
    character.deathNote = deathNote;

    saveGameDataToStorage();
    // update character display to show dead class styling
    characterDisplayElement.classList.add("dead");
    closeDeathModal();
}

function gameOverModalHTML() {
    return `
    <div class="gameOverModal">
      <div class="gameOverModalContent">
        <img src="images/misc/fe7-game-over.png alt="Game over screen">
      </div>
    </div>
    `
}

// FUNCTION TO DISPLAY GAMEOVER MODAL (WHEN LORD DIES)

// All initial function calls

populateChapterDropdown();
loadGameDataFromStorage();
filteredChars = filterCharactersByChapter();
displayCharacters(filteredChars);

// event listeners

chapSelect.addEventListener("change", () => {
    // update current chapter
    currentChapter = chapSelect.value;
    // Clear existing characters so they don't stack
    charContainer.innerHTML = "";
    // Get filtered characters
    const filteredChars = filterCharactersByChapter();
    // Call displayCharacters with filtered list
    displayCharacters(filteredChars);
})

prevButton.addEventListener("click", () => {
    updateChapter("prev");

    // clear current selection of characters and characters by chapter
    charContainer.innerHTML = "";
    const filteredChars = filterCharactersByChapter();
    displayCharacters(filteredChars);
})

nextButton.addEventListener("click", () => {
    updateChapter("next");

    charContainer.innerHTML = "";
    const filteredChars = filterCharactersByChapter();
    displayCharacters(filteredChars);
})

// call toggleCharacterPortrait when user clicks on a unit display
charContainer.addEventListener("click", (event) => {
    // grab the specific character display clicked
    let selectedCharElement = event.target.closest(".charDisplay");
    // if user selects a unit display and the unit is not already dead...
    if (selectedCharElement && !selectedCharElement.classList.contains("dead")) {
        // open the modal
        modalHandler(selectedCharElement);
    }
})