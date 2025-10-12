document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '194e7b3728b04675acb4abd1ffb834f0';
    const BASE_URL = 'https://api.rawg.io/api';

    const gamesContainer = document.getElementById('games-container');
    const loader = document.getElementById('loader');
    const genreFilter = document.getElementById('genre-filter');
    const searchBar = document.getElementById('search-bar');
    const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
    const filtersPanel = document.getElementById('filters-panel');
    const shareBtn = document.getElementById('share-btn');
    const importBtn = document.getElementById('import-btn');
    const importInput = document.getElementById('import-input');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    // Pagination
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const pageIndicator = document.getElementById('page-indicator');

    // Modal
    const modal = document.getElementById('details-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-button');

    let votedGames = new Set();
    let importedVotes = {};
    let currentPage = 1;

    // --- Core Functions ---

    const fetchGames = async (page = 1, genre = '', search = '') => {
        showLoader();
        let url = `${BASE_URL}/games?key=${API_KEY}&page=${page}`;
        if (genre) url += `&genres=${genre}`;
        if (search) url += `&search=${search}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            displayGames(data.results);
            updatePagination(data.next, data.previous, page);
        } catch (error) {
            console.error('Error fetching games:', error);
            gamesContainer.innerHTML = '<p>Failed to load games. Please try again later.</p>';
        } finally {
            hideLoader();
        }
    };

    const fetchGenres = async () => {
        try {
            const response = await fetch(`${BASE_URL}/genres?key=${API_KEY}`);
            const data = await response.json();
            data.results.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.slug;
                option.textContent = genre.name;
                genreFilter.appendChild(option);
            });
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    const fetchGameDetails = async (gameId) => {
        showLoader();
        try {
            // Fetch main details
            const detailsPromise = fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`).then(res => res.json());
            // Fetch screenshots
            const screenshotsPromise = fetch(`${BASE_URL}/games/${gameId}/screenshots?key=${API_KEY}`).then(res => res.json());
            
            const [details, screenshots] = await Promise.all([detailsPromise, screenshotsPromise]);

            displayGameDetails(details, screenshots.results);

        } catch (error) {
            console.error('Error fetching game details:', error);
            modalBody.innerHTML = '<p>Could not load details.</p>';
        } finally {
            hideLoader();
        }
    };

    // --- Display Functions ---

    const displayGames = (games) => {
        gamesContainer.innerHTML = '';
        if (games.length === 0) {
            gamesContainer.innerHTML = '<p>No games found matching your criteria.</p>';
            return;
        }
        games.forEach(game => {
            const gameTile = document.createElement('div');
            gameTile.className = 'game-tile';
            gameTile.dataset.gameId = game.id;

            const isVoted = votedGames.has(game.id.toString());
            const voteCount = importedVotes[game.id] || 0;

            gameTile.innerHTML = `
                <img src="${game.background_image || ''}" alt="${game.name}" loading="lazy">
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <button class="vote-btn ${isVoted ? 'voted' : ''}" data-game-id="${game.id}">${isVoted ? 'Voted!' : 'Vote'}</button>
                </div>
                ${voteCount > 0 ? `<div class="vote-count" title="${voteCount} imported vote(s)">${voteCount}</div>` : ''}
            `;
            
            gameTile.querySelector('img').addEventListener('click', () => openModal(game.id));
            gamesContainer.appendChild(gameTile);
        });
    };

    const displayGameDetails = (details, screenshots) => {
        modalBody.innerHTML = `
            <h2>${details.name}</h2>
            <p>${details.description_raw.substring(0, 400)}...</p>
            <strong>Genres:</strong> ${details.genres.map(g => g.name).join(', ')}<br>
            <strong>Release Date:</strong> ${details.released}
            <h3>Screenshots</h3>
            <div id="modal-screenshots">
                ${screenshots.slice(0, 6).map(ss => `<img src="${ss.image}" alt="Screenshot">`).join('')}
            </div>
        `;
        modal.style.display = 'block';
    };
    
    const updateUIWithVotes = () => {
        document.querySelectorAll('.game-tile').forEach(tile => {
            const gameId = tile.dataset.gameId;
            const voteBtn = tile.querySelector('.vote-btn');
            const voteCountDiv = tile.querySelector('.vote-count');
            
            // Update personal vote
            if (votedGames.has(gameId)) {
                voteBtn.classList.add('voted');
                voteBtn.textContent = 'Voted!';
            } else {
                voteBtn.classList.remove('voted');
                voteBtn.textContent = 'Vote';
            }

            // Update imported votes count
            const count = importedVotes[gameId] || 0;
            if (count > 0) {
                if (voteCountDiv) {
                    voteCountDiv.textContent = count;
                } else {
                    const newVoteCount = document.createElement('div');
                    newVoteCount.className = 'vote-count';
                    newVoteCount.title = `${count} imported vote(s)`;
                    newVoteCount.textContent = count;
                    tile.appendChild(newVoteCount);
                }
            } else {
                if (voteCountDiv) voteCountDiv.remove();
            }
        });
    };
    
    // --- Event Handlers ---

    gamesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('vote-btn')) {
            const gameId = e.target.dataset.gameId;
            if (votedGames.has(gameId)) {
                votedGames.delete(gameId);
            } else {
                votedGames.add(gameId);
            }
            updateUIWithVotes();
        }
    });

    genreFilter.addEventListener('change', () => {
        currentPage = 1;
        fetchGames(currentPage, genreFilter.value, searchBar.value);
    });

    let searchTimeout;
    searchBar.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentPage = 1;
            fetchGames(currentPage, genreFilter.value, searchBar.value.trim());
        }, 500); // Debounce search
    });

    toggleFiltersBtn.addEventListener('click', () => {
        filtersPanel.classList.toggle('hidden');
        toggleFiltersBtn.textContent = filtersPanel.classList.contains('hidden') ? 'Show Filters' : 'Hide Filters';
    });
    
    // --- Pagination Logic ---
    
    const updatePagination = (nextUrl, prevUrl, page) => {
        nextPageBtn.disabled = !nextUrl;
        prevPageBtn.disabled = !prevUrl;
        pageIndicator.textContent = `Page ${page}`;
    };

    nextPageBtn.addEventListener('click', () => {
        if (!nextPageBtn.disabled) {
            currentPage++;
            fetchGames(currentPage, genreFilter.value, searchBar.value);
        }
    });

    prevPageBtn.addEventListener('click', () => {
        if (!prevPageBtn.disabled) {
            currentPage--;
            fetchGames(currentPage, genreFilter.value, searchBar.value);
        }
    });

    // --- Import / Export ---

    shareBtn.addEventListener('click', () => {
        if (votedGames.size === 0) {
            alert('You haven\'t voted for any games yet!');
            return;
        }
        const data = JSON.stringify(Array.from(votedGames));
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'my_game_votes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    importBtn.addEventListener('click', () => importInput.click());

    importInput.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length === 0) return;

        importedVotes = {}; // Reset counts before import
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const importedIds = JSON.parse(event.target.result);
                    if (Array.isArray(importedIds)) {
                        importedIds.forEach(id => {
                            const gameId = id.toString();
                            importedVotes[gameId] = (importedVotes[gameId] || 0) + 1;
                        });
                        updateUIWithVotes(); // Update after each file is processed
                    }
                } catch (err) {
                    console.error('Error reading file:', err);
                    alert(`Could not read file: ${file.name}`);
                }
            };
            reader.readAsText(file);
        });
        
        // Clear the input so the same file can be loaded again
        importInput.value = ''; 
    });

    // --- Theme Toggle ---
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
    });

    // --- Modal Logic ---

    const openModal = (gameId) => fetchGameDetails(gameId);
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });

    // --- Utility Functions ---

    const showLoader = () => {
        loader.style.display = 'block';
        gamesContainer.style.display = 'none';
    };

    const hideLoader = () => {
        loader.style.display = 'none';
        gamesContainer.style.display = 'grid';
    };

    // --- Initial Load ---
    
    fetchGenres();
    fetchGames(currentPage);
});