import { Component, inject, OnInit, signal, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CompanyDetail, Leader, Asset, CompanyQnAResponse } from '../../models';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './company-detail.component.html',
})
export class CompanyDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  company = signal<CompanyDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<'leaders' | 'assets'>('leaders');

  // Q&A state
  qaQuestion: string = '';
  qaLoading: boolean = false;
  qaError: string | null = null;
  qaAnswer: string | null = null;
  qaNoResults: boolean = false;


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCompany(id);
    } else {
      this.error.set('Invalid company ID');
      this.loading.set(false);
    }
  }

  loadCompany(id: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getCompany(id).subscribe({
      next: (company) => {
        this.company.set(company);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load company');
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/companies']);
  }

  setTab(tab: 'leaders' | 'assets'): void {
    this.activeTab.set(tab);
  }

  onAsk(event: Event): void {
    event.preventDefault();
    if (!this.company() || !this.qaQuestion.trim()) return;
    this.qaError = null;
    this.qaAnswer = null;
    this.qaNoResults = false;
    this.qaLoading = true;
    
    this.api.askCompanyQuestion(this.company()!.id, this.qaQuestion.trim()).subscribe({
      next: (resp: CompanyQnAResponse) => {
        try {
          this.qaAnswer = resp.answer;
          this.qaNoResults = !resp.answer || resp.answer.trim().length === 0;
        } catch (e) {
          console.error("Error processing Q&A response", e);
          this.qaError = "Error processing answer.";
        } finally {
          this.qaLoading = false;
          this.cdr.detectChanges(); // Force UI to update
        }
      },
      error: (err) => {
        console.error("API Error", err);
        this.qaError = err?.error?.detail || err?.message || 'Q&A request failed.';
        this.qaLoading = false;
        this.cdr.detectChanges(); // Force UI to update
      }
    });
  }

  get executives(): Leader[] {
    return this.company()?.leaders.filter((l) => l.leader_type === 'executive') || [];
  }

  get boardMembers(): Leader[] {
    return this.company()?.leaders.filter((l) => l.leader_type === 'board') || [];
  }

  get operatingAssets(): Asset[] {
    return this.company()?.assets.filter((a) => a.status === 'operating') || [];
  }

  get developingAssets(): Asset[] {
    return this.company()?.assets.filter((a) => a.status === 'developing') || [];
  }
}
