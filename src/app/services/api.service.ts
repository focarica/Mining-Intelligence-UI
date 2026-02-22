import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Company,
  CompanyDetail,
  SearchRequest,
  SearchResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://mining-intelligence-pipeline-production.up.railway.app/api';

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/companies`);
  }

  getCompany(id: string): Observable<CompanyDetail> {
    return this.http.get<CompanyDetail>(`${this.baseUrl}/companies/${id}`);
  }

  search(request: SearchRequest): Observable<SearchResponse> {
    return this.http.post<SearchResponse>(`${this.baseUrl}/search`, request);
  }
}
