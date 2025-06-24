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

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'https://api.mouryaconcepts.com/vendor/getadmindashboardinfo';

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<{ error: boolean; message: DashboardData[] }> {
    return this.http.get<{ error: boolean; message: DashboardData[] }>(this.apiUrl);
  }
}
