document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const RAWG_API_KEY = '194e7b3728b04675acb4abd1ffb834f0';
    const RAWG_BASE_URL = 'https://api.rawg.io/api';

    // --- PASTE YOUR SUPABASE CREDENTIALS HERE ---
    const SUPABASE_URL = 'https://lgtajqxzcgutovcqwepe.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxndGFqcXh6Y2d1dG92Y3F3ZXBlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDg3NjIsImV4cCI6MjA3NTc4NDc2Mn0.QKnnpZ4fHrgpSeCeyJ2qVOJUqafd3jxRF4j5uMenMbg';

    // --- INITIALIZE CLIENTS ---
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- ELEMENT SELECTORS ---
    const gamesContainer = document.getElementById('games-container');
    const loader = document.getElementById('loader');
    const genreFilter = document.getElementById('genre-filter');
    const tagsFilter = document.getElementById('tags-filter');
    const dynamicFilter = document.getElementById('dynamic-filter');
    const orderingFilter = document.getElementById('ordering-filter');
    const libraryToggleBtn = document.getElementById('library-toggle-btn');
    const searchBar = document.getElementById('search-bar');
    const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
    const filtersPanel = document.getElementById('filters-panel');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const backToTopBtn = document.getElementById('back-to-top-btn');

    // Game Details Modal
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // Report Modal
    const showReportBtn = document.getElementById('show-report-btn');
    const reportModalOverlay = document.getElementById('report-modal-overlay');
    const closeReportModalBtn = document.getElementById('close-report-modal-btn');

    // Date Filters
    const dateFilterBtn = document.getElementById('date-filter-btn');
    const dateFilterPanel = document.getElementById('date-filter-panel');
    const dateRangesList = document.getElementById('date-ranges-list');
    const dateYearsList = document.getElementById('date-years-list');
    const dateSelectAllBtn = document.getElementById('date-select-all-btn');

    // Remove old import/export buttons if they are still in your HTML
    document.getElementById('import-btn')?.remove();
    document.getElementById('share-btn')?.remove();
    document.getElementById('import-input')?.remove();

    // --- STATE VARIABLES ---
    let voteCounts = new Map();
    let localVotes = new Set(JSON.parse(localStorage.getItem('myLocalVotes')) || []);
    let currentPage = 1,
        isLoading = false,
        hasNextPage = true,
        selectedYears = new Set(),
        originalTile = null;

    // --- YOUR STEAM LIBRARY ---
    const mySteamLibrary = new Set([ "anno 1800", "r.e.p.o.", "space colony", "buckshot roulette", "the forever winter", "zup! s", "zed zone", "command & conquer generals zero hour", "command & conquer red alert 3", "command & conquer: red alert 3 - uprising", "command and conquer: kane's wrath", "command & conquer and the covert operations", "command & conquer 4 tiberian twilight", "command & conquer 3 tiberium wars", "command & conquer red alert, counterstrike and the aftermath", "command & conquer red alert 2 and yuri’s revenge", "command & conquer generals", "command & conquer tiberian sun and firestorm", "command & conquer renegade", "x4: hyperion pack", "path of exile 2", "x-com 3: apocalypse", "tannenberg", "batman arkham origins", "prey", "mad max", "assassin's creed", "battlefield 1", "outpost", "manor lords", "hogwarts legacy", "unknown 9: awakening", "warhammer 40,000: space marine 2", "tom clancy’s the division 2", "the crew 2", "sins of a solar empire ii", "silica", "x4: timelines", "homeworld 3", "populous: the beginning", "mount & blade ii: bannerlord", "lost ember", "mafia trilogy", "besiege", "spellforce 3: fallen god", "spellforce 3: soul harvest", "celestial command", "worms armageddon", "stormworks: build and rescue", "carrier command 2", "crysis remastered", "brigador: up-armored edition", "sky force reloaded", "call of duty: infinite warfare", "marvel's avengers", "microsoft flight simulator", "terraria", "tzar: the burden of the crown", "titanfall 2", "technicity", "crossfire: legion", "krush kill 'n destroy xtreme", "rolling line", "sid meier's civilization vi", "δv: rings of saturn", "lost planet: extreme condition", "metro exodus", "golf it!", "lost planet 3", "into the radius vr", "wolfenstein ii: the new colossus", "swordsman vr", "iron rebellion", "endless space 2", "agos - a game of space", "icarus", "automobilista 2", "humankind", "the pioneers: surviving desolation", "battlefield 2042", "just cause 4", "city car driving", "dimensions: dreadnought architect", "main assembly", "mecha knights: nightmare", "call to arms", "warhammer 40,000: dawn of war iii", "grid", "dragon age ii", "mass effect legendary edition", "mass effect: andromeda", "dragon age: inquisition", "dragon age: origins", "grid legends", "need for speed unbound", "need for speed payback", "need for speed heat", "dirt 5", "need for speed hot pursuit remastered", "x4: kingdom end", "silent sector", "frontier pilot simulator", "the ascent", "rebel galaxy", "master of orion", "assetto corsa competizione", "infraspace", "wolcen: lords of mayhem", "juno: new origins", "command & conquer remastered collection", "stranded deep", "ixion", "contractors vr", "7 days to die", "spacerift: arcanum system", "star wars: empire at war", "zero caliber vr", "mechwarrior 5: mercenaries", "battlegroupvr", "spellforce 3 reforged", "osiris: new dawn", "evolve", "battlestar galactica deadlock", "tom clancy's ghost recon future soldier", "death stranding director's cut", "star wars jedi: fallen order", "dragon's dogma: dark arisen", "the forgotten city", "x4: tides of avarice", "flight of nova", "naruto to boruto: shinobi striker", "tomb raider: anniversary", "tomb raider: legend", "beamng.drive", "darkstone", "astrox imperium", "kingdoms and castles", "ultimate epic battle simulator 2", "fallout 76", "red solstice 2: survivors", "motor town: behind the wheel", "starship evo", "dead space 3", "encased", "mechwarrior 5: mercenaries", "starcom: nexus", "pulsar: lost colony", "highfleet", "boneworks", "executive assault 2", "valheim", "void destroyer 2", "project zomboid", "middle-earth: shadow of mordor", "warhammer 40,000: inquisitor - martyr", "parkan 2", "warhammer: end times - vermintide", "after the fall", "carx drift racing online", "retrowave", "survivalist: invisible strain", "zomday", "rebel galaxy outlaw", "assetto corsa", "phasmophobia", "middle-earth: shadow of war", "ground control anthology", "gothic universe edition", "last epoch", "hellsplit: arena", "gaia beyond", "cepheus protocol", "blackwake", "magicka 2", "car mechanic simulator 2015", "avorion", "x4: cradle of humanity", "atom: rpg", "kingdoms", "blade & sorcery", "cyberpunk 2077", "metal gear solid v: the definitive experience", "deep rock galactic", "insurgency: sandstorm", "green hell", "death stranding", "cyubevr", "crazy machines 3", "pummel party", "hand simulator", "aliens vs. predator", "half-life: alyx", "bulletstorm: full clip edition", "horizon zero dawn", "avorion", "gray zone", "the elder scrolls v: skyrim special edition", "injustice: gods among us", "dead by daylight", "holoball", "bad guys at school", "rodina", "pavlov", "project freedom", "genesis alpha one", "ultimate epic battle simulator", "scrap mechanic", "star valor", "voxel turf", "final fantasy xv", "diablo III", "dirt rally 2.0", "x4: split vendetta", "my time at portia", "halo: the master chief collection", "doom", "beat hazard 2", "age of empires ii: definitive edition", "state of decay 2", "arma 3", "generation zero", "hellblade: senua's sacrifice", "age of empires: definitive edition", "hurtworld", "transport fever 2", "homeworld: deserts of kharak", "mordhau", "transport fever", "kenshi", "state of decay: year one", "gun club vr", "arizona sunshine", "nexus - the jupiter incident", "how to survive 2", "endless space", "take on mars", "drift86", "fallout 4", "the guild 3", "kingdom come: deliverance", "signal simulator", "spaceengine", "borderlands: the pre-sequel", "age of empires ii", "the incredible adventures of van helsing ii", "kerbal space program", "home design 3d", "warhammer: vermintide 2", "killing floor 2", "titans of space plus", "battlezone combat commander", "battlezone 98 redux", "project cars 2", "heroes of might and magic v", "carmageddon: max damage", "just cause 3", "beat saber", "lords of the fallen", "spacebourne", "stellaris", "final fantasy xv", "rainbow six siege", "fallout 4 vr", "empyrion - galactic survival", "starpoint gemini warlords", "x4: foundations", "rage", "bioshock infinite", "rise of the tomb raider", "murderous pursuits", "saints row iv", "nightstar", "cities: skylines", "z", "battlevoid: sector siege", "f.e.a.r.", "battlefield: bad company 2", "everspace", "delta force 2", "need for speed: hot pursuit", "supreme commander 2", "the sims 3", "american truck simulator", "euro truck simulator 2", "titan quest", "insurgency", "the crew", "grand theft auto v", "hitman: contracts", "hitman: absolution", "hitman: blood money", "hitman 2: silent assassin", "hitman: codename 47", "saints row: the third", "overlord", "overlord ii", "space engineers", "mirror's edge", "just cause 3", "assassin's creed: brotherhood", "assassin's creed ii", "stellaris", "planetary annihilation: titans", "f1 2015", "aliens vs predator", "beat hazard", "supreme commander 2", "deus ex", "the polynomial", "hard truck: apocalypse rise of clans", "hard truck apocalypse: arcade", "hard truck apocalypse", "commandos", "project 5: sightseer", "the red solstice", "cpucpres", "black mesa", "rust", "deus ex: mankind divided", "kingdom: classic", "x-superbox", "x rebirth", "zombie driver hd", "h1z1", "the witcher 3: wild hunt", "sanctum 2", "grid 2", "dirt rally", "dungeon siege iii", "outlast", "the elder scrolls iv: oblivion", "no man's sky", "three heroes", "ground control ii", "dying light", "wayward terran frontier: zero falls", "payday 2", "wallpaper engine", "homefront: the revolution", "dirt showdown", "deep dungeons of doom", "tom clancy's the division", "mount & blade: with fire & sword", "metro 2033 redux", "metro: last light redux", "grid", "elite dangerous: horizons", "warhammer 40,000: space marine", "spore", "battlevoid: harbinger", "the forest", "original war", "deus ex: human revolution", "red faction", "assassin's creed revelations", "microsoft flight simulator x", "homeworld remastered collection", "sins of a solar empire: rebellion", "the witcher", "the witcher 2: assassins of kings", "guardians of orion", "call of duty: modern warfare 3", "serious sam hd: the second encounter", "orion: prelude", "deadpool", "star wolves 3: civil war", "star wolves 2", "star wolves", "valve complete pack", "echelon", "ryse: son of rome", "echelon: wind warriors", "mount & blade: warband", "test drive unlimited 2", "earth 2150 trilogy", "earth 2140", "earth 2160", "elite: dangerous", "garry's mod", "planetary annihilation", "fallout 3", "fallout: new vegas", "fallout classic collection", "s.t.a.l.k.e.r.: clear sky", "s.t.a.l.k.e.r.: call of pripyat", "s.t.a.l.k.e.r.: shadow of chernobyl", "the guild", "dawn of war", "weird worlds: return to infinite space", "pressure", "realms of arkania: star trail", "pixel piracy", "zeno clash", "dino d-day", "spoiler alert", "space rangers hd: a war apart", "afterfall insanity", "metro 2033", "tomb raider", "thief", "red orchestra 2: heroes of stalingrad", "left 4 dead 2", "dota 2", "dirt 3" ]);

    // --- UTILITY & STATE FUNCTIONS ---
    const showLoader = () => loader.style.display = 'block';
    const hideLoader = () => loader.style.display = 'none';

    const saveState = () => {
        localStorage.setItem('chooseOurGameState', JSON.stringify({
            theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
            filters: {
                search: searchBar.value,
                dynamic: dynamicFilter.value,
                genre: genreFilter.value,
                tags: tagsFilter.value,
                ordering: orderingFilter.value,
                library: libraryToggleBtn.dataset.toggled === 'true',
                filtersVisible: !filtersPanel.classList.contains('hidden'),
                years: Array.from(selectedYears)
            }
        }));
    };

    const loadState = () => {
        const stateString = localStorage.getItem('chooseOurGameState');
        if (!stateString) return;
        const state = JSON.parse(stateString);
        document.body.className = state.theme === 'dark' ? 'dark-theme' : 'light-theme';
        searchBar.value = state.filters.search || '';
        dynamicFilter.value = state.filters.dynamic || '';
        genreFilter.value = state.filters.genre || '';
        tagsFilter.value = state.filters.tags || '';
        orderingFilter.value = state.filters.ordering || '';
        if (state.filters.years) selectedYears = new Set(state.filters.years);
        if (state.filters.library) {
            libraryToggleBtn.dataset.toggled = 'true';
            gamesContainer.classList.add('filter-library');
        }
        if (state.filters.filtersVisible) {
            filtersPanel.classList.remove('hidden');
            toggleFiltersBtn.textContent = 'Hide Filters';
        }
    };

    // --- CORE DATA & DISPLAY FUNCTIONS ---
    const applyFilters = () => {
        currentPage = 1;
        hasNextPage = true;
        fetchGames(currentPage, false);
        saveState();
    };

    const fetchGames = async (page = 1, append = false) => {
        if (isLoading || (!hasNextPage && append)) return;
        isLoading = true;
        showLoader();
        if (!append) gamesContainer.innerHTML = '';
        
        const ordering = orderingFilter.value;
        
        try {
            if (ordering === 'votes') {
                const { data: voteData, error } = await supabaseClient
                    .from('games')
                    .select('game_id, votes')
                    .order('votes', { ascending: false });

                if (error) throw error;
                if (voteData.length === 0) {
                    displayGames([], false);
                    return;
                }

                voteData.forEach(item => voteCounts.set(item.game_id, item.votes));
                
                const gameIds = voteData.map(g => g.game_id).join(',');
                const response = await fetch(`${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&ids=${gameIds}`);
                const rawgData = await response.json();
                
                const sortedResults = rawgData.results.sort((a, b) => (voteCounts.get(b.id) || 0) - (voteCounts.get(a.id) || 0));
                displayGames(sortedResults, append);
                hasNextPage = false;

            } else {
                let url = `${RAWG_BASE_URL}/games?key=${RAWG_API_KEY}&page=${page}&page_size=24&exclude_tags=499`;
                const search = searchBar.value.trim();
                const genre = genreFilter.value;
                const tags = tagsFilter.value;
                const dynamic = dynamicFilter.value;
                const dates = getDatesForFilter(dynamic);

                if (search) url += `&search=${search}&search_exact=true`;
                if (genre) url += `&genres=${genre}`;
                if (tags) url += `&tags=${tags}`;
                if (ordering) url += `&ordering=${ordering}`;

                if (dates) {
                    url += `&dates=${dates}`;
                } else if (selectedYears.size > 0) {
                    const yearRanges = Array.from(selectedYears).map(year => `${year}-01-01,${year}-12-31`).join(',');
                    url += `&dates=${yearRanges}`;
                }

                const response = await fetch(url);
                const data = await response.json();
                displayGames(data.results, append);
                hasNextPage = data.next !== null;
            }
        } catch (error) {
            console.error('Error fetching games:', error);
            gamesContainer.innerHTML = '<p>Failed to load games. Please try again later.</p>';
        } finally {
            hideLoader();
            isLoading = false;
        }
    };

    const displayGames = (games, append) => {
        if (!append) gamesContainer.innerHTML = '';
        if (games.length === 0 && !append) {
            gamesContainer.innerHTML = '<p>No games found matching your criteria.</p>';
            return;
        }
        
        const fragment = document.createDocumentFragment();
        games.forEach(game => {
            const gameTile = document.createElement('div');
            gameTile.className = `game-tile ${mySteamLibrary.has(game.name.toLowerCase().trim()) ? 'owned-game' : ''}`;
            gameTile.dataset.gameId = game.id;
            gameTile.dataset.gameName = game.name;
            
            const voteCount = voteCounts.get(game.id) || 0;
            const voteCountHTML = voteCount > 0 ? `<div class="vote-count" title="${voteCount} vote(s)">${voteCount}</div>` : '';

            gameTile.innerHTML = `
                <img src="${game.background_image || ''}" alt="${game.name}" loading="lazy">
                ${voteCountHTML}
                <div class="game-info">
                    <h3>${game.name}</h3>
                    <button class="vote-btn">Vote</button>
                </div>`;
            
            gameTile.querySelector('.vote-btn').addEventListener('click', handleVoteClick);
            gameTile.addEventListener('click', (e) => {
                if (!e.target.classList.contains('vote-btn')) openModal(gameTile);
            });
            fragment.appendChild(gameTile);
        });
        gamesContainer.appendChild(fragment);
        updateVoteButtons();
    };

    // --- VOTING LOGIC ---
    const handleVoteClick = async (e) => {
        e.stopPropagation();
        const button = e.target;
        const gameTile = button.closest('.game-tile');
        const gameId = gameTile.dataset.gameId;
        const gameName = gameTile.dataset.gameName;

        button.textContent = "Saving...";
        button.disabled = true;

        const { error } = await supabaseClient.rpc('increment_vote', {
            game_id_in: Number(gameId),
            game_name_in: gameName
        });
        
        if (error) {
            console.error('Error saving vote:', error);
            button.textContent = "Error!";
        } else {
            localVotes.add(gameId);
            localStorage.setItem('myLocalVotes', JSON.stringify(Array.from(localVotes)));
            
            const currentVotes = voteCounts.get(Number(gameId)) || 0;
            voteCounts.set(Number(gameId), currentVotes + 1);
            
            let voteCountDiv = gameTile.querySelector('.vote-count');
            if(!voteCountDiv) {
                voteCountDiv = document.createElement('div');
                voteCountDiv.className = 'vote-count';
                const img = gameTile.querySelector('img');
                if (img) img.insertAdjacentElement('afterend', voteCountDiv);
            }
            voteCountDiv.textContent = currentVotes + 1;
            
            updateVoteButtons();
        }
    };

    const updateVoteButtons = () => {
        document.querySelectorAll('.game-tile').forEach(tile => {
            const gameId = tile.dataset.gameId;
            const voteBtn = tile.querySelector('.vote-btn');
            if (localVotes.has(gameId)) {
                voteBtn.classList.add('voted');
                voteBtn.textContent = 'Voted!';
                voteBtn.disabled = true;
            }
        });
    };
    
    // --- MODAL LOGIC ---
    const openModal = (tile) => {
        if (!tile) return;
        originalTile = tile;
        const gameId = tile.dataset.gameId;
        const tileRect = tile.getBoundingClientRect();
        const imgSrc = tile.querySelector('img').src;
        modalContainer.style.left = `${tileRect.left}px`;
        modalContainer.style.top = `${tileRect.top}px`;
        modalContainer.style.width = `${tileRect.width}px`;
        modalContainer.style.height = `${tileRect.height}px`;
        modalContainer.style.opacity = '0';
        modalOverlay.classList.add('active');
        tile.classList.add('hiding');
        fetchGameDetailsAndAnimate(gameId, tileRect, imgSrc);
    };

    const closeModal = () => {
        if (!originalTile) return;
        const tileRect = originalTile.getBoundingClientRect();
        modalContainer.classList.remove('active');
        modalOverlay.classList.remove('active');
        modalContainer.style.transform = '';
        modalContainer.style.width = `${tileRect.width}px`;
        modalContainer.style.height = `${tileRect.height}px`;
        modalContainer.style.left = `${tileRect.left}px`;
        modalContainer.style.top = `${tileRect.top}px`;
        setTimeout(() => {
            if (originalTile) originalTile.classList.remove('hiding');
            originalTile = null;
        }, 350);
    };

    const fetchGameDetailsAndAnimate = async (gameId, tileRect, imgSrc) => {
        modalBody.innerHTML = '';
        try {
            const [details, screenshots] = await Promise.all([
                fetch(`${RAWG_BASE_URL}/games/${gameId}?key=${RAWG_API_KEY}`).then(res => res.json()),
                fetch(`${RAWG_BASE_URL}/games/${gameId}/screenshots?key=${RAWG_API_KEY}`).then(res => res.json())
            ]);
            
            const gameUrl = `https://rawg.io/games/${details.slug}`;
            modalBody.innerHTML = `
                <div class="modal-header">
                    <img src="${imgSrc}" class="modal-cover-art" alt="${details.name} Cover Art">
                    <div class="modal-header-text">
                        <h2>${details.name}</h2>
                        <p>${details.description_raw ? details.description_raw.substring(0, 280) : 'No description available.'}...</p>
                        <strong>Genres:</strong> ${details.genres.map(g => g.name).join(', ')}<br>
                        <strong>Release Date:</strong> ${details.released}<br>
                        <strong><a href="${gameUrl}" target="_blank" rel="noopener noreferrer">View on RAWG.io</a></strong>
                    </div>
                </div>
                <h3>Screenshots</h3>
                <div id="modal-screenshots">${screenshots.results.slice(0, 6).map(ss => `<img src="${ss.image}" alt="Screenshot">`).join('')}</div>
            `;
        } catch (error) {
            modalBody.innerHTML = '<p>Could not load details.</p>';
        } finally {
            requestAnimationFrame(() => {
                modalContainer.style.opacity = '1';
                modalContainer.classList.add('active');
                const targetWidth = Math.min(800, window.innerWidth - 40);
                const targetHeight = Math.min(600, window.innerHeight - 40);
                const targetX = (window.innerWidth - targetWidth) / 2;
                const targetY = (window.innerHeight - targetHeight) / 2;
                modalContainer.style.transform = `translate(${targetX - tileRect.left}px, ${targetY - tileRect.top}px)`;
                modalContainer.style.width = `${targetWidth}px`;
                modalContainer.style.height = `${targetHeight}px`;
            });
        }
    };

    // --- DATE FILTER & INITIAL DATA FUNCTIONS ---
    const getDatesForFilter = (filterValue) => {
        const today = new Date();
        const y = today.getFullYear();
        const m = today.getMonth();
        const formatDate = (date) => date.toISOString().split('T')[0];
        switch (filterValue) {
            case 'this-month': return `${formatDate(new Date(y, m, 1))},${formatDate(new Date(y, m + 1, 0))}`;
            case 'next-month': return `${formatDate(new Date(y, m + 1, 1))},${formatDate(new Date(y, m + 2, 0))}`;
            case 'popular-week':
                const firstDay = new Date(today);
                firstDay.setDate(today.getDate() - today.getDay());
                const lastDay = new Date(firstDay);
                lastDay.setDate(firstDay.getDate() + 6);
                return `${formatDate(firstDay)},${formatDate(lastDay)}`;
            case 'popular-month': return `${formatDate(new Date(y, m, 1))},${formatDate(new Date(y, m + 1, 0))}`;
            case 'popular-2024': return `2024-01-01,2024-12-31`;
            default: return '';
        }
    };

    const populateDateRanges = () => {
        dateRangesList.innerHTML = '';
        const currentYear = new Date().getFullYear();
        for (let year = currentYear; year >= 1980; year -= 10) {
            const startYear = Math.floor(year / 10) * 10;
            const endYear = startYear + 9;
            const li = document.createElement('li');
            li.textContent = `${startYear}-${endYear}`;
            li.dataset.start = startYear;
            li.dataset.end = endYear;
            dateRangesList.appendChild(li);
        }
    };

    const populateYears = (start, end) => {
        dateYearsList.innerHTML = '';
        for (let year = end; year >= start; year--) {
            const li = document.createElement('li');
            li.textContent = year;
            li.dataset.year = year;
            if (selectedYears.has(year.toString())) li.classList.add('selected');
            dateYearsList.appendChild(li);
        }
    };

    const updateDateFilterButtonText = () => {
        if (selectedYears.size === 0) dateFilterBtn.textContent = 'Any Date';
        else if (selectedYears.size === 1) dateFilterBtn.textContent = `${selectedYears.values().next().value}`;
        else dateFilterBtn.textContent = `${selectedYears.size} years selected`;
    };

    const fetchGenres = async () => {
        try {
            const response = await fetch(`${RAWG_BASE_URL}/genres?key=${RAWG_API_KEY}`);
            const data = await response.json();
            data.results.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.slug;
                option.textContent = genre.name;
                genreFilter.appendChild(option);
            });
            loadState();
            updateDateFilterButtonText();
            applyFilters();
        } catch (error) {
            console.error('Error fetching genres:', error);
        }
    };

    // --- EVENT LISTENERS & INITIALIZATION ---
    [genreFilter, tagsFilter, dynamicFilter, orderingFilter].forEach(filter => {
        if (filter) filter.addEventListener('change', () => {
             if (filter === dynamicFilter && filter.value) {
                selectedYears.clear();
                updateDateFilterButtonText();
            }
            applyFilters();
        });
    });

    let searchTimeout;
    searchBar.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 500);
    });
    
    toggleFiltersBtn.addEventListener('click', () => {
        filtersPanel.classList.toggle('hidden');
        toggleFiltersBtn.textContent = filtersPanel.classList.contains('hidden') ? 'Show Filters' : 'Hide Filters';
        saveState();
    });
    
    libraryToggleBtn.addEventListener('click', () => {
        libraryToggleBtn.dataset.toggled = !(libraryToggleBtn.dataset.toggled === 'true');
        gamesContainer.classList.toggle('filter-library');
        saveState();
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) backToTopBtn.classList.add('visible');
        else backToTopBtn.classList.remove('visible');
        
        if (!isLoading && hasNextPage && (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500)) {
            currentPage++;
            fetchGames(currentPage, true);
        }
    });

    backToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        saveState();
    });
    
    // Game Details Modal Listeners
    closeModalBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Report Modal Listeners
    showReportBtn.addEventListener('click', () => {
        reportModalOverlay.classList.add('active');
    });

    const closeReportModal = () => {
        reportModalOverlay.classList.remove('active');
    };

    closeReportModalBtn.addEventListener('click', closeReportModal);
    reportModalOverlay.addEventListener('click', (e) => {
        if (e.target === reportModalOverlay) {
            closeReportModal();
        }
    });

    // Date Filter Listeners
    dateFilterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dateFilterPanel.classList.toggle('hidden');
        if (!dateRangesList.querySelector('.active')) dateRangesList.querySelector('li')?.click();
    });

    dateRangesList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            document.querySelectorAll('#date-ranges-list li').forEach(li => li.classList.remove('active'));
            e.target.classList.add('active');
            populateYears(e.target.dataset.start, e.target.dataset.end);
        }
    });

    dateYearsList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            const year = e.target.dataset.year;
            e.target.classList.toggle('selected');
            if (selectedYears.has(year)) selectedYears.delete(year);
            else selectedYears.add(year);
            dynamicFilter.value = '';
            updateDateFilterButtonText();
            applyFilters();
        }
    });

    dateSelectAllBtn.addEventListener('click', () => {
        const allYears = Array.from(dateYearsList.querySelectorAll('li'));
        const allSelected = allYears.every(li => li.classList.contains('selected'));
        allYears.forEach(li => {
            const year = li.dataset.year;
            if (allSelected) {
                li.classList.remove('selected');
                selectedYears.delete(year);
            } else {
                li.classList.add('selected');
                selectedYears.add(year);
            }
        });
        dynamicFilter.value = '';
        updateDateFilterButtonText();
        applyFilters();
    });

    document.addEventListener('click', (e) => {
        if (!dateFilterPanel.contains(e.target) && e.target !== dateFilterBtn) dateFilterPanel.classList.add('hidden');
    });

    // --- Initial Load ---
    populateDateRanges();
    fetchGenres(); // This handles the first call to loadState and applyFilters
});
