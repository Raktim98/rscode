document.addEventListener("DOMContentLoaded", () => {
    const inputWord = document.getElementById("inp-word");
    const searchBtn = document.getElementById("search-btn");
    const resultDiv = document.getElementById("result");
    const sound = document.getElementById("sound");
    const themeToggle = document.getElementById("theme-toggle");
    const loadingIndicator = document.getElementById("loading");

  
    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        const icon = themeToggle.querySelector("i");
        icon.classList.toggle("fa-moon");
        icon.classList.toggle("fa-sun");
    });

    
    searchBtn.addEventListener("click", async () => {
        let word = inputWord.value.trim();
        if (!word) {
            alert("Please enter a word!");
            return;
        }

        resultDiv.innerHTML = "";
        loadingIndicator.style.display = "block";

        try {
            let response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            let data = await response.json();
            
            if (!data || data.title) {
                resultDiv.innerHTML = `<p>No definition found.</p>`;
            } else {
                let wordData = data[0];
                let meanings = wordData.meanings.map(m => `
                    <p><strong>${m.partOfSpeech}</strong>: ${m.definitions[0].definition}</p>
                `).join("");

                let phonetics = wordData.phonetics.find(p => p.audio)?.audio || "";
                
                resultDiv.innerHTML = `
                    <h3>${wordData.word}</h3>
                    <p><strong>Phonetics:</strong> ${wordData.phonetic || "N/A"}</p>
                    ${meanings}
                    <button class="play-sound"><i class="fas fa-volume-up"></i> Pronounce</button>
                `;

                if (phonetics) {
                    sound.src = phonetics;
                    document.querySelector(".play-sound").addEventListener("click", () => sound.play());
                }
            }
        } catch (error) {
            resultDiv.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
        } finally {
            loadingIndicator.style.display = "none";
        }
    });


    inputWord.addEventListener("keypress", (event) => {
        if (event.key === "Enter") searchBtn.click();
    });
    
    // Voice input (Speech Recognition API)
    voiceBtn.addEventListener("click", () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.start();
        recognition.onresult = (event) => {
            inputWord.value = event.results[0][0].transcript;
            fetchWordData(inputWord.value);
        };
    });
});
