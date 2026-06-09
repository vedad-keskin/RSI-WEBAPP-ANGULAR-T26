import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../../core/models/build-http-params';
import { ListUplateRequest, ListUplateResponse } from './uplate-api.models';

@Injectable({
  providedIn: 'root'
})
export class UplateApiService {
  private readonly baseUrl = `${environment.apiUrl}/Uplate`;
  private http = inject(HttpClient);

  /**
   * GET /Uplate
   * List uplate with pagination.
   */
  list(request?: ListUplateRequest): Observable<ListUplateResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListUplateResponse>(this.baseUrl, {
      params,
    });
  }

}
