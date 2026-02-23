import { Component, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SearchResponse } from '../../models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnDestroy {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private startTime: number = 0;

  query = signal('');
  forceRefresh = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  results = signal<SearchResponse | null>(null);
  elapsedSeconds = signal(0);
  complete = signal(false);

  ngOnDestroy(): void {
    this.clearTimer();
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private startTimer(): void {
    this.startTime = Date.now();
    this.elapsedSeconds.set(0);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds.set(Math.floor((Date.now() - this.startTime) / 1000));
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  }

  onSubmit(): void {
    const queryValue = this.query().trim();
    if (!queryValue) {
      this.error.set('Please enter at least one company name');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.results.set(null);
    this.complete.set(false);
    this.startTimer();

    this.api
      .search({
        query: queryValue,
        force_refresh: this.forceRefresh(),
      })
      .subscribe({
        next: (response) => {
          this.clearTimer();
          this.complete.set(true);
          this.results.set(response);
          setTimeout(() => {
            this.loading.set(false);
            this.complete.set(false);
          }, 1500);
        },
        error: (err) => {
          this.clearTimer();
          this.error.set(err.message || 'Search failed');
          this.loading.set(false);
        },
      });
  }

  viewCompany(companyId: string): void {
    this.router.navigate(['/companies', companyId]);
  }
}
