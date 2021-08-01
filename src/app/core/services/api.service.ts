import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private http: HttpClient
  ) {}

  formatErrors(err: any) {
    return throwError(err.error.error);
  }

  get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
    params = params.set('pagination', 'true');

    return this.http.get(`${environment.api_url}${path}`, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(path: string, body: {}): Observable<any> {
    return this.http.put(
      `${environment.api_url}${path}`,
      body
    ).pipe(catchError(this.formatErrors));
  }

  post(path: string, body: {}): Observable<any> {
    return this.http.post(
      `${environment.api_url}${path}`,
      body
    ).pipe(catchError(this.formatErrors));
  }

  delete(path): Observable<any> {
    return this.http.delete(
      `${environment.api_url}${path}`
    ).pipe(catchError(this.formatErrors));
  }
}
