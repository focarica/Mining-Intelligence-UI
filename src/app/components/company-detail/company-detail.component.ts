import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CompanyDetail, Leader, Asset } from '../../models';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [],
  templateUrl: './company-detail.component.html',
})
export class CompanyDetailComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  company = signal<CompanyDetail | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  activeTab = signal<'leaders' | 'assets'>('leaders');

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
