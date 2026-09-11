/**
 * Represents a movie from The Movie Database (TMDB) API.
 * Maps to the movie object in the TMDB /movie/popular and /search/movie responses.
 */
export interface Movie {
  id: number;
  title: string;
  original_title: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  adult: boolean;
  video: boolean;
}

/**
 * Paginated response from TMDB API endpoints.
 * Used for both /movie/popular and /search/movie.
 */
export interface TmdbResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}
