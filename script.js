const API_KEY = "c1276e4de5e33d7fa60e4776b4d2a132";
const BASE_URL = "https://api.themoviedb.org/3";

document.getElementById("search-button").addEventListener("click", () => {
    const query = document.getElementById("search-input").value;
    if (query) {
        fetchMovies(query);
    }
});

async function fetchMovies(query) {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`;
    const response = await fetch(url);
    const data = await response.json();
    displayMovies(data.results);
}

function displayMovies(movies) {
    const movieContainer = document.getElementById("movie-container");
    movieContainer.innerHTML = ""; // Clear previous results
    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>⭐ ${movie.vote_average}</p>
        `;
        movieContainer.appendChild(movieCard);
    });
}
