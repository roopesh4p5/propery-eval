import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Engineer {
  EmpID?: number;
  EmpName: string;
  EmpEmail: string;
  EmpContact: string;
  Branch: string;
}

@Injectable({
  providedIn: 'root'
})
export class EngineerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get all engineers
  getEngineers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vendor/getempinfo`);
  }

  // Add a new engineer
  addEngineer(engineer: Engineer): Observable<any> {
    const formData = new FormData();
    formData.append('EmpName', engineer.EmpName);
    formData.append('EmpEmail', engineer.EmpEmail);
    formData.append('EmpContact', engineer.EmpContact);
    formData.append('Branch', engineer.Branch);

    return this.http.post(`${this.apiUrl}/vendor/insertveng`, formData);
  }

  // Delete an engineer
  deleteEngineer(empId: number): Observable<any> {
    const formData = new FormData();
    formData.append('EmpID', empId.toString());

    return this.http.post(`${this.apiUrl}/vendor/deleteemp`, formData);
  }

  // Update an engineer
  updateEngineer(engineer: Engineer): Observable<any> {
    const formData = new FormData();
    formData.append('EmpID', engineer.EmpID!.toString());
    formData.append('EmpName', engineer.EmpName);
    formData.append('EmpEmail', engineer.EmpEmail);
    formData.append('EmpContact', engineer.EmpContact);
    formData.append('Branch', engineer.Branch);

    return this.http.post(`${this.apiUrl}/vendor/updateemp`, formData);
  }
}
