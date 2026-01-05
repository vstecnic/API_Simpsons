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
let currentPage = 0;
let totalPages = 1;
let isSearching = false;
let searchQuery = '';
let allCharactersMap = new Map(); // Store characters by ID

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadCharacters(0);
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
        isSearching = false;
        searchQuery = '';
        currentPage = 0;
        allCharactersMap.clear();
        charactersGrid.innerHTML = '';
        loadCharacters(0);
    });
    loadMoreBtn.addEventListener('click', loadMoreCharacters);
    retryBtn.addEventListener('click', () => loadCharacters(0));
}

// Fetch characters from API
async function loadCharacters(page) {
    try {
        showLoading();
        hideError();

        let url = `${API_CHARACTERS_ENDPOINT}?page=${page}&limit=20`;

        if (isSearching && searchQuery) {
            url += `&name=${encodeURIComponent(searchQuery)}`;
        }

        console.log('Fetching:', url);
        const response = await fetch(url);
        console.log('Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        console.log('Results count:', data.results ? data.results.length : 0);

        // La API devuelve: { count, next, prev, pages, results }
        if (!data.results || data.results.length === 0) {
            if (page === 0) {
                showNoResults();
            }
            loadMoreBtn.style.display = 'none';
            hideLoading();
            return;
        }

        currentPage = page;
        totalPages = data.pages || 1;

        // Si es la primera página, limpiamos el grid
        if (page === 0) {
            charactersGrid.innerHTML = '';
        }

        // Renderizar personajes
        appendCharacters(data.results);

        // Mostrar/ocultar botón "Load More"
        if (page + 1 >= totalPages) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }

        hideLoading();

    } catch (err) {
        console.error('Error fetching characters:', err);
        showError();
    }
}

// Load more characters (next page)
function loadMoreCharacters() {
    loadCharacters(currentPage + 1);
}

// Search characters by name
function handleSearch() {
    const query = searchInput.value.trim();

    if (!query) {
        showAllBtn.click();
        return;
    }

    isSearching = true;
    searchQuery = query;
    currentPage = 0;
    allCharactersMap.clear();
    charactersGrid.innerHTML = '';
    loadCharacters(0);
}

// Append characters to grid
function appendCharacters(characters) {
    // Store characters in map for later reference
    characters.forEach(char => {
        if (char.id) {
            allCharactersMap.set(char.id, char);
        }
    });

    const cardsHTML = characters.map(character => createCharacterCard(character)).join('');
    charactersGrid.insertAdjacentHTML('beforeend', cardsHTML);
}

// Create character card HTML
function createCharacterCard(character) {
    const name = character.name || 'Unknown';
    const occupation = character.occupation || 'Unknown occupation';

    // Las imágenes se sirven desde el CDN usando el ID del personaje
    const characterId = character.id;
    const image = characterId
        ? `https://cdn.thesimpsonsapi.com/500/character/${characterId}.webp`
        : 'https://via.placeholder.com/300x400?text=No+Image';

    const status = character.status || 'Unknown';
    const phrase = character.phrases && character.phrases.length > 0
        ? character.phrases[0]
        : 'No quote available';
    const gender = character.gender || 'Unknown';
    const age = character.age || 'Unknown';

    const statusClass = status.toLowerCase();
    const characterId = character.id || Math.random();

    return `
        <div class="character-card" onclick="showCharacterDetails(${characterId})">
            <div class="card-image-container">
                <img src="${image}" alt="${name}" class="card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/300x400?text=No+Image'">
                <span class="status-badge ${statusClass}">${status}</span>
            </div>
            <div class="card-content">
                <h2 class="card-name">${name}</h2>
                <div class="card-info">
                    ${gender !== 'Unknown' ? `<span>👤 ${gender}</span>` : ''}
                    ${age !== 'Unknown' && age !== null ? `<span>🎂 ${age}</span>` : ''}
                </div>
                <p class="card-occupation">${occupation}</p>
                ${phrase !== 'No quote available' ? `<p class="card-quote">"${phrase}"</p>` : ''}
            </div>
        </div>
    `;
}

// Show character details
function showCharacterDetails(characterId) {
    const character = allCharactersMap.get(characterId);

    if (!character) {
        console.error('Character not found:', characterId);
        return;
    }

    console.log('Character details:', character);

    const phrases = character.phrases && character.phrases.length > 0
        ? character.phrases.join('\n- ')
        : 'No quotes available';

    alert(`${character.name}\n\nOccupation: ${character.occupation || 'Unknown'}\nStatus: ${character.status || 'Unknown'}\nGender: ${character.gender || 'Unknown'}\nAge: ${character.age || 'Unknown'}\n\nFamous Quotes:\n- ${phrases}\n\nClick OK to continue browsing.`);
}

// Show "No results" message
function showNoResults() {
    charactersGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: 12px;">
            <h2 style="color: #6b7280; margin-bottom: 1rem;">D'oh! No characters found</h2>
            <p style="color: #9ca3af;">Try searching for another name</p>
        </div>
    `;
}

// UI Helper Functions
function showLoading() {
    if (currentPage === 0) {
        loading.style.display = 'block';
        charactersGrid.style.display = 'none';
    }
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
