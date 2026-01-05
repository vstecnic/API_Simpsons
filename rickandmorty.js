// API Configuration
const API_BASE_URL = 'https://rickandmortyapi.com/api';
const API_CHARACTERS_ENDPOINT = `${API_BASE_URL}/character`;

// DOM Elements
const charactersGrid = document.getElementById('charactersGrid');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const showAllBtn = document.getElementById('showAllBtn');
const statusFilter = document.getElementById('statusFilter');
const speciesFilter = document.getElementById('speciesFilter');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const retryBtn = document.getElementById('retryBtn');

// State
let currentPage = 1;
let totalPages = 1;
let isSearching = false;
let searchQuery = '';
let currentStatus = '';
let currentSpecies = '';
let allCharactersMap = new Map();

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadCharacters(1);
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
        statusFilter.value = '';
        speciesFilter.value = '';
        resetSearch();
    });

    statusFilter.addEventListener('change', handleFilter);
    speciesFilter.addEventListener('change', handleFilter);
    loadMoreBtn.addEventListener('click', loadMoreCharacters);
    retryBtn.addEventListener('click', () => loadCharacters(1));
}

// Fetch characters from API
async function loadCharacters(page) {
    try {
        showLoading();
        hideError();

        let url = `${API_CHARACTERS_ENDPOINT}?page=${page}`;

        if (searchQuery) {
            url += `&name=${encodeURIComponent(searchQuery)}`;
        }
        if (currentStatus) {
            url += `&status=${encodeURIComponent(currentStatus)}`;
        }
        if (currentSpecies) {
            url += `&species=${encodeURIComponent(currentSpecies)}`;
        }

        console.log('Fetching:', url);
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 404) {
                showNoResults();
                hideLoading();
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data.results || data.results.length === 0) {
            if (page === 1) {
                showNoResults();
            }
            loadMoreBtn.style.display = 'none';
            hideLoading();
            return;
        }

        currentPage = page;
        totalPages = data.info.pages || 1;

        // Si es la primera página, limpiamos el grid
        if (page === 1) {
            charactersGrid.innerHTML = '';
            allCharactersMap.clear();
        }

        // Renderizar personajes
        appendCharacters(data.results);

        // Mostrar/ocultar botón "Load More"
        if (data.info.next) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
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
    searchQuery = query;
    isSearching = !!query;
    currentPage = 1;
    loadCharacters(1);
}

// Handle filter changes
function handleFilter() {
    currentStatus = statusFilter.value;
    currentSpecies = speciesFilter.value;
    currentPage = 1;
    loadCharacters(1);
}

// Reset search and filters
function resetSearch() {
    isSearching = false;
    searchQuery = '';
    currentStatus = '';
    currentSpecies = '';
    currentPage = 1;
    allCharactersMap.clear();
    charactersGrid.innerHTML = '';
    loadCharacters(1);
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
    const status = character.status || 'Unknown';
    const species = character.species || 'Unknown';
    const gender = character.gender || 'Unknown';
    const origin = character.origin?.name || 'Unknown';
    const location = character.location?.name || 'Unknown';
    const image = character.image || 'https://via.placeholder.com/300x300?text=No+Image';
    const characterId = character.id || 0;

    const statusClass = status.toLowerCase();

    return `
        <div class="character-card" onclick="showCharacterDetails(${characterId})">
            <div class="card-image-container">
                <img src="${image}" alt="${name}" class="card-image" loading="lazy">
                <span class="status-badge ${statusClass}">${status}</span>
            </div>
            <div class="card-content">
                <h2 class="card-name">${name}</h2>
                <p class="card-species">${species}</p>
                <div class="card-info">
                    <div class="card-info-item">
                        <strong>Gender:</strong>
                        <span>${gender}</span>
                    </div>
                    <div class="card-info-item">
                        <strong>Origin:</strong>
                        <span>${origin}</span>
                    </div>
                </div>
                <div class="card-location">
                    <strong>Last Location:</strong>
                    ${location}
                </div>
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

    const episodes = character.episode?.length || 0;

    alert(`${character.name}\n\nSpecies: ${character.species || 'Unknown'}\nStatus: ${character.status || 'Unknown'}\nGender: ${character.gender || 'Unknown'}\nOrigin: ${character.origin?.name || 'Unknown'}\nLocation: ${character.location?.name || 'Unknown'}\nEpisodes: ${episodes}\n\nClick OK to continue browsing.`);
}

// Show "No results" message
function showNoResults() {
    charactersGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: 12px;">
            <h2 style="color: #6b7280; margin-bottom: 1rem;">Wubba Lubba Dub Dub! No characters found</h2>
            <p style="color: #9ca3af;">Try searching for another name or adjust your filters</p>
        </div>
    `;
    loadMoreBtn.style.display = 'none';
}

// UI Helper Functions
function showLoading() {
    if (currentPage === 1) {
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
