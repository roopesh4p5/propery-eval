import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BranchSummary {
  NoOfInitiations?: number;
  VisitDoneCount?: number;
  VisitPendingCount?: number;
  ReportDoneCount?: number;
  ReportPendingCount?: number;
  ReportSentCount?: number;
  StartedInitiationCount?: number;
  RejectWithoutVisit?: number;
  Others?: number;
  RejectAfterVisit?: number;
  Reportinprocess?: number;
  DocumentPending?: number;
}

export interface VisitTeamMember {
  EmpName: string;
  Counter: number;
}

export interface ReportTeamMember {
  VisitEngineer: string;
  Counter: number;
}

export interface InvoiceDetail {
  CustName: string;
  Bank: string;
  Branch: string;
  InvoiceDate: string;
  InvoiceNo: string;
  AmountWithoutGST: string;
  AmountWithGST: string;
  Remarks: string;
  Pay_Status: string;
  Client_GSTIN: string;
  Client_Branch: string;
  TransID?: number;
}

@Injectable({
  providedIn: 'root'
})
export class BranchReportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get branch summary
  getBranchSummary(branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    console.log('Branch Summary API call:', {
      endpoint: `${this.apiUrl}/vendor/adminreportonbranchdate`,
      params: {
        Branch: branch,
        DORFrom: fromDate,
        DORTo: toDate
      }
    });

    return this.http.post(`${this.apiUrl}/vendor/adminreportonbranchdate`, formData);
  }

  // Get visit team statistics
  getVisitTeamStats(branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post(`${this.apiUrl}/vendor/adminbranchvisitsinfo`, formData);
  }

  // Get report team statistics
  getReportTeamStats(branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post(`${this.apiUrl}/vendor/adminbranchreportsinfo`, formData);
  }

  // Get cash/GPay details
  getCashDetails(branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post(`${this.apiUrl}/vendor/adminbranchcashinfo`, formData);
  }

  // Get performa invoice details
  getPerformaInvoiceDetails(branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post(`${this.apiUrl}/vendor/adminbranchperformainfo`, formData);
  }

  // Get regular invoice details
  getRegularInvoiceDetails(branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post(`${this.apiUrl}/vendor/adminbranchregularinfo`, formData);
  }
}
