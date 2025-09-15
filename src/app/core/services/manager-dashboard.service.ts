import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ManagerDashboardData {
  TotalTransactions: number;
  VisitPendingCount: number;
  VisitCompletedCount: number;
  TotalBankClients: number;
  ReportPendingCount: number;
  DocumentPendingCount: number;
}

export interface ManagerDashboardApiResponse {
  error: boolean;
  message: ManagerDashboardData[];
}

@Injectable({
  providedIn: 'root'
})
export class ManagerDashboardService {
  private apiUrl = 'https://api.mouryaconcepts.com/vendor/getdashinfobymanagerid';

  constructor(private http: HttpClient) {}

  getDashboardInfo(assignerId: number): Observable<ManagerDashboardApiResponse> {
    const formData = new FormData();
    formData.append('AssignerID', assignerId.toString());
    const headers = new HttpHeaders({
      // Content-Type should NOT be set for FormData; browser will set boundary
      'Accept': 'application/json, text/plain, */*'
    });
  return this.http.post<ManagerDashboardApiResponse>(this.apiUrl, formData, { headers });
  }
}
