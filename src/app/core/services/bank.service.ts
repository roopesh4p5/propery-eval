import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bank {
  Bank: string;
  BankID?: number;
  BankName?: string;
}

export interface Branch {
  BID: number;
  Branch: string;
}

export interface BankBranchInfo {
  BBID?: number;
  Branch: string;
  Bank: string;
  BState: string;
  BillName: string;
  BillAcc: string;
  BillIFSC: string;
  BPAN: string;
  BGSTIN: string;
  Our_Bank: string;
  From_Name: string;
  BEmail: string;
  BMobile: string;
  BAddress: string;
  From_GSTIN: string;
  To_Name: string;
  To_Email: string;
  To_Mobile: string;
  To_Address: string;
  To_GSTIN: string;
}

export interface InitiationInfo {
  ID?: number;
  MouryaRefNo: string;
  DateOfRequest: string;
  BankersAgentName: string;
  BankRefNo: string;
  Bank: string;
  MouryaBranch: string;
  ClientBranch: string;
  NameOfCustomer: string;
  ContactNumber: string;
  CaseType: string;
  AddressOfProperty: string;
  VisitInitiatedTo: string;
  DocumentInformation: string;
  StatusOfReport: string;
  Remarks: string;
  ReportedBy: string;
  PostalAddressVisit: string;
  VisitDate: string;
  ReportDate: string;
  MapLink: string;
  ContactPersonName: string;
  ContactPersonNumber: string;
}

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private apiUrl = 'https://api.mouryaconcepts.com/vendor';

  constructor(private http: HttpClient) { }

  getBanks(): Observable<{ error: boolean; message: Bank[] }> {
    return this.http.get<{ error: boolean; message: Bank[] }>(`${this.apiUrl}/getbanklist`);
  }

  getBankInfo(): Observable<{ error: boolean; message: Bank[] }> {
    return this.http.get<{ error: boolean; message: Bank[] }>(`${this.apiUrl}/getbankinfo`);
  }

  getBranches(): Observable<{ error: boolean; message: Branch[] }> {
    return this.http.get<{ error: boolean; message: Branch[] }>(`${this.apiUrl}/getbankbranchinfo`);
  }

  filterByBankAndBranch(bank: string, branch: string): Observable<{ error: boolean; message: InitiationInfo[] }> {
    const formData = new FormData();
    formData.append('Bank', bank);
    formData.append('Branch', branch);

    return this.http.post<{ error: boolean; message: InitiationInfo[] }>(
      `${this.apiUrl}/adminfilterbankranch`,
      formData
    );
  }

  addBank(bankName: string): Observable<{ error: boolean; message: string }> {
    const formData = new FormData();
    formData.append('Bank', bankName);

    return this.http.post<{ error: boolean; message: string }>(
      `${this.apiUrl}/addbank`,
      formData
    );
  }

  deleteBank(bankId: number): Observable<{ error: boolean; message: string }> {
    const formData = new FormData();
    formData.append('BankID', bankId.toString());

    return this.http.post<{ error: boolean; message: string }>(
      `${this.apiUrl}/deletebank`,
      formData
    );
  }

  addBranch(branchName: string): Observable<{ error: boolean; message: string }> {
    const formData = new FormData();
    formData.append('Branch', branchName);

    return this.http.post<{ error: boolean; message: string }>(
      `${this.apiUrl}/addbranch`,
      formData
    );
  }

  deleteBranch(branchId: number): Observable<{ error: boolean; message: string }> {
    const formData = new FormData();
    formData.append('BID', branchId.toString());

    return this.http.post<{ error: boolean; message: string }>(
      `${this.apiUrl}/deletebankbranch`,
      formData
    );
  }

  getBankBranchInfo(): Observable<{ error: boolean; message: BankBranchInfo[] }> {
    return this.http.get<{ error: boolean; message: BankBranchInfo[] }>(
      `${this.apiUrl}/getbbinfo`
    );
  }

  addBankBranchInfo(bankBranchInfo: BankBranchInfo): Observable<{ error: boolean; message: string }> {
    const formData = new FormData();

    // Append all fields to the form data
    formData.append('Branch', bankBranchInfo.Branch);
    formData.append('Bank', bankBranchInfo.Bank);
    formData.append('BState', bankBranchInfo.BState);
    formData.append('BillName', bankBranchInfo.BillName);
    formData.append('BillAcc', bankBranchInfo.BillAcc);
    formData.append('BillIFSC', bankBranchInfo.BillIFSC);
    formData.append('BPAN', bankBranchInfo.BPAN);
    formData.append('BGSTIN', bankBranchInfo.BGSTIN);
    formData.append('Our_Bank', bankBranchInfo.Our_Bank);
    formData.append('From_Name', bankBranchInfo.From_Name);
    formData.append('BEmail', bankBranchInfo.BEmail);
    formData.append('BMobile', bankBranchInfo.BMobile);
    formData.append('BAddress', bankBranchInfo.BAddress);
    formData.append('From_GSTIN', bankBranchInfo.From_GSTIN);
    formData.append('To_Name', bankBranchInfo.To_Name);
    formData.append('To_Email', bankBranchInfo.To_Email);
    formData.append('To_Mobile', bankBranchInfo.To_Mobile);
    formData.append('To_Address', bankBranchInfo.To_Address);
    formData.append('To_GSTIN', bankBranchInfo.To_GSTIN);

    return this.http.post<{ error: boolean; message: string }>(
      `${this.apiUrl}/updatebankbranch`,
      formData
    );
  }

  updateBankBranchInfo(bankBranchInfo: BankBranchInfo): Observable<{ error: boolean; message: string }> {
    const formData = new FormData();

    // Append all fields to the form data
    formData.append('BBID', bankBranchInfo.BBID?.toString() || '');
    formData.append('Branch', bankBranchInfo.Branch);
    formData.append('Bank', bankBranchInfo.Bank);
    formData.append('BState', bankBranchInfo.BState);
    formData.append('BillName', bankBranchInfo.BillName);
    formData.append('BillAcc', bankBranchInfo.BillAcc);
    formData.append('BillIFSC', bankBranchInfo.BillIFSC);
    formData.append('BPAN', bankBranchInfo.BPAN);
    formData.append('BGSTIN', bankBranchInfo.BGSTIN);
    formData.append('Our_Bank', bankBranchInfo.Our_Bank);
    formData.append('From_Name', bankBranchInfo.From_Name);
    formData.append('BEmail', bankBranchInfo.BEmail);
    formData.append('BMobile', bankBranchInfo.BMobile);
    formData.append('BAddress', bankBranchInfo.BAddress);
    formData.append('From_GSTIN', bankBranchInfo.From_GSTIN);
    formData.append('To_Name', bankBranchInfo.To_Name);
    formData.append('To_Email', bankBranchInfo.To_Email);
    formData.append('To_Mobile', bankBranchInfo.To_Mobile);
    formData.append('To_Address', bankBranchInfo.To_Address);
    formData.append('To_GSTIN', bankBranchInfo.To_GSTIN);

    return this.http.post<{ error: boolean; message: string }>(
      `${this.apiUrl}/updatebankbranch`,
      formData
    );
  }

  deleteBankBranchInfo(bbId: number): Observable<{ error: boolean; message: string }> {
    const formData = new FormData();
    formData.append('BBID', bbId.toString());

    return this.http.post<{ error: boolean; message: string }>(
      `${this.apiUrl}/deletebankbranchinfo`,
      formData
    );
  }
}
