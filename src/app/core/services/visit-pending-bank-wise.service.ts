import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces for the service
export interface Bank {
  Bank: string;
}

export interface BankBranch {
  BID: number;
  Branch: string;
}

export interface VisitPendingBankRecord {
  CustName: string;
  TransID: number;
  DateofRequest: string;
  VisitEngineer?: string;
  Status: string;
  Comments: string;
}

export interface ApiResponse<T> {
  error: boolean;
  message: T;
}

@Injectable({
  providedIn: 'root'
})
export class VisitPendingBankWiseService {
  private baseUrl = 'https://api.mouryaconcepts.com/vendor';

  constructor(private http: HttpClient) { }

  getBanks(): Observable<ApiResponse<Bank[]>> {
    return this.http.get<ApiResponse<Bank[]>>(`${this.baseUrl}/getbanklist`);
  }

  getBankBranches(): Observable<ApiResponse<BankBranch[]>> {
    return this.http.get<ApiResponse<BankBranch[]>>(`${this.baseUrl}/getbankbranchinfo`);
  }

  getVisitPendingByBankBranch(bank: string, branch: string): Observable<ApiResponse<VisitPendingBankRecord[]>> {
    const formData = new FormData();
    formData.append('Bank', bank);
    formData.append('AssignerBranch', branch);

    return this.http.post<ApiResponse<VisitPendingBankRecord[]>>(
      `${this.baseUrl}/adminmouryabankfilter`,
      formData
    );
  }
}