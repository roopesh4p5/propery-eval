import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces for the service
export interface Engineer {
  EmpName: string;
}

export interface VisitPendingRecord {
  CustName: string;
  Bank: string;
  TransID: number;
  DateofRequest: string;
  Comments: string;
  Status: string;
}

export interface ApiResponse<T> {
  error: boolean;
  message: T;
}

@Injectable({
  providedIn: 'root'
})
export class VisitPendingService {
  private baseUrl = 'https://api.mouryaconcepts.com/vendor';

  constructor(private http: HttpClient) { }

  getEngineers(): Observable<ApiResponse<Engineer[]>> {
    return this.http.get<ApiResponse<Engineer[]>>(`${this.baseUrl}/getvelist`);
  }

  getVisitPendingByEngineer(engineerName: string): Observable<ApiResponse<VisitPendingRecord[]>> {
    const formData = new FormData();
    formData.append('EmpName', engineerName);

    return this.http.post<ApiResponse<VisitPendingRecord[]>>(
      `${this.baseUrl}/adminvisitengfilter`,
      formData
    );
  }
}