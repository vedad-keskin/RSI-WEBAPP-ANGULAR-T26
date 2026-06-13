import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../../core/models/build-http-params';
import {
  CreateUplataCommand,
  ListUplateQuery,
  ListUplateResponse
} from './uplate-api.models';

@Injectable({
  providedIn: 'root'
})
export class UplateApiService {
  private readonly baseUrl = `${environment.apiUrl}/Uplate`;
  private http = inject(HttpClient);

  list(request?: ListUplateQuery): Observable<ListUplateResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListUplateResponse>(this.baseUrl, { params });
  }

  create(payload: CreateUplataCommand): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(this.baseUrl, payload);
  }

}
