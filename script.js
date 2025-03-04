const API_KEY = "c1276e4de5e33d7fa60e4776b4d2a132";
const API_URL = "https://api.themoviedb.org/3";

const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const movieList = document.getElementById("movie-container");
const genreDropdown = document.getElementById("genre-dropdown");

// Fetch Genres and Populate Dropdown
async function loadGenres() {
    const url = `${API_URL}/genre/movie/list?api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    data.genres.forEach(genre => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreDropdown.appendChild(option);
    });
}

// Fetch Movies by Name
async function getMovies(movieName) {
    const url = `${API_URL}/search/movie?api_key=${API_KEY}&query=${movieName}`;
    const response = await fetch(url);
    const data = await response.json();
    showMovies(data.results);
}

// Fetch Movies by Genre
async function getMoviesByGenre(genreId) {
    const url = `${API_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`;
    const response = await fetch(url);
    const data = await response.json();
    showMovies(data.results);
}

// Fetch Movie Trailer
async function getTrailer(movieId) {
    const url = `${API_URL}/movie/${movieId}/videos?api_key=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.results.length > 0) {
        return `https://www.youtube.com/watch?v=${data.results[0].key}`;
    }
    return null;
}

// Display Movies on Page
async function showMovies(movies) {
    movieList.innerHTML = ""; // Clear previous results
    movies.forEach(async (movie) => {
        const movieBox = document.createElement("div");
        movieBox.classList.add("movie-card");

        const trailerLink = await getTrailer(movie.id);
        const trailerButton = trailerLink
            ? `<a href="${trailerLink}" target="_blank" class="trailer-btn">🎬 Watch Trailer</a>`
            : `<p class="no-trailer">No Trailer Available</p>`;

        movieBox.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average}</p>
            ${trailerButton}
        `;
        movieList.appendChild(movieBox);
    });
}

// Event Listeners
searchBtn.addEventListener("click", () => {
    const movieName = searchInput.value;
    if (movieName) {
        getMovies(movieName);
    }
});

genreDropdown.addEventListener("change", (event) => {
    const genreId = event.target.value;
    if (genreId) {
        getMoviesByGenre(genreId);
    }
});

// Load genres when page loads
loadGenres();
