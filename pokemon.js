// API Configuration
const API_BASE_URL = 'https://pokeapi.co/api/v2';
const API_POKEMON_ENDPOINT = `${API_BASE_URL}/pokemon`;
const POKEMON_PER_PAGE = 20;

// DOM Elements
const pokemonGrid = document.getElementById('pokemonGrid');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const showAllBtn = document.getElementById('showAllBtn');
const typeFilter = document.getElementById('typeFilter');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const retryBtn = document.getElementById('retryBtn');

// State
let currentOffset = 0;
let isSearching = false;
let searchQuery = '';
let currentType = '';
let allPokemonMap = new Map();

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadPokemon(0);
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
        typeFilter.value = '';
        resetSearch();
    });

    typeFilter.addEventListener('change', handleTypeFilter);
    loadMoreBtn.addEventListener('click', loadMorePokemon);
    retryBtn.addEventListener('click', () => loadPokemon(0));
}

// Fetch Pokemon from API
async function loadPokemon(offset) {
    try {
        showLoading();
        hideError();

        let url = `${API_POKEMON_ENDPOINT}?offset=${offset}&limit=${POKEMON_PER_PAGE}`;

        console.log('Fetching:', url);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data.results || data.results.length === 0) {
            if (offset === 0) {
                showNoResults();
            }
            loadMoreBtn.style.display = 'none';
            hideLoading();
            return;
        }

        currentOffset = offset;

        // Si es la primera página, limpiamos el grid
        if (offset === 0) {
            pokemonGrid.innerHTML = '';
            allPokemonMap.clear();
        }

        // Fetch detalles de cada pokemon
        await fetchPokemonDetails(data.results);

        // Mostrar/ocultar botón "Load More"
        if (data.next) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }

        hideLoading();

    } catch (err) {
        console.error('Error fetching pokemon:', err);
        showError();
    }
}

// Fetch details for each pokemon
async function fetchPokemonDetails(pokemonList) {
    const promises = pokemonList.map(pokemon =>
        fetch(pokemon.url)
            .then(res => res.json())
            .catch(err => {
                console.error(`Error fetching ${pokemon.name}:`, err);
                return null;
            })
    );

    const results = await Promise.all(promises);
    const validPokemon = results.filter(p => p !== null);

    // Store in map and render
    validPokemon.forEach(pokemon => {
        if (pokemon.id) {
            allPokemonMap.set(pokemon.id, pokemon);
        }
    });

    appendPokemon(validPokemon);
}

// Load more pokemon (next page)
function loadMorePokemon() {
    loadPokemon(currentOffset + POKEMON_PER_PAGE);
}

