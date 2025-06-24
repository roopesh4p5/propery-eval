import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BranchReport {
  Branch: string;
  VisitDoneCount: number;
  VisitPendingCount: number;
  ReportSentCount: number;
  ReportPendingCount: number;
  StartedInitiationCount: number;
  RejectWithoutVisit: number;
  Others: number;
  RejectAfterVisit: number;
  Reportinprocess: number;
  NoOfInitiations: number;
}

export interface MonthlyReport {
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
  Client_Branch: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getBranchReport(branch: string, fromDate: string, toDate: string): Observable<{ error: boolean; message: BranchReport[] }> {
    const formData = new FormData();
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post<{ error: boolean; message: BranchReport[] }>(
      `${this.apiUrl}/vendor/adminreportonbranchdatenew`,
      formData
    );
  }

  getMonthlyReportByDate(fromDate: string, toDate: string): Observable<{ error: boolean; message: MonthlyReport[] }> {
    const formData = new FormData();
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post<{ error: boolean; message: MonthlyReport[] }>(
      `${this.apiUrl}/vendor/getadminmonthlyreportinfodate`,
      formData
    );
  }

  getMonthlyReportByDateAndBank(fromDate: string, toDate: string, bank: string): Observable<{ error: boolean; message: MonthlyReport[] }> {
    const formData = new FormData();
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);
    formData.append('Bank', bank);

    return this.http.post<{ error: boolean; message: MonthlyReport[] }>(
      `${this.apiUrl}/vendor/getadminmonthlyreportinfodatebank`,
      formData
    );
  }

  getMonthlyReportByDateBankAndBranch(fromDate: string, toDate: string, bank: string, branch: string): Observable<{ error: boolean; message: MonthlyReport[] }> {
    const formData = new FormData();
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);
    formData.append('Bank', bank);
    formData.append('Branch', branch);

    return this.http.post<{ error: boolean; message: MonthlyReport[] }>(
      `${this.apiUrl}/vendor/getadminmonthlyreportinfo`,
      formData
    );
  }
}
