const API_KEY = "c1276e4de5e33d7fa60e4776b4d2a132";
const API_URL = "https://api.themoviedb.org/3";

const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const movieList = document.getElementById("movie-container");
const trendingMoviesList = document.getElementById("trending-movies");
const genreDropdown = document.getElementById("genre-dropdown");
const trendingSection = document.getElementById("trending-section");

// Fetch Genres and Populate Dropdown
async function loadGenres() {
    try {
        const response = await fetch(`${API_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();

        genreDropdown.innerHTML = `<option value="">🎭 Select Genre</option>`;

        data.genres.forEach(genre => {
            const option = document.createElement("option");
            option.value = genre.id;
            option.textContent = genre.name;
            genreDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error loading genres:", error);
    }
}

// Fetch Trending Movies
async function getTrendingMovies() {
    try {
        const response = await fetch(`${API_URL}/trending/movie/day?api_key=${API_KEY}&language=en-US`);
        const data = await response.json();
        showMovies(data.results, trendingMoviesList);
    } catch (error) {
        console.error("Error fetching trending movies:", error);
    }
}

// Fetch Movies by Name (Search)
async function getMovies(movieName) {
    if (!movieName) return;

    // Ensure trendingSection exists before using it
    if (trendingSection) {
        trendingSection.style.display = "none"; // Hide trending when searching
    }

    try {
        const response = await fetch(`${API_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}&include_adult=false&language=en-US&page=1`);
        const data = await response.json();

        movieList.innerHTML = ""; // Clear previous results

        if (!data.results || data.results.length === 0) {
            movieList.innerHTML = "<p>No movies found. Try a different search.</p>";

            // Show trending again if no results (only if trendingSection exists)
            if (trendingSection) {
                trendingSection.style.display = "block";
            }
        } else {
            showMovies(data.results, movieList);
        }
    } catch (error) {
        console.error("Error fetching movies:", error);
        movieList.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    }
}

// Fetch Movies by Genre
async function getMoviesByGenre() {
    const genreId = genreDropdown.value;
    if (!genreId) {
        console.warn("No genre selected!");
        return;
    }

    // Hide trending section when selecting a genre
    if (trendingSection) {
        trendingSection.style.display = "none";
    }

    try {
        const response = await fetch(`${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=en-US&page=1`);
        const data = await response.json();

        movieList.innerHTML = ""; // Clear previous results

        if (!data.results || data.results.length === 0) {
            movieList.innerHTML = "<p>No movies found for this genre.</p>";

            // Show trending section again if no results
            if (trendingSection) {
                trendingSection.style.display = "block";
            }
        } else {
            showMovies(data.results, movieList);
        }
    } catch (error) {
        console.error("Error fetching movies by genre:", error);
        movieList.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    }
}


// Display Movies on Page
function showMovies(movies, container) {
    container.innerHTML = ""; // Clear previous results

    if (!movies || movies.length === 0) {
        container.innerHTML = "<p>No movies found. Try another search!</p>";
        return;
    }

    movies.forEach((movie) => {
        const movieBox = document.createElement("div");
        movieBox.classList.add("movie-card");

        const posterPath = movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Image";

        movieBox.innerHTML = `
            <img src="${posterPath}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        `;

        container.appendChild(movieBox);
    });
}

// Search with Enter Key
searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        const movieName = searchInput.value.trim();
        getMovies(movieName);
    }
});

// Load on Page Load
document.addEventListener("DOMContentLoaded", () => {
    loadGenres();
    getTrendingMovies();
});

// Event Listeners
searchBtn.addEventListener("click", () => {
    const movieName = searchInput.value.trim();
    if (movieName) {
        getMovies(movieName);
    }
});

genreDropdown.addEventListener("change", getMoviesByGenre);
