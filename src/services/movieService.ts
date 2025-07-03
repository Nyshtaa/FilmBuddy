import { API_KEY, BASE_URL } from "../../config/apiConfig";

export const fetchMovies = async (endpoint: string, page: number = 1) => {
  const response = await fetch(
    `${BASE_URL}/movie/${endpoint}?api_key=${API_KEY}&language=uk-UA&page=${page}`
  );
  const data = await response.json();
  return data.results || [];
};


// Отримати фільми за жанром з підтримкою пагінації
export const fetchMoviesByGenre = async (genreId: number, page: number = 1) => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?with_genres=${genreId}&api_key=${API_KEY}&language=uk-UA&page=${page}`
  );
  const data = await response.json();
  return data; // повертає: { page, results, total_pages }
};

// Отримати список усіх жанрів
export const fetchGenres = async () => {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=uk-UA`
  );
  const data = await response.json();
  return data.genres; // масив жанрів: [{ id: 28, name: "Бойовики" }, ...]
};

//Отримати детальну інформацію про фільм
export const fetchMovieDetails = async (id: number) => {
  const response = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=uk-UA`
  );
  const data = await response.json();
  return data;
};

//Отримати імена акторів
export const fetchMovieCredits = async (movieId: number) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}&language=uk-UA`
  );
  const data = await response.json();
  return data;
};

export const searchMovies = async (query: string) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&language=uk-UA`
    );
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Помилка пошуку фільмів:", error);
    return [];
  }
};

