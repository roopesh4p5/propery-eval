import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ManagerService {
  private baseUrl = 'https://api.mouryaconcepts.com/vendor';

  constructor(private http: HttpClient) {}

  getBanks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getbankinfo`);
  }

  getBankBranches(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getbankbranchinfo`);
  }

  getManagerEmails(assignerId: string): Observable<any> {
    const formData = new FormData();
    formData.append('AssignerID', assignerId);
    return this.http.post(`${this.baseUrl}/getempemailbymid`, formData);
  }

  getEngineerEmails(assignerId: string): Observable<any> {
    const formData = new FormData();
    formData.append('AssignerID', assignerId);
    return this.http.post(`${this.baseUrl}/getienamebymid`, formData);
  }

  getReportEngineers(assignerId: string): Observable<any> {
    const formData = new FormData();
    formData.append('AssignerID', assignerId);
    return this.http.post(`${this.baseUrl}/getrepengbymid`, formData);
  }

  getMouryaBranches(assignerId: string): Observable<any> {
    const formData = new FormData();
    formData.append('AssignerID', assignerId);
    return this.http.post(`${this.baseUrl}/getmouryarefbymid`, formData);
  }

  getTransactionsByManager(assignerId: string): Observable<any> {
    const formData = new FormData();
    formData.append('AssignerID', assignerId);
    return this.http.post(`${this.baseUrl}/gettransinfobymanagerid`, formData);
  }

  submitInitiation(data: any): Observable<any> {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return this.http.post(`${this.baseUrl}/newaddtransactioninfolatest`, formData);
  }

  getBankListByMid(assignerId: string): Observable<any> {
    const formData = new FormData();
    formData.append('AssignerID', assignerId);
    return this.http.post(`${this.baseUrl}/getbanklistbymid`, formData);
  }

  getManagerReportOnBankDateId(bank: string, dorFrom: string, dorTo: string, assignerId: string): Observable<any> {
    const formData = new FormData();
    formData.append('Bank', bank);
    formData.append('DORFrom', dorFrom);
    formData.append('DORTo', dorTo);
    formData.append('AssignerID', assignerId);
    return this.http.post(`${this.baseUrl}/managerreportonbankdateid`, formData);
  }

  getManagerAttachments(assignerId: string): Observable<any> {
    const formData = new FormData();
    formData.append('AssignerID', assignerId);
    return this.http.post(`${this.baseUrl}/managergetattachmentinfo`, formData);
  }

  getManagerAttachmentsByRefNo(refNo: string, assignerId: string): Observable<any> {
    const formData = new FormData();
    formData.append('RefNo', refNo);
    formData.append('AssignerID', assignerId);
    return this.http.post(`${this.baseUrl}/managergetattachmentinfobyrefno`, formData);
  }
}
