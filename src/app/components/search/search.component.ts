import { Component, inject, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SearchResponse } from '../../models';

type ProcessingStage = 'idle' | 'searching' | 'extracting' | 'analyzing' | 'storing' | 'complete';

interface StageInfo {
  label: string;
  description: string;
}

const PROCESSING_STAGES: Record<ProcessingStage, StageInfo> = {
  idle: { label: '', description: '' },
  searching: { label: 'Searching', description: 'Finding company websites...' },
  extracting: { label: 'Extracting', description: 'Scraping web pages and content...' },
  analyzing: { label: 'Analyzing', description: 'Identifying leadership and assets...' },
  storing: { label: 'Storing', description: 'Saving to database...' },
  complete: { label: 'Complete', description: 'Processing finished' },
};

const STAGE_ORDER: ProcessingStage[] = ['searching', 'extracting', 'analyzing', 'storing', 'complete'];
const STAGE_DURATIONS = [3000, 8000, 12000, 3000]; // Duration for each stage in ms

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search.component.html',
})
export class SearchComponent implements OnDestroy {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private stageInterval: ReturnType<typeof setTimeout> | null = null;

  query = signal('');
  forceRefresh = signal(false);
  loading = signal(false);
  error = signal<string | null>(null);
  results = signal<SearchResponse | null>(null);
  currentStage = signal<ProcessingStage>('idle');

  get stageInfo(): StageInfo {
    return PROCESSING_STAGES[this.currentStage()];
  }

  get stageProgress(): number {
    const idx = STAGE_ORDER.indexOf(this.currentStage());
    if (idx === -1) return 0;
    return ((idx + 1) / STAGE_ORDER.length) * 100;
  }

  ngOnDestroy(): void {
    this.clearStageInterval();
  }

  private clearStageInterval(): void {
    if (this.stageInterval) {
      clearTimeout(this.stageInterval);
      this.stageInterval = null;
    }
  }

  private advanceStage(stageIndex: number): void {
    if (stageIndex >= STAGE_ORDER.length - 1) {
      return; // Don't auto-advance to 'complete', that happens on API response
    }

    this.stageInterval = setTimeout(() => {
      if (this.loading()) {
        this.currentStage.set(STAGE_ORDER[stageIndex + 1]);
        this.advanceStage(stageIndex + 1);
      }
    }, STAGE_DURATIONS[stageIndex]);
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
    this.currentStage.set('searching');
    this.advanceStage(0);

    this.api
      .search({
        query: queryValue,
        force_refresh: this.forceRefresh(),
      })
      .subscribe({
        next: (response) => {
          this.clearStageInterval();
          this.currentStage.set('complete');
          setTimeout(() => {
            this.results.set(response);
            this.loading.set(false);
            this.currentStage.set('idle');
          }, 500);
        },
        error: (err) => {
          this.clearStageInterval();
          this.error.set(err.message || 'Search failed');
          this.loading.set(false);
          this.currentStage.set('idle');
        },
      });
  }

  viewCompany(companyId: string): void {
    this.router.navigate(['/companies', companyId]);
  }
}
