import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TmdbResponse } from '../models/movie.model';
import { environment } from '../../environments/environment';

/**
 * Service for consuming The Movie Database (TMDB) API v3.
 * Handles fetching popular movies and searching by title.
 */
@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly baseUrl = environment.tmdbBaseUrl;
  private readonly apiKey = environment.tmdbApiKey;

  constructor(private http: HttpClient) {}

  /**
   * Fetches a paginated list of popular movies.
   * @param page Page number (1-based, TMDB supports up to 500 pages)
   * @returns Observable with paginated TMDB response
   */
  getPopularMovies(page: number = 1): Observable<TmdbResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString())
      .set('language', 'es-ES');

    return this.http
      .get<TmdbResponse>(`${this.baseUrl}/movie/popular`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Searches movies by title with server-side pagination.
   * @param query Search term (movie title)
   * @param page Page number (1-based)
   * @returns Observable with paginated search results
   */
  searchMovies(query: string, page: number = 1): Observable<TmdbResponse> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('query', query)
      .set('page', page.toString())
      .set('language', 'es-ES');

    return this.http
      .get<TmdbResponse>(`${this.baseUrl}/search/movie`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Builds the full URL for a movie poster image.
   * @param posterPath Relative poster path from TMDB (e.g., "/1E5baAaEse26fej7uHcjOgEERB2.jpg")
   * @param size Image size variant (w92, w154, w185, w342, w500, w780, original)
   * @returns Full URL to the poster image, or a placeholder if no poster is available
   */
  getPosterUrl(posterPath: string | null, size: string = 'w185'): string {
    if (!posterPath) {
      return 'assets/no-poster.svg';
    }
    return `${environment.tmdbImageBaseUrl}/${size}${posterPath}`;
  }

  /**
   * Centralized error handler for HTTP requests.
   * Transforms HTTP errors into user-friendly messages.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ha ocurrido un error al conectar con el servicio de películas.';

    if (error.status === 0) {
      errorMessage = 'No se pudo conectar al servidor. Verifica tu conexión a internet.';
    } else if (error.status === 401) {
      errorMessage = 'API key de TMDB inválida. Verifica tu configuración en environment.ts.';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado en TMDB.';
    } else if (error.status === 429) {
      errorMessage = 'Demasiadas solicitudes. Espera un momento e intenta de nuevo.';
    } else if (error.status >= 500) {
      errorMessage = 'Error en el servidor de TMDB. Intenta más tarde.';
    }

    console.error('MovieService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
