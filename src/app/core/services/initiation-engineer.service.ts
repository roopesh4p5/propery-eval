import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InitiationEngineer {
  InID?: number;
  InName: string;
  InEmail: string;
  InContact: string;
  InBranch: string;
}

@Injectable({
  providedIn: 'root'
})
export class InitiationEngineerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get all initiation engineers
  getInitiationEngineers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vendor/getininfo`);
  }

  // Add a new initiation engineer
  addInitiationEngineer(engineer: InitiationEngineer): Observable<any> {
    const formData = new FormData();
    formData.append('InName', engineer.InName);
    formData.append('InEmail', engineer.InEmail);
    formData.append('InContact', engineer.InContact);
    formData.append('InBranch', engineer.InBranch);
    
    return this.http.post(`${this.apiUrl}/vendor/insertineng`, formData);
  }

  // Delete an initiation engineer
  deleteInitiationEngineer(inId: number): Observable<any> {
    const formData = new FormData();
    formData.append('InID', inId.toString());
    
    return this.http.post(`${this.apiUrl}/vendor/deleteineng`, formData);
  }

  // Update an initiation engineer
  updateInitiationEngineer(engineer: InitiationEngineer): Observable<any> {
    const formData = new FormData();
    formData.append('InID', engineer.InID!.toString());
    formData.append('InName', engineer.InName);
    formData.append('InEmail', engineer.InEmail);
    formData.append('InContact', engineer.InContact);
    formData.append('InBranch', engineer.InBranch);
    
    return this.http.post(`${this.apiUrl}/vendor/updateineng`, formData);
  }
}
