import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ReportEngineer {
  VID?: number;
  VEName: string;
  VEEmail?: string;
  VEContact: string;
  VEBranch: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportEngineerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get all report engineers
  getReportEngineers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vendor/getrepenginfo`);
  }

  // Add a new report engineer
  addReportEngineer(engineer: ReportEngineer): Observable<any> {
    const formData = new FormData();
    formData.append('VEName', engineer.VEName);
    if (engineer.VEEmail) {
      formData.append('VEEmail', engineer.VEEmail);
    }
    formData.append('VEContact', engineer.VEContact);
    formData.append('VEBranch', engineer.VEBranch);
    
    return this.http.post(`${this.apiUrl}/vendor/insertreporteng`, formData);
  }

  // Delete a report engineer
  deleteReportEngineer(vid: number): Observable<any> {
    const formData = new FormData();
    formData.append('VID', vid.toString());
    
    return this.http.post(`${this.apiUrl}/vendor/deletereporteng`, formData);
  }

  // Update a report engineer
  updateReportEngineer(engineer: ReportEngineer): Observable<any> {
    const formData = new FormData();
    formData.append('VID', engineer.VID!.toString());
    formData.append('VEName', engineer.VEName);
    if (engineer.VEEmail) {
      formData.append('VEEmail', engineer.VEEmail);
    }
    formData.append('VEContact', engineer.VEContact);
    formData.append('VEBranch', engineer.VEBranch);
    
    return this.http.post(`${this.apiUrl}/vendor/updatereporteng`, formData);
  }
}
