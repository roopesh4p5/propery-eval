import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Attachment {
  AttachmentID?: number;
  MouryaRefNo?: string;
  TransID?: string;
  AttachmentType?: string;
  AttachmentName?: string;
  AttachmentPath?: string;
  UploadDate?: string;
  UploadTime?: string;
  UploadedBy?: string;
  UploadedByName?: string;
  UploadedByRole?: string;
  UploadedByBranch?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Get attachments by Mourya Ref No
  getAttachmentsByRefNo(refNo: string): Observable<any> {
    const formData = new FormData();
    formData.append('TransID', refNo);

    return this.http.post(`${this.apiUrl}/vendor/adminattachfilterbyref`, formData);
  }

  // Get all attachments
  getAllAttachments(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vendor/admingetattachmentinfo`);
  }


}
