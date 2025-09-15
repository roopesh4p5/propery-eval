import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces for the service
export interface Bank {
  Bank: string;
}

export interface Branch {
  BID: number;
  Branch: string;
}

export interface Status {
  value: string;
  label: string;
}

export interface ReportRecord {
  TransID: number;
  AssignerID: string;
  DateofRequest: string;
  CustName: string;
  CustMobile: string;
  CustEmail: string;
  ContactName: string;
  ContactNumber: string;
  RefNo: string;
  PropertyAddress: string;
  CaseType: string;
  MapLink: string;
  Status: string;
  EmpName: string;
  EmpEmail: string;
  EmpContact: string;
  Comments: string;
  Attachment: string;
  VisitAttachment: string;
  PostalAddressVisit: string;
  DistanceFromBranch: string;
  VisitDate: string;
  VisitEngineer: string;
  CreatedDatetime: string;
  CompletedDatetime: string;
  Bank: string;
  Branch: string;
  DocumentInfo: string;
  BankRefNo: string;
  BankAgentName: string;
  AssignerBranch: string;
  ReportDate: string;
}

export interface ApiResponse<T> {
  error: boolean;
  message: T;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsStatusService {
  private baseUrl = 'https://api.mouryaconcepts.com/vendor';

  constructor(private http: HttpClient) { }

  getBanks(): Observable<ApiResponse<Bank[]>> {
    return this.http.get<ApiResponse<Bank[]>>(`${this.baseUrl}/getbanklist`);
  }

  getBranches(): Observable<ApiResponse<Branch[]>> {
    return this.http.get<ApiResponse<Branch[]>>(`${this.baseUrl}/getbankbranchinfo`);
  }

  getReportsByFilter(
    mouryaBranch?: string,
    bank?: string,
    branch?: string,
    status?: string
  ): Observable<ApiResponse<ReportRecord[]>> {
    const formData = new FormData();

    if (mouryaBranch) formData.append('AssignerBranch', mouryaBranch);
    if (bank) formData.append('Bank', bank);
    if (branch) formData.append('Branch', branch);
    if (status) formData.append('Status', status);

    return this.http.post<ApiResponse<ReportRecord[]>>(
      `${this.baseUrl}/adminfilterreportstatus`,
      formData
    );
  }

  searchReports(
    searchType: 'bankRef' | 'customerName' | 'mouraRef',
    searchValue: string
  ): Observable<ApiResponse<ReportRecord[]>> {
    const formData = new FormData();
    let endpoint = '';

    switch (searchType) {
      case 'bankRef':
        formData.append('BankRefNo', searchValue);
        endpoint = `${this.baseUrl}/adminbankreffilter`;
        break;
      case 'customerName':
        formData.append('CustName', searchValue);
        endpoint = `${this.baseUrl}/admincustffilter`;
        break;
      case 'mouraRef':
        formData.append('TransID', searchValue);
        endpoint = `${this.baseUrl}/admininfobytransid`;
        break;
    }

    return this.http.post<ApiResponse<ReportRecord[]>>(endpoint, formData);
  }
}