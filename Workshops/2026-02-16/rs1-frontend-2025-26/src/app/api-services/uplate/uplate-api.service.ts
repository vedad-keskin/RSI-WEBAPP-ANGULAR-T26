import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {ListUplateQuery, ListUplateResponse} from './uplate-api.models';
import {ListOrderShipmentsRequest, ListOrderShipmentsResponse} from '../order-shipments/order-shipments-api.model';
import {buildHttpParams} from '../../core/models/build-http-params';

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
  // list(pageNumber: number = 1, pageSize: number = 10): Observable<ListUplateResponse> {
  //   const params = new HttpParams()
  //     .set('Paging.PageNumber', pageNumber.toString())
  //     .set('Paging.PageSize', pageSize.toString());
  //
  //   return this.http.get<ListUplateResponse>(this.baseUrl, { params });
  // }

  list(request?: ListUplateQuery): Observable<ListUplateResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListUplateResponse>(this.baseUrl, {
      params,
    });
  }


}
