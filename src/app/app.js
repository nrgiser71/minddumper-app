// Mock data
const triggerWords = {
    nl: ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit', 'Sed', 'Do', 'Eiusmod', 'Tempor'],
    en: ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit', 'Sed', 'Do', 'Eiusmod', 'Tempor'],
    de: ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit', 'Sed', 'Do', 'Eiusmod', 'Tempor'],
    fr: ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit', 'Sed', 'Do', 'Eiusmod', 'Tempor'],
    es: ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit', 'Sed', 'Do', 'Eiusmod', 'Tempor']
};

// Global state
let currentLanguage = 'nl';
let currentWordIndex = 0;
let currentIdeas = [];
let allIdeas = [];

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
}

// Language selection and start mind dump
function startMindDump(language) {
    currentLanguage = language;
    currentWordIndex = 0;
    currentIdeas = [];
    allIdeas = [];
    
    showScreen('minddump-screen');
    updateMindDumpScreen();
    
    // Focus on input
    setTimeout(() => {
        document.querySelector('.idea-input').focus();
    }, 100);
}

// Update mind dump screen
function updateMindDumpScreen() {
    const words = triggerWords[currentLanguage];
    const currentWord = words[currentWordIndex];
    const progress = Math.round((currentWordIndex / words.length) * 100);
    
    // Update trigger word
    document.querySelector('.trigger-word').textContent = currentWord;
    
    // Update progress
    document.querySelector('.progress-fill').style.width = progress + '%';
    document.querySelector('.progress-text').textContent = progress + '%';
    
    // Update current ideas section
    const ideasSection = document.querySelector('.current-ideas h3');
    ideasSection.textContent = `Ideeën voor "${currentWord}":`;
    
    // Clear ideas list
    const ideasList = document.querySelector('.ideas-list');
    ideasList.innerHTML = '';
    
    // Show current ideas for this word
    currentIdeas.forEach(idea => {
        const ideaDiv = document.createElement('div');
        ideaDiv.className = 'idea-item';
        ideaDiv.textContent = idea;
        ideasList.appendChild(ideaDiv);
    });
    
    // Clear input
    document.querySelector('.idea-input').value = '';
    document.querySelector('.idea-input').focus();
}

// Handle idea input
document.addEventListener('DOMContentLoaded', function() {
    const ideaInput = document.querySelector('.idea-input');
    
    if (ideaInput) {
        ideaInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const idea = this.value.trim();
                
                if (idea) {
                    // Add idea to current word
                    currentIdeas.push(idea);
                    allIdeas.push(idea);
                    
                    // Update display
                    const ideasList = document.querySelector('.ideas-list');
                    const ideaDiv = document.createElement('div');
                    ideaDiv.className = 'idea-item';
                    ideaDiv.textContent = idea;
                    ideasList.appendChild(ideaDiv);
                    
                    // Clear input
                    this.value = '';
                } else {
                    // Empty input - go to next word
                    nextWord();
                }
            }
        });
    }
});

// Go to next word
function nextWord() {
    const words = triggerWords[currentLanguage];
    
    // Save current ideas for this word
    currentIdeas = [];
    currentWordIndex++;
    
    if (currentWordIndex >= words.length) {
        // Finished all words
        finishMindDump();
    } else {
        // Update to next word
        updateMindDumpScreen();
    }
}

// Finish mind dump
function finishMindDump() {
    // Update finish screen with results
    document.querySelector('.summary-stats .stat:nth-child(1) .stat-number').textContent = allIdeas.length;
    document.querySelector('.summary-stats .stat:nth-child(2) .stat-number').textContent = currentWordIndex;
    
    // Update ideas list
    const exportList = document.querySelector('.ideas-export-list');
    exportList.innerHTML = '';
    
    allIdeas.slice(0, 10).forEach(idea => {
        const ideaDiv = document.createElement('div');
        ideaDiv.className = 'export-item';
        ideaDiv.textContent = idea;
        exportList.appendChild(ideaDiv);
    });
    
    // Update show more text
    if (allIdeas.length > 10) {
        document.querySelector('.show-more').textContent = `... en nog ${allIdeas.length - 10} ideeën`;
    } else {
        document.querySelector('.show-more').style.display = 'none';
    }
    
    showScreen('finish-screen');
}

// Export mind dump
function exportMindDump() {
    const textList = allIdeas.map(idea => `- ${idea}`).join('\\n');
    
    // Create downloadable text file
    const blob = new Blob([textList], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mind-dump-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Je mind dump is geëxporteerd als tekstbestand!');
}

// View mind dump from history
function viewMindDump(id) {
    // Mock: show finish screen with example data
    showScreen('finish-screen');
}