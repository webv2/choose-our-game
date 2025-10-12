document.addEventListener('DOMContentLoaded', () => {
    const API_KEY = '194e7b3728b04675acb4abd1ffb834f0';
    const BASE_URL = 'https://api.rawg.io/api';

    // --- YOUR STEAM LIBRARY ---
    // This Set contains a cleaned list of your Steam games for fast lookups.
    const mySteamLibrary = new Set([
        "anno 1800", "r.e.p.o.", "space colony", "buckshot roulette", "the forever winter", "zup! s",
        "zed zone", "command & conquer generals zero hour", "command & conquer red alert 3",
        "command & conquer: red alert 3 - uprising", "command and conquer: kane's wrath",
        "command & conquer and the covert operations", "command & conquer 4 tiberian twilight",
        "command & conquer 3 tiberium wars", "command & conquer red alert, counterstrike and the aftermath",
        "command & conquer red alert 2 and yuri’s revenge", "command & conquer generals",
        "command & conquer tiberian sun and firestorm", "command & conquer renegade", "x4: hyperion pack",
        "path of exile 2", "x-com 3: apocalypse", "tannenberg", "batman arkham origins", "prey", "mad max",
        "assassin's creed", "battlefield 1", "outpost", "manor lords", "hogwarts legacy",
        "unknown 9: awakening", "warhammer 40,000: space marine 2", "tom clancy’s the division 2",
        "the crew 2", "sins of a solar empire ii", "silica", "x4: timelines", "homeworld 3",
        "populous: the beginning", "mount & blade ii: bannerlord", "lost ember", "mafia trilogy", "besiege",
        "spellforce 3: fallen god", "spellforce 3: soul harvest", "celestial command", "worms armageddon",
        "stormworks: build and rescue", "carrier command 2", "crysis remastered", "brigador: up-armored edition",
        "sky force reloaded", "call of duty: infinite warfare", "marvel's avengers", "microsoft flight simulator",
        "terraria", "tzar: the burden of the crown", "titanfall 2", "technicity", "crossfire: legion",
        "krush kill 'n destroy xtreme", "rolling line", "sid meier's civilization vi", "δv: rings of saturn",
        "lost planet: extreme condition", "metro exodus", "golf it!", "lost planet 3", "into the radius vr",
        "wolfenstein ii: the new colossus", "swordsman vr", "iron rebellion", "endless space 2",
        "agos - a game of space", "icarus", "automobilista 2", "humankind", "the pioneers: surviving desolation",
        "battlefield 2042", "just cause 4", "city car driving", "dimensions: dreadnought architect",
        "main assembly", "mecha knights: nightmare", "call to arms", "warhammer 40,000: dawn of war iii",
        "grid", "dragon age ii", "mass effect legendary edition", "mass effect: andromeda",
        "dragon age: inquisition", "dragon age: origins", "grid legends", "need for speed unbound",
        "need for speed payback", "need for speed heat", "dirt 5", "need for speed hot pursuit remastered",
        "x4: kingdom end", "silent sector", "frontier pilot simulator", "the ascent", "rebel galaxy",
        "master of orion", "assetto corsa competizione", "infraspace", "wolcen: lords of mayhem",
        "juno: new origins", "command & conquer remastered collection", "stranded deep", "ixion", "contractors vr",
        "7 days to die", "spacerift: arcanum system", "star wars: empire at war", "zero caliber vr",
        "mechwarrior 5: mercenaries", "battlegroupvr", "spellforce 3 reforced", "osiris: new dawn", "evolve",
        "battlestar galactica deadlock", "tom clancy's ghost recon future soldier", "death stranding director's cut",
        "star wars jedi: fallen order", "dragon's dogma: dark arisen", "the forgotten city", "x4: tides of avarice",
        "flight of nova", "naruto to boruto: shinobi striker", "tomb raider: anniversary", "tomb raider: legend",
        "beamng.drive", "darkstone", "astrox imperium", "kingdoms and castles", "ultimate epic battle simulator 2",
        "fallout 76", "red solstice 2: survivors", "motor town: behind the wheel", "starship evo",
        "dead space 3", "encased", "mechwarrior 5: mercenaries", "starcom: nexus", "pulsar: lost colony",
        "highfleet", "boneworks", "executive assault 2", "valheim", "void destroyer 2", "project zomboid",
        "middle-earth: shadow of mordor", "warhammer 40,000: inquisitor - martyr", "parkan 2",
        "warhammer: end times - vermintide", "after the fall", "carx drift racing online", "retrowave",
        "survivalist: invisible strain", "zomday", "rebel galaxy outlaw", "assetto corsa", "phasmophobia",
        "middle-earth: shadow of war", "ground control anthology", "gothic universe edition", "last epoch",
        "hellsplit: arena", "gaia beyond", "cepheus protocol", "blackwake", "magicka 2",
        "car mechanic simulator 2015", "avorion", "x4: cradle of humanity", "atom: rpg", "kingdoms",
        "blade & sorcery", "cyberpunk 2077", "metal gear solid v: the definitive experience", "deep rock galactic",
        "insurgency: sandstorm", "green hell", "death stranding", "cyubevr", "crazy machines 3",
        "pummel party", "hand simulator", "aliens vs. predator", "half-life: alyx", "bulletstorm: full clip edition",
        "horizon zero dawn", "avorion", "gray zone", "the elder scrolls v: skyrim special edition",
        "injustice: gods among us", "dead by daylight", "holoball", "bad guys at school", "rodina", "pavlov",
        "project freedom", "genesis alpha one", "ultimate epic battle simulator", "scrap mechanic", "star valor",
        "voxel turf", "final fantasy xv", "diablo III", "dirt rally 2.0", "x4: split vendetta",
        "my time at portia", "halo: the master chief collection", "doom", "beat hazard 2",
        "age of empires ii: definitive edition", "state of decay 2", "arma 3", "generation zero",
        "hellblade: senua's sacrifice", "age of empires: definitive edition", "hurtworld", "transport fever 2",
        "homeworld: deserts of kharak", "mordhau", "transport fever", "kenshi", "state of decay: year one",
        "gun club vr", "arizona sunshine", "nexus - the jupiter incident", "how to survive 2",
        "endless space", "take on mars", "drift86", "fallout 4", "the guild 3",
        "kingdom come: deliverance", "signal simulator", "spaceengine", "borderlands: the pre-sequel",
        "age of empires ii", "the incredible adventures of van helsing ii", "kerbal space program", "home design 3d",
        "warhammer: vermintide 2", "killing floor 2", "titans of space plus", "battlezone combat commander",
        "battlezone 98 redux", "project cars 2", "heroes of might and magic v", "carmageddon: max damage",
        "just cause 3", "beat saber", "lords of the fallen", "spacebourne", "stellaris",
        "final fantasy xv", "rainbow six siege", "fallout 4 vr", "empyrion - galactic survival",
        "starpoint gemini warlords", "x4: foundations", "rage", "bioshock infinite", "rise of the tomb raider",
        "murderous pursuits", "saints row iv", "nightstar", "cities: skylines", "z", "battlevoid: sector siege",
        "f.e.a.r.", "battlefield: bad company 2", "everspace", "delta force 2", "need for speed: hot pursuit",
        "supreme commander 2", "the sims 3", "american truck simulator", "euro truck simulator 2",
        "titan quest", "insurgency", "the crew", "grand theft auto v", "hitman: contracts",
        "hitman: absolution", "hitman: blood money", "hitman 2: silent assassin", "hitman: codename 47",
        "saints row: the third", "overlord", "overlord ii", "space engineers", "mirror's edge",
        "just cause 3", "assassin's creed: brotherhood", "assassin's creed ii", "stellaris",
        "planetary annihilation: titans", "f1 2015", "aliens vs predator", "beat hazard", "supreme commander 2",
        "deus ex", "the polynomial", "hard truck: apocalypse rise of clans", "hard truck apocalypse: arcade",
        "hard truck apocalypse", "commandos", "project 5: sightseer", "the red solstice", "cpucpres",
        "black mesa", "rust", "deus ex: mankind divided", "kingdom: classic", "x-superbox", "x rebirth",
        "zombie driver hd", "h1z1", "the witcher 3: wild hunt", "sanctum 2", "grid 2", "dirt rally",
        "dungeon siege iii", "outlast", "the elder scrolls iv: oblivion", "no man's sky", "three heroes",
        "ground control ii", "dying light", "wayward terran frontier: zero falls", "payday 2",
        "wallpaper engine", "homefront: the revolution", "dirt showdown", "deep dungeons of doom",
        "tom clancy's the division", "mount & blade: with fire & sword", "metro 2033 redux", "metro: last light redux",
        "grid", "elite dangerous: horizons", "warhammer 40,000: space marine", "spore", "battlevoid: harbinger",
        "the forest", "original war", "deus ex: human revolution", "red faction", "assassin's creed revelations",
        "microsoft flight simulator x", "homeworld remastered collection", "sins of a solar empire: rebellion",
        "the witcher", "the witcher 2: assassins of kings", "guardians of orion", "call of duty: modern warfare 3",
        "serious sam hd: the second encounter", "orion: prelude", "deadpool", "star wolves 3: civil war", "star wolves 2",
        "star wolves", "valve complete pack", "echelon", "ryse: son of rome", "echelon: wind warriors",
        "mount & blade: warband", "test drive unlimited 2", "earth 2150 trilogy", "earth 2140", "earth 2160",
        "elite: dangerous", "garry's mod", "planetary annihilation", "fallout 3", "fallout: new vegas",
        "fallout classic collection", "s.t.a.l.k.e.r.: clear sky", "s.t.a.l.k.e.r.: call of pripyat",
        "s.t.a.l.k.e.r.: shadow of chernobyl", "the guild", "dawn of war", "weird worlds: return to infinite space",
        "pressure", "realms of arkania: star trail", "pixel piracy", "zeno clash", "dino d-day", "spoiler alert",
        "space rangers hd: a war apart", "afterfall insanity", "metro 2033", "tomb raider", "thief",
        "red orchestra 2: heroes of stalingrad", "left 4 dead 2", "dota 2", "dirt 3"
    ]);


    const gamesContainer = document.getElementById('games-container');
    const loader = document.getElementById('loader');
    const genreFilter = document.getElementById('genre-filter');
    const tagsFilter = document.getElementById('tags-filter');
    const libraryFilter = document.getElementById('library-filter'); // New library filter
    const searchBar = document.getElementById('search-bar');
    const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
    const filtersPanel = document.getElementById('filters-panel');
    const shareBtn = document.getElementById('share-btn');
    const importBtn = document.getElementById('import-btn');
    const importInput = document.getElementById('import-input');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    const prevPageBtn = document.getElementById('prev-page-btn');
    const nextPageBtn = document.getElementById('next-page-btn');
    const pageIndicator = document.getElementById('page-indicator');

    const modal = document.getElementById('details-modal');
    const modalBody = document.getElementById('modal-body');
    const closeModalBtn = document.querySelector('.close-button');

    let votedGames = new Set();
    let importedVotes = {};
    let currentPage = 1;

    const fetchGames = async (page = 1, genre = '', tags = '', search = '') => {
        showLoader();
        let url = `${BASE_URL}/games?key=${API_KEY}&page=${page}&page_size=30`;
        if (genre) url += `&genres=${genre}`;
        if (tags) url += `&tags=${tags}`;
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
        } catch (error) { console.error('Error fetching genres:', error); }
    };

    const fetchGameDetails = async (gameId) => {
        showLoader();
        try {
            const detailsPromise = fetch(`${BASE_URL}/games/${gameId}?key=${API_KEY}`).then(res => res.json());
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
    
    const displayGames = (games) => {
        gamesContainer.innerHTML = '';
        if (games.length === 0) {
            gamesContainer.innerHTML = '<p>No games found matching your criteria.</p>';
            return;
        }
        games.forEach(game => {
            const gameTile = document.createElement('div');
            const isOwned = mySteamLibrary.has(game.name.toLowerCase().trim());
            gameTile.className = `game-tile ${isOwned ? 'owned-game' : ''}`;
            gameTile.dataset.gameId = game.id;

            const isVoted = votedGames.has(game.id.toString());
            const voteCount = importedVotes[game.id] || 0;

            gameTile.innerHTML = `
                <img src="${game.background_image || ''}" alt="${game.name}" loading="lazy">
                <div class="game-info">
                    <h3>
                        ${isOwned ? '<span class="owned-indicator" title="In your library">✔</span>' : ''}
                        <span>${game.name}</span>
                    </h3>
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
            
            if (votedGames.has(gameId)) {
                voteBtn.classList.add('voted');
                voteBtn.textContent = 'Voted!';
            } else {
                voteBtn.classList.remove('voted');
                voteBtn.textContent = 'Vote';
            }

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
            } else { if (voteCountDiv) voteCountDiv.remove(); }
        });
    };
    
    gamesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('vote-btn')) {
            const gameId = e.target.dataset.gameId;
            if (votedGames.has(gameId)) {
                votedGames.delete(gameId);
            } else { votedGames.add(gameId); }
            updateUIWithVotes();
        }
    });
    
    function applyFilters() {
        currentPage = 1;
        fetchGames(currentPage, genreFilter.value, tagsFilter.value, searchBar.value.trim());
    }

    genreFilter.addEventListener('change', applyFilters);
    tagsFilter.addEventListener('change', applyFilters);
    
    libraryFilter.addEventListener('change', () => {
        gamesContainer.classList.toggle('filter-library', libraryFilter.checked);
    });

    let searchTimeout;
    searchBar.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(applyFilters, 500);
    });

    toggleFiltersBtn.addEventListener('click', () => {
        filtersPanel.classList.toggle('hidden');
        toggleFiltersBtn.textContent = filtersPanel.classList.contains('hidden') ? 'Show Filters' : 'Hide Filters';
    });
    
    const updatePagination = (nextUrl, prevUrl, page) => {
        nextPageBtn.disabled = !nextUrl;
        prevPageBtn.disabled = !prevUrl;
        pageIndicator.textContent = `Page ${page}`;
    };

    nextPageBtn.addEventListener('click', () => {
        if (!nextPageBtn.disabled) {
            currentPage++;
            fetchGames(currentPage, genreFilter.value, tagsFilter.value, searchBar.value);
        }
    });

    prevPageBtn.addEventListener('click', () => {
        if (!prevPageBtn.disabled) {
            currentPage--;
            fetchGames(currentPage, genreFilter.value, tagsFilter.value, searchBar.value);
        }
    });

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
        importedVotes = {};
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
                        updateUIWithVotes();
                    }
                } catch (err) {
                    console.error('Error reading file:', err);
                    alert(`Could not read file: ${file.name}`);
                }
            };
            reader.readAsText(file);
        });
        importInput.value = '';
    });
    
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
    });

    const openModal = (gameId) => fetchGameDetails(gameId);
    closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target == modal) modal.style.display = 'none';
    });

    const showLoader = () => {
        loader.style.display = 'block';
        gamesContainer.style.display = 'none';
    };

    const hideLoader = () => {
        loader.style.display = 'none';
        gamesContainer.style.display = 'grid';
    };

    fetchGenres();
    fetchGames(currentPage);
});