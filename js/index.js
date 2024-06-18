const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const btn = document.getElementById("search-btn");

btn.addEventListener("click", () => {
  let inpWord = document.getElementById("inp-word").value;
  fetch(`${url}${inpWord}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      // Main word details
      result.innerHTML = `
        <div class="word">
          <h3>${inpWord}</h3>
          <button id="play-sound"><i class="fas fa-volume-up"></i></button>
        </div>
        <div class="details">
          <p>${data[0].meanings[0].partOfSpeech}</p>
          <p>/${data[0].phonetic || data[0].phonetics[0]?.text || ""}/</p>
        </div>
        <p class="word-meaning">
          ${data[0].meanings[0].definitions[0].definition}
        </p>`;

      // Iterate through meanings and definitions to find an example
      let exampleFound = false;
      data[0].meanings.forEach((meaning) => {
        meaning.definitions.forEach((definition) => {
          if (definition.example && !exampleFound) {
            result.innerHTML += `
              <p class="word-example">
                ${definition.example}
              </p>`;
            exampleFound = true;
          }
        });
      });

      // Add audio source for the first available pronunciation
      const phonetics = data[0].phonetics;
      let audioUrl = "";
      for (let i = 0; i < phonetics.length; i++) {
        if (phonetics[i].audio) {
          audioUrl = phonetics[i].audio;
          break;
        }
      }
      if (audioUrl) {
        const playButton = document.getElementById("play-sound");
        playButton.addEventListener("click", () => playSound(audioUrl));
      } else {
        document.getElementById("play-sound").style.display = "none";
      }
    })
    .catch(() => {
      result.innerHTML = `<h3 class="error">Couldn't Find The Word</h3>`;
    });
});

function playSound(audioUrl) {
  const sound = new Audio(audioUrl);
  sound.play();
}
