import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

// Angular Material imports
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/movie.model';

/**
 * Component that displays a paginated, searchable table of popular movies
 * from The Movie Database (TMDB) API.
 *
 * Features:
 * - Server-side pagination (TMDB handles paging)
 * - Search with 400ms debounce
 * - Loading spinner during API calls
 * - Error handling with snackbar notifications
 */
@Component({
  selector: 'app-movies-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule,
  ],
  templateUrl: './movies-table.component.html',
  styleUrl: './movies-table.component.scss',
})
export class MoviesTableComponent implements OnInit, OnDestroy {
  /** Columns displayed in the table */
  displayedColumns: string[] = ['poster', 'title', 'release_date', 'vote_average', 'overview'];

  /** Movie data currently displayed in the table */
  movies: Movie[] = [];

  /** Cached movies from the currently loaded TMDB page (20 items) */
  private currentTmdbPageMovies: Movie[] = [];
  
  /** The TMDB page currently cached */
  private loadedTmdbPage = 0;

  /** Total number of results (for paginator) */
  totalResults = 0;

  /** Current page index (0-based for Material paginator) */
  pageIndex = 0;

  /** Items per page */
  pageSize = 5;

  /** Loading state */
  isLoading = false;

  /** Current search query */
  searchQuery = '';

  /** Subject for search input debouncing */
  private searchSubject = new Subject<string>();

  /** Subject for cleanup on destroy */
  private destroy$ = new Subject<void>();

  constructor(
    private movieService: MovieService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Setup debounced search
    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((query) => {
        this.searchQuery = query;
        this.pageIndex = 0; // Reset to first page on new search
        this.loadedTmdbPage = 0; // Invalidate cache
        this.loadMovies();
      });

    // Initial data load
    this.loadMovies();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Handles search input changes with debounce.
   */
  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  /**
   * Clears the search filter and reloads popular movies.
   */
  clearSearch(): void {
    this.searchQuery = '';
    this.searchSubject.next('');
  }

  /**
   * Handles page change events from MatPaginator.
   */
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMovies();
  }

  /**
   * Builds the poster image URL for a movie.
   */
  getPosterUrl(posterPath: string | null): string {
    return this.movieService.getPosterUrl(posterPath, 'w92');
  }

  /**
   * Returns a color class based on the movie's vote average.
   */
  getRatingClass(rating: number): string {
    if (rating >= 7) return 'rating-high';
    if (rating >= 5) return 'rating-medium';
    return 'rating-low';
  }

  /**
   * Loads movies from TMDB API (popular or search) and updates displayed data.
   */
  private loadMovies(): void {
    // TMDB always returns 20 items per page.
    // Calculate which TMDB page contains the items we need for our UI page.
    const requiredTmdbPage = Math.floor((this.pageIndex * this.pageSize) / 20) + 1;

    // If we already have the required TMDB page cached, just update the view
    if (this.loadedTmdbPage === requiredTmdbPage && this.currentTmdbPageMovies.length > 0) {
      this.updateDisplayedMovies();
      return;
    }

    this.isLoading = true;

    const request$ = this.searchQuery.trim()
      ? this.movieService.searchMovies(this.searchQuery.trim(), requiredTmdbPage)
      : this.movieService.getPopularMovies(requiredTmdbPage);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        this.currentTmdbPageMovies = response.results;
        this.totalResults = response.total_results;
        this.loadedTmdbPage = requiredTmdbPage;
        this.updateDisplayedMovies();
        this.isLoading = false;
      },
      error: (error: Error) => {
        this.isLoading = false;
        this.movies = [];
        this.currentTmdbPageMovies = [];
        this.totalResults = 0;
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      },
    });
  }

  /**
   * Slices the cached TMDB page results to match the current UI pagination state.
   */
  private updateDisplayedMovies(): void {
    const startIndex = (this.pageIndex * this.pageSize) % 20;
    this.movies = this.currentTmdbPageMovies.slice(startIndex, startIndex + this.pageSize);
  }
}
