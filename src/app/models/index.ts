export interface Company {
  id: string;
  name: string;
  website: string | null;
}

export interface Leader {
  id: string;
  name: string;
  title: string;
  leader_type: 'executive' | 'board';
  expertise: string[] | null;
  technical_summary: string[] | null;
  company_id: string;
}

export interface Asset {
  id: string;
  name: string;
  commodity: string[] | null;
  status: 'operating' | 'developing';
  country: string | null;
  state_province: string | null;
  town: string | null;
  latitude: number | null;
  longitude: number | null;
  company_id: string;
}

export interface CompanyDetail extends Company {
  leaders: Leader[];
  assets: Asset[];
}

export interface SearchResult {
  company_name: string;
  status: 'success' | 'failed' | 'skipped';
  company_id: string | null;
  leaders_count: number;
  assets_count: number;
  error: string | null;
}

export interface SearchResponse {
  results: SearchResult[];
  total_requested: number;
  successful: number;
  failed: number;
  skipped: number;
}

export interface SearchRequest {
  query: string;
  force_refresh: boolean;
}

export interface CompanyQnARequest {
  question: string;
}

export interface CompanyQnACitation {
  leader_name: string;
  title: string;
  expertise: string[];
  document_type: string;
  source_url: string;
}

export interface CompanyQnAResponse {
  answer: string;
  citations: CompanyQnACitation[];
}
