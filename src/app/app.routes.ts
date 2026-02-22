import { Routes } from '@angular/router';

import { SearchComponent } from './components/search/search.component';
import { CompaniesComponent } from './components/companies/companies.component';
import { CompanyDetailComponent } from './components/company-detail/company-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: SearchComponent },
  { path: 'companies', component: CompaniesComponent },
  { path: 'companies/:id', component: CompanyDetailComponent },
];
