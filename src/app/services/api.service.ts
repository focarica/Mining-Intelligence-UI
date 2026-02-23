import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Company,
  CompanyDetail,
  SearchRequest,
  SearchResponse,
  CompanyQnARequest,
  CompanyQnAResponse,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  // Using the localhost base url since this is what was there initially but maybe it should be railway?
  // Let's check where the API is hosted locally. You mentioned seeing logs.
  private readonly baseUrl = 'http://localhost:8000/api';

  getCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.baseUrl}/companies`);
  }

  getCompany(id: string): Observable<CompanyDetail> {
    return this.http.get<CompanyDetail>(`${this.baseUrl}/companies/${id}`);
  }

  search(request: SearchRequest): Observable<SearchResponse> {
    return this.http.post<SearchResponse>(`${this.baseUrl}/search`, request);
  }

  askCompanyQuestion(companyId: string, question: string): Observable<CompanyQnAResponse> {
    const body: CompanyQnARequest = { question };
    return this.http.post<CompanyQnAResponse>(`${this.baseUrl}/companies/${companyId}/ask`, body);
  }
}
