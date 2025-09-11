document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const textToTranslate = document.getElementById('text-to-translate');
    const targetLanguageSelect = document.getElementById('language-select');
    const translateBtn = document.getElementById('translate-btn');
    const translatedText = document.getElementById('translated-text');
    const speakBtn = document.getElementById('speak-btn');
    const voiceSelect = document.getElementById('voice-select');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history-btn');

    // --- Translation Logic ---
    async function translate(text, targetLang) {
        if (!text.trim()) {
            return "";
        }
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
            const data = await response.json();
            if (data && data[0]) {
                return data[0].map(sentence => sentence[0]).join('');
            } else {
                throw new Error("Invalid response format");
            }
        } catch (error) {
            console.error("Translation Error:", error);
            return "حدث خطأ أثناء الترجمة. يرجى المحاولة مرة أخرى.";
        }
    }

    // --- History Logic ---
    const getHistory = () => JSON.parse(localStorage.getItem('translationHistory')) || [];
    const saveHistory = (history) => localStorage.setItem('translationHistory', JSON.stringify(history));

    function displayHistory() {
        historyList.innerHTML = '';
        const history = getHistory();
        history.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="original-text">${item.original}</div>
                <div class="translated-text">${item.translated}</div>
            `;
            historyList.appendChild(li);
        });
    }

    function addToHistory(original, translated) {
        if (!original || !translated) return;
        const history = getHistory();
        const newEntry = { original, translated };
        const newHistory = [newEntry, ...history].slice(0, 100); // Keep last 100
        saveHistory(newHistory);
        displayHistory();
    }

    // --- Speech Synthesis Logic ---
    const synth = window.speechSynthesis;
    let voices = [];

    function populateVoiceList() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = '';
        voices.forEach(voice => {
            const option = document.createElement('option');
            option.textContent = `${voice.name} (${voice.lang})`;
            option.setAttribute('data-lang', voice.lang);
            option.setAttribute('data-name', voice.name);
            voiceSelect.appendChild(option);
        });
    }

    function speak() {
        if (synth.speaking) return;
        if (translatedText.value !== '') {
            const utterThis = new SpeechSynthesisUtterance(translatedText.value);
            const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
            const selectedVoice = voices.find(voice => voice.name === selectedVoiceName);
            utterThis.voice = selectedVoice;
            synth.speak(utterThis);
        }
    }

    // --- Event Listeners ---
    translateBtn.addEventListener('click', async () => {
        const text = textToTranslate.value;
        const lang = targetLanguageSelect.value;
        translatedText.value = 'جاري الترجمة...';
        const result = await translate(text, lang);
        translatedText.value = result;
        if (result && !result.startsWith("حدث خطأ")) {
            addToHistory(text, result);
        }
    });

    speakBtn.addEventListener('click', speak);

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('translationHistory');
        displayHistory();
    });

    // --- Initial Calls ---
    populateVoiceList();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoiceList;
    }
    displayHistory();
});
