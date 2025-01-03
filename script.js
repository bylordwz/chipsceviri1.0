document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const translateBtn = document.getElementById('translateBtn');
    const switchBtn = document.getElementById('switchBtn');

    let isChipsToNormal = false;

    const replacements = {
        'yapıyorum': 'yapıyüm',
        'ediyorum': 'ediyüm',
        'bakıyorum': 'bakıyüm',
        'yorum': 'yüm',
        'baba': 'babiş',
        'saç kurutucu': 'saç kuruyutucu',
        'ayıp': 'ayip',
        'salak': 'amın düdüğü',
        'mal': 'amın düdüğü'
    };

    const angerPhrases = [
        'amın düdüğü',
        'ebenin a...',
        'senin ananı sikeyim orospu çocuğu',
        'amınıza gorum',
        'olum pisleşmeyin',
        'regal ettiniz beni yav'
    ];

    function preserveCase(original, replacement) {
        if (original === original.toLowerCase()) return replacement.toLowerCase();
        if (original === original.toUpperCase()) return replacement.toUpperCase();
        if (original[0] === original[0].toUpperCase()) {
            return replacement[0].toUpperCase() + replacement.slice(1).toLowerCase();
        }
        return replacement.toLowerCase();
    }

    function replaceWithCase(text, search, replacement) {
        const regex = new RegExp(search, 'gi');
        return text.replace(regex, match => preserveCase(match, replacement));
    }

    function addHeğ(text) {
        // Split into paragraphs while preserving empty lines
        let paragraphs = text.split(/(\n\s*\n)/);
        
        return paragraphs.map((part, index) => {
            // If it's a paragraph separator (empty lines), keep it as is
            if (index % 2 === 1) return part;
            
            // Process paragraph
            let parts = part.split(/(?<=\S)([.!?]+\s*)/);
            let result = '';
            
            for (let i = 0; i < parts.length; i++) {
                if (i % 2 === 0) { // Sentence content
                    let sentence = parts[i].trimEnd();
                    if (sentence && !sentence.endsWith('heğ')) {
                        result += sentence + ' heğ';
                    } else {
                        result += sentence;
                    }
                } else { // Punctuation and spacing
                    result += parts[i];
                }
            }
            
            return result.trim();
        }).join('');
    }

    function removeHeğ(text) {
        // Split into paragraphs while preserving empty lines
        let paragraphs = text.split(/(\n\s*\n)/);
        
        return paragraphs.map((part, index) => {
            // If it's a paragraph separator (empty lines), keep it as is
            if (index % 2 === 1) return part;
            
            // Remove heğ from paragraph
            return part.replace(/\s+heğ(?=\s*[.!?]+|\s*$)/g, '');
        }).join('');
    }

    function normalToChips(text) {
        // Random chance to add stutter (simulating headache)
        const hasStutter = Math.random() < 0.1;
        if (hasStutter) {
            text = text.split(' ').map(word => 
                Math.random() < 0.3 ? word[0] + '-' + word : word
            ).join(' ');
        }

        // Replace words according to rules with case preservation
        Object.entries(replacements).forEach(([key, value]) => {
            text = replaceWithCase(text, key, value);
        });

        // Special case replacements with case preservation
        text = replaceWithCase(text, 'pıyorsunuz', 'püyünüz');
        text = replaceWithCase(text, 'pıyorsun', 'püyün');
        text = replaceWithCase(text, 'pıyon', 'püyün');

        // Replace all "yorsunuz" with "yünüz" and "yor" with "yü" with case preservation
        text = text.replace(/([a-zçğıöşüA-ZÇĞIÖŞÜ])yorsunuz([^a-zçğıöşüA-ZÇĞIÖŞÜ]|$)/g, (match, p1, p2) => {
            return preserveCase(match, p1 + 'yünüz' + p2);
        });
        text = text.replace(/([a-zçğıöşüA-ZÇĞIÖŞÜ])yor([^a-zçğıöşüA-ZÇĞIÖŞÜ]|$)/g, (match, p1, p2) => {
            return preserveCase(match, p1 + 'yü' + p2);
        });

        // Random chance to add anger phrases
        if (Math.random() < 0.05) {
            text += ' ' + angerPhrases[Math.floor(Math.random() * angerPhrases.length)];
        }

        // Add heğ to end of sentences
        text = addHeğ(text);

        return text;
    }

    function chipsToNormal(text) {
        // Remove anger phrases
        for (const phrase of angerPhrases) {
            text = text.replace(new RegExp('\\s*' + phrase + '$', 'i'), '');
        }

        // Remove heğ from sentences
        text = removeHeğ(text);

        // Remove stutters
        text = text.replace(/([a-zçğıöşüA-ZÇĞIÖŞÜ])-\1[a-zçğıöşüA-ZÇĞIÖŞÜ]+/g, match => match.split('-')[1]);

        // Reverse special cases with case preservation
        text = replaceWithCase(text, 'püyünüz', 'pıyorsunuz');
        text = replaceWithCase(text, 'püyün', 'pıyorsun');

        // Reverse replacements with case preservation
        Object.entries(replacements).forEach(([normal, chips]) => {
            text = replaceWithCase(text, chips, normal);
        });

        // Replace "yünüz" back to "yorsunuz" and "yü" back to "yor" with case preservation
        text = text.replace(/([a-zçğıöşüA-ZÇĞIÖŞÜ])yünüz([^a-zçğıöşüA-ZÇĞIÖŞÜ]|$)/g, (match, p1, p2) => {
            return preserveCase(match, p1 + 'yorsunuz' + p2);
        });
        text = text.replace(/([a-zçğıöşüA-ZÇĞIÖŞÜ])yü([^a-zçğıöşüA-ZÇĞIÖŞÜ]|$)/g, (match, p1, p2) => {
            return preserveCase(match, p1 + 'yor' + p2);
        });

        return text;
    }

    function translate() {
        const input = inputText.value;
        const translated = isChipsToNormal ? chipsToNormal(input) : normalToChips(input);
        outputText.textContent = translated;
    }

    switchBtn.addEventListener('click', () => {
        isChipsToNormal = !isChipsToNormal;
        
        // Update labels
        document.getElementById('inputLabel').textContent = isChipsToNormal ? 
            "Chips Türkçesi" : 
            "Normal Türkçe";
        document.getElementById('outputLabel').textContent = isChipsToNormal ? 
            "Normal Türkçe" : 
            "Chips Türkçesi";
            
        inputText.placeholder = isChipsToNormal ? 
            "Chips Türkçesi metni girin..." : 
            "Normal Türkçe metni girin...";
            
        if (inputText.value) {
            translate();
        }
    });

    translateBtn.addEventListener('click', translate);

    // Also translate while typing with a small delay
    let timeout = null;
    inputText.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(translate, 500);
    });
});
