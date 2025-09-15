import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment'; // Adjust path if needed

export interface Branch {
  BID: number;
  Branch: string;
}

export interface MouryaBranchSummary {
  NoOfInitiations?: number;
  StartedInitiationCount?: number;
  VisitDoneCount?: number;
  VisitPendingCount?: number;
  ReportDoneCount?: number;
  ReportPendingCount?: number;
  ReportSentCount?: number;
  Reportinprocess?: number;
  RejectWithoutVisit?: number;
  RejectAfterVisit?: number;
  // Add other properties if needed
}

export interface ApiResponse<T> {
  error?: boolean;
  message?: T;
}

@Injectable({
  providedIn: 'root'
})
export class MouryaBranchReportService {

  private apiUrl = environment.apiUrl || 'http://localhost:3000/api'; // Adjust base URL as needed

  constructor(private http: HttpClient) { }

  getBranches(): Observable<ApiResponse<Branch[]>> {
    return this.http.get<ApiResponse<Branch[]>>(`${this.apiUrl}/branches`);
  }

  getBranchReport(branch: string, fromDate: string, toDate: string): Observable<ApiResponse<MouryaBranchSummary[]>> {
    let params = new HttpParams()
      .set('branch', branch)
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<ApiResponse<MouryaBranchSummary[]>>(`${this.apiUrl}/branch-report`, { params });
  }
}