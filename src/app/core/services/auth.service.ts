import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const storedUser = localStorage.getItem(this.userKey);
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<any> {
    const formData = new FormData();
    formData.append('Email', email);
    formData.append('Password', password);

    return this.http.post<any>('https://api.mouryaconcepts.com/vendor/webapplogin', formData)
      .pipe(
        map(response => {
          if (response && response.error === false && response.userinfo && response.userinfo.length > 0) {
            const userInfo = response.userinfo[0];

            // Create a user object from the API response
            const user: User = {
              id: userInfo.UserID,
              email: userInfo.Email,
              name: userInfo.Name,
              role: userInfo.UserRole.toLowerCase()
            };

            // Use message as token for now
            const token = response.message || 'Login Success';

            // Store token and user details
            localStorage.setItem(this.tokenKey, token);
            localStorage.setItem(this.userKey, JSON.stringify(user));
            this.currentUserSubject.next(user);

            return response;
          } else {
            throw new Error(response.message || 'Login failed');
          }
        })
      );
  }

  logout(): void {
    // Remove user from local storage and set current user to null
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const user = this.currentUserValue;
    return user?.role?.toLowerCase() === 'admin';
  }

  isManager(): boolean {
    const user = this.currentUserValue;
    return user?.role?.toLowerCase() === 'manager';
  }
}
