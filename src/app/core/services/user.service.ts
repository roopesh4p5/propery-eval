import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Branch {
  BID: number;
  Branch: string;
}

export interface UserRole {
  id: string;
  name: string;
}

export interface User {
  UserID: number;
  Name: string;
  Email: string;
  Password: string;
  UserRole: string;
  IsActive: string;
  Branch: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://api.mouryaconcepts.com/vendor';

  constructor(private http: HttpClient) { }

  getBranches(): Observable<{ error: boolean; message: Branch[] }> {
    return this.http.get<{ error: boolean; message: Branch[] }>(`${this.apiUrl}/getbankbranchinfo`);
  }

  getUsers(): Observable<{ error: boolean; message: User[] }> {
    return this.http.get<{ error: boolean; message: User[] }>(`${this.apiUrl}/getappusers`);
  }

  addUser(userData: {
    Name: string;
    Email: string;
    Password: string;
    UserRole: string;
    IsActive: string;
    Branch: string;
  }): Observable<any> {
    const formData = new FormData();
    formData.append('Name', userData.Name);
    formData.append('Email', userData.Email);
    formData.append('Password', userData.Password);
    formData.append('UserRole', userData.UserRole);
    formData.append('IsActive', userData.IsActive);
    formData.append('Branch', userData.Branch);

    return this.http.post<any>(`${this.apiUrl}/insertappuser`, formData);
  }

  updateUser(userData: {
    UserID: number;
    Name: string;
    Email: string;
    Password: string;
    UserRole: string;
    IsActive: string;
    Branch: string;
  }): Observable<any> {
    const formData = new FormData();
    formData.append('UserID', userData.UserID.toString());
    formData.append('Name', userData.Name);
    formData.append('Email', userData.Email);
    formData.append('Password', userData.Password);
    formData.append('UserRole', userData.UserRole);
    formData.append('IsActive', userData.IsActive);
    formData.append('Branch', userData.Branch);

    return this.http.post<any>(`${this.apiUrl}/updateappuser`, formData);
  }

  deleteUser(userId: number): Observable<any> {
    const formData = new FormData();
    formData.append('UserID', userId.toString());

    return this.http.post<any>(`${this.apiUrl}/deleteappuser`, formData);
  }

  getUserRoles(): UserRole[] {
    return [
      { id: 'Admin', name: 'Admin' },
      { id: 'Manager', name: 'Manager' },
      { id: 'SubAdmin', name: 'SubAdmin' }
    ];
  }
}
