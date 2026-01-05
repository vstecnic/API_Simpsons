// API Configuration
const API_BASE_URL = 'https://thesimpsonsapi.com/api';
const API_CHARACTERS_ENDPOINT = `${API_BASE_URL}/characters`;

// DOM Elements
const charactersGrid = document.getElementById('charactersGrid');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const showAllBtn = document.getElementById('showAllBtn');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const retryBtn = document.getElementById('retryBtn');

// State
let allCharacters = [];
let displayedCharacters = [];
let currentPage = 0;
const charactersPerPage = 20;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadAllCharacters();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    showAllBtn.addEventListener('click', () => {
        searchInput.value = '';
        loadAllCharacters();
    });
    loadMoreBtn.addEventListener('click', loadMoreCharacters);
    retryBtn.addEventListener('click', loadAllCharacters);
}

// Fetch all characters from API
async function loadAllCharacters() {
    try {
        showLoading();
        hideError();

        const response = await fetch(API_CHARACTERS_ENDPOINT);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        allCharacters = data.docs || data;

        // Reset pagination
        currentPage = 0;
        displayedCharacters = [];

        // Load first page
        loadMoreCharacters();

    } catch (err) {
        console.error('Error fetching characters:', err);
        showError();
    }
}

// Load more characters (pagination)
function loadMoreCharacters() {
    const start = currentPage * charactersPerPage;
    const end = start + charactersPerPage;
    const newCharacters = allCharacters.slice(start, end);

    displayedCharacters = [...displayedCharacters, ...newCharacters];
    currentPage++;

    renderCharacters(displayedCharacters);

    // Show/hide "Load More" button
    if (end >= allCharacters.length) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.style.display = 'block';
    }

    hideLoading();
}

// Search characters by name
async function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        loadAllCharacters();
        return;
    }

    try {
        showLoading();
        hideError();

        const response = await fetch(`${API_CHARACTERS_ENDPOINT}?name=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const characters = data.docs || data;

        if (characters.length === 0) {
            charactersGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: 12px;">
                    <h2 style="color: #6b7280; margin-bottom: 1rem;">D'oh! No characters found</h2>
                    <p style="color: #9ca3af;">Try searching for another name</p>
                </div>
            `;
            hideLoading();
            loadMoreBtn.style.display = 'none';
            return;
        }

        displayedCharacters = characters;
        renderCharacters(displayedCharacters);
        loadMoreBtn.style.display = 'none';
        hideLoading();

    } catch (err) {
        console.error('Error searching characters:', err);
        showError();
    }
}

// Render characters to DOM
function renderCharacters(characters) {
    charactersGrid.innerHTML = characters.map(character => createCharacterCard(character)).join('');
}

// Create character card HTML
function createCharacterCard(character) {
    const name = character.name || 'Unknown';
    const occupation = character.occupation || 'Unknown occupation';
    const image = character.image || character.imageUrl || 'https://via.placeholder.com/300x400?text=No+Image';
    const status = character.status || 'Unknown';
    const phrase = character.phrases && character.phrases.length > 0
        ? character.phrases[0]
        : character.phrase || 'No quote available';
    const gender = character.gender || 'Unknown';
    const age = character.age || 'Unknown';

    const statusClass = status.toLowerCase();

    return `
        <div class="character-card" onclick="showCharacterDetails('${character._id}')">
            <div class="card-image-container">
                <img src="${image}" alt="${name}" class="card-image" loading="lazy">
                <span class="status-badge ${statusClass}">${status}</span>
            </div>
            <div class="card-content">
                <h2 class="card-name">${name}</h2>
                <div class="card-info">
                    ${gender !== 'Unknown' ? `<span>👤 ${gender}</span>` : ''}
                    ${age !== 'Unknown' ? `<span>🎂 ${age}</span>` : ''}
                </div>
                <p class="card-occupation">${occupation}</p>
                ${phrase !== 'No quote available' ? `<p class="card-quote">"${phrase}"</p>` : ''}
            </div>
        </div>
    `;
}

// Show character details (can be expanded to a modal)
function showCharacterDetails(characterId) {
    const character = allCharacters.find(c => c._id === characterId) ||
                      displayedCharacters.find(c => c._id === characterId);

    if (character) {
        console.log('Character details:', character);
        // You can implement a modal here to show more details
        alert(`${character.name}\n\nOccupation: ${character.occupation || 'Unknown'}\nStatus: ${character.status || 'Unknown'}\n\nClick OK to continue browsing.`);
    }
}

// UI Helper Functions
function showLoading() {
    loading.style.display = 'block';
    charactersGrid.style.display = 'none';
    error.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    charactersGrid.style.display = 'grid';
}

function showError() {
    error.style.display = 'block';
    loading.style.display = 'none';
    charactersGrid.style.display = 'none';
}

function hideError() {
    error.style.display = 'none';
}
