import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface BankSummary {
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

export interface BankVisitTeamMember {
  EmpName: string;
  Counter: number;
}

export interface BankReportTeamMember {
  VisitEngineer: string;
  Counter: number;
}

export interface BankInvoiceDetail {
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
export class BankReportService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get branches by bank
  getBranchesByBank(bank: string): Observable<any> {
    const formData = new FormData();
    formData.append('Bank', bank);
    return this.http.post(`${this.apiUrl}/vendor/getbranchbybank`, formData);
  }

  // Get bank summary report
  getBankSummary(bank: string, branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Bank', bank);
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    console.log('Bank Summary API call:', {
      endpoint: `${this.apiUrl}/vendor/adminreportonbranchdate`,
      params: {
        Bank: bank,
        Branch: branch,
        DORFrom: fromDate,
        DORTo: toDate
      }
    });

    return this.http.post(`${this.apiUrl}/vendor/adminreportonbranchdate`, formData);
  }

  // Get bank visit team statistics
  getBankVisitTeamStats(bank: string, branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Bank', bank);
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post(`${this.apiUrl}/vendor/adminbankvisitsinfo`, formData);
  }

  // Get bank report team statistics
  getBankReportTeamStats(bank: string, branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Bank', bank);
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post(`${this.apiUrl}/vendor/adminbankreportsinfo`, formData);
  }

  // Get bank cash/GPay details
  getBankCashDetails(bank: string, branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Bank', bank);
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post(`${this.apiUrl}/vendor/adminbankcashinfo`, formData);
  }

  // Get bank performa invoice details
  getBankPerformaInvoiceDetails(bank: string, branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Bank', bank);
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post(`${this.apiUrl}/vendor/adminbankperformainfo`, formData);
  }

  // Get bank regular invoice details
  getBankRegularInvoiceDetails(bank: string, branch: string, fromDate: string, toDate: string): Observable<any> {
    const formData = new FormData();
    formData.append('Bank', bank);
    formData.append('Branch', branch);
    formData.append('DORFrom', fromDate);
    formData.append('DORTo', toDate);

    return this.http.post(`${this.apiUrl}/vendor/adminbankregularinfo`, formData);
  }
}