// Search pokemon by name or number
async function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        resetSearch();
        return;
    }

    try {
        showLoading();
        hideError();
        pokemonGrid.innerHTML = '';

        console.log('Searching for:', query);
        const response = await fetch(`${API_POKEMON_ENDPOINT}/${query}`);

        if (!response.ok) {
            if (response.status === 404) {
                showNoResults();
                hideLoading();
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pokemon = await response.json();
        console.log('Found pokemon:', pokemon);

        allPokemonMap.clear();
        allPokemonMap.set(pokemon.id, pokemon);
        appendPokemon([pokemon]);

        loadMoreBtn.style.display = 'none';
        hideLoading();
        isSearching = true;
        searchQuery = query;

    } catch (err) {
        console.error('Error searching pokemon:', err);
        showNoResults();
        hideLoading();
    }
}

// Handle type filter
async function handleTypeFilter() {
    const type = typeFilter.value;

    if (!type) {
        resetSearch();
        return;
    }

    try {
        showLoading();
        hideError();
        pokemonGrid.innerHTML = '';
        allPokemonMap.clear();

        console.log('Filtering by type:', type);
        const response = await fetch(`${API_BASE_URL}/type/${type}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Type data:', data);

        // Get first 60 pokemon of this type
        const pokemonUrls = data.pokemon.slice(0, 60).map(p => p.pokemon);
        await fetchPokemonDetails(pokemonUrls);

        loadMoreBtn.style.display = 'none';
        hideLoading();
        currentType = type;

    } catch (err) {
        console.error('Error filtering by type:', err);
        showError();
    }
}

// Reset search and filters
function resetSearch() {
    isSearching = false;
    searchQuery = '';
    currentType = '';
    currentOffset = 0;
    allPokemonMap.clear();
    pokemonGrid.innerHTML = '';
    loadPokemon(0);
}

// Append pokemon to grid
function appendPokemon(pokemonList) {
    const cardsHTML = pokemonList.map(pokemon => createPokemonCard(pokemon)).join('');
    pokemonGrid.insertAdjacentHTML('beforeend', cardsHTML);
}

// Create pokemon card HTML
function createPokemonCard(pokemon) {
    const id = pokemon.id || 0;
    const name = pokemon.name || 'Unknown';
    const types = pokemon.types || [];
    const image = pokemon.sprites?.other?.['official-artwork']?.front_default ||
                  pokemon.sprites?.front_default ||
                  'https://via.placeholder.com/200x200?text=No+Image';

    // Get stats
    const stats = pokemon.stats || [];
    const hp = stats.find(s => s.stat.name === 'hp')?.base_stat || 0;
    const attack = stats.find(s => s.stat.name === 'attack')?.base_stat || 0;
    const defense = stats.find(s => s.stat.name === 'defense')?.base_stat || 0;

    // Get physical attributes
    const height = pokemon.height ? (pokemon.height / 10).toFixed(1) : '?'; // decimeters to meters
    const weight = pokemon.weight ? (pokemon.weight / 10).toFixed(1) : '?'; // hectograms to kg

    const typesBadges = types.map(t =>
        `<span class="type-badge type-${t.type.name}">${t.type.name}</span>`
    ).join('');

    return `
        <div class="pokemon-card" onclick="showPokemonDetails(${id})">
            <span class="pokemon-id">#${String(id).padStart(3, '0')}</span>
            <div class="card-image-container">
                <img src="${image}" alt="${name}" class="card-image" loading="lazy">
            </div>
            <div class="card-content">
                <h2 class="card-name">${name}</h2>
                <div class="card-types">
                    ${typesBadges}
                </div>
                <div class="card-stats">
                    <div class="stat-row">
                        <span class="stat-name">HP</span>
                        <div class="stat-bar-container">
                            <div class="stat-bar" style="width: ${(hp / 255) * 100}%"></div>
                        </div>
                        <span class="stat-value">${hp}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-name">ATK</span>
                        <div class="stat-bar-container">
                            <div class="stat-bar" style="width: ${(attack / 190) * 100}%"></div>
                        </div>
                        <span class="stat-value">${attack}</span>
                    </div>
                    <div class="stat-row">
                        <span class="stat-name">DEF</span>
                        <div class="stat-bar-container">
                            <div class="stat-bar" style="width: ${(defense / 230) * 100}%"></div>
                        </div>
                        <span class="stat-value">${defense}</span>
                    </div>
                </div>
                <div class="card-info">
                    <div class="info-item">
                        <span class="info-label">Height</span>
                        ${height} m
                    </div>
                    <div class="info-item">
                        <span class="info-label">Weight</span>
                        ${weight} kg
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Show pokemon details
function showPokemonDetails(pokemonId) {
    const pokemon = allPokemonMap.get(pokemonId);

    if (!pokemon) {
        console.error('Pokemon not found:', pokemonId);
        return;
    }

    console.log('Pokemon details:', pokemon);

    const types = pokemon.types.map(t => t.type.name).join(', ');
    const abilities = pokemon.abilities.map(a => a.ability.name).join(', ');
    const stats = pokemon.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join('\n');

    alert(`${pokemon.name.toUpperCase()} (#${pokemon.id})\n\nTypes: ${types}\nAbilities: ${abilities}\nHeight: ${(pokemon.height / 10).toFixed(1)}m\nWeight: ${(pokemon.weight / 10).toFixed(1)}kg\n\nBase Stats:\n${stats}\n\nClick OK to continue exploring.`);
}

// Show "No results" message
function showNoResults() {
    pokemonGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: white; border-radius: 12px;">
            <h2 style="color: #6b7280; margin-bottom: 1rem;">No Pokémon found!</h2>
            <p style="color: #9ca3af;">Try searching for another name or number</p>
        </div>
    `;
    loadMoreBtn.style.display = 'none';
}

// UI Helper Functions
function showLoading() {
    if (currentOffset === 0 || isSearching) {
        loading.style.display = 'block';
        pokemonGrid.style.display = 'none';
    }
    error.style.display = 'none';
}

function hideLoading() {
    loading.style.display = 'none';
    pokemonGrid.style.display = 'grid';
}

function showError() {
    error.style.display = 'block';
    loading.style.display = 'none';
    pokemonGrid.style.display = 'none';
}

function hideError() {
    error.style.display = 'none';
}
