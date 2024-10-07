const textarea = document.querySelector("#text"),
      voiceList = document.querySelector("#voice"),
      speechBtn = document.querySelector("#speech-btn");

let synth = speechSynthesis,
    isSpeaking = false;

// Carrega as vozes disponíveis
function loadVoices() {
    voiceList.innerHTML = ''; // Limpa as opções existentes
    let voices = synth.getVoices();

    if (voices.length === 0) {
        // Algumas vezes as vozes ainda não estão carregadas
        synth.addEventListener('voiceschanged', loadVoices);
        return;
    }

    voices.forEach((voice, index) => {
        let option = document.createElement('option');
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        if (voice.default) {
            option.selected = true;
        }
        voiceList.appendChild(option);
    });
}

// Chama a função para carregar vozes
loadVoices();

// Adiciona evento para carregar vozes quando elas mudam
synth.addEventListener("voiceschanged", loadVoices);

// Função para converter texto em fala
function textToSpeech(text) {
    if (synth.speaking) {
        console.error("speechSynthesis.speaking");
        return;
    }
    if (text !== "") {
        let utterance = new SpeechSynthesisUtterance(text);
        let selectedVoice = voiceList.value;
        utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice);
        synth.speak(utterance);

        // Atualiza o botão para "Pause Speech"
        speechBtn.innerText = "Pause Speech";
        isSpeaking = true;
    }
}

// Evento de clique no botão
speechBtn.addEventListener("click", e => {
    e.preventDefault();
    if (textarea.value !== "") {
        if (!synth.speaking) {
            textToSpeech(textarea.value);
        } else {
            if (synth.paused) {
                synth.resume();
                speechBtn.innerText = "Pause Speech";
                isSpeaking = true;
            } else {
                synth.pause();
                speechBtn.innerText = "Resume Speech";
                isSpeaking = false;
            }
        }
    }
});

// Evento para quando a fala termina
synth.addEventListener('end', () => {
    speechBtn.innerText = "Convert To Speech";
    isSpeaking = false;
});
