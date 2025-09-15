import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DashboardData {
  TotalTransactions: number;
  MouryaUsersCount: number;
  VisitPendingCount: number;
  VisitCompletedCount: number;
  TotalBankClients: number;
  SiteEngineersCount: number;
  ReportEngineersCount: number;
  ReportPendingCount: number;
  DocumentPendingCount: number;
}

export interface BranchReportData {
  Branch: string;
  NoOfInitiations: number;
  ReportSentCount: number;
  VisitDoneCount: number;
  StartedInitiationCount: number;
  Reportinprocess: number;
  ReportPendingCount: number;
  RejectWithoutVisit: number;
  RejectAfterVisit: number;
  VisitPendingCount: number;
  Others: number;
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://api.mouryaconcepts.com/vendor/getadmindashboardinfo';

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<{ error: boolean; message: DashboardData[] }> {
    return this.http.get<{ error: boolean; message: DashboardData[] }>(this.apiUrl);
  }

  getBranchReport(branch: string, fromDate: string, toDate: string): Observable<{ error: boolean; message: BranchReportData[] }> {
    const formData = new FormData();
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post<{ error: boolean; message: BranchReportData[] }>('https://api.mouryaconcepts.com/vendor/adminReportonBranchDatenew', formData);
  }
}
