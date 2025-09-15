import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

export interface AttachmentUploadResponse {
  error: boolean;
  message: string;
  data?: any;
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

  /**
   * Upload report attachment
   * @param transId - Transaction ID (Mourya Ref No)
   * @param file - File to upload
   * @returns Observable<AttachmentUploadResponse>
   */
  uploadReportAttachment(transId: string, file: File): Observable<AttachmentUploadResponse> {
    const formData = new FormData();
    formData.append('TransID', transId);
    formData.append('ReportAttachment', file);

    // Set headers to match the curl request
    const headers = new HttpHeaders({
      'Accept': 'application/json, text/plain, */*',
      'Referer': 'https://app.mouryaconcepts.com/'
    });

    // Use the direct API endpoint for report upload
    const uploadUrl = 'https://api.mouryaconcepts.com/reportupload.php';
    return this.http.post<AttachmentUploadResponse>(uploadUrl, formData, { headers });
  }

  /**
   * Validate file before upload
   * @param file - File to validate
   * @returns validation result with message
   */
  validateFile(file: File): { isValid: boolean; message: string } {
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        message: 'File size must be less than 10MB'
      };
    }

    // Check file type (allow common image and document formats)
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        message: 'File type not supported. Please upload JPG, PNG, GIF, PDF, or Word documents.'
      };
    }

    return {
      isValid: true,
      message: 'File is valid'
    };
  }

}
