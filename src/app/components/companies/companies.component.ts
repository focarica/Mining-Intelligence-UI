import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Company } from '../../models';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './companies.component.html',
})
export class CompaniesComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  companies = signal<Company[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.loading.set(true);
    this.error.set(null);

    this.api.getCompanies().subscribe({
      next: (companies) => {
        this.companies.set(companies);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.message || 'Failed to load companies');
        this.loading.set(false);
      },
    });
  }

  viewCompany(company: Company): void {
    this.router.navigate(['/companies', company.id]);
  }
}
