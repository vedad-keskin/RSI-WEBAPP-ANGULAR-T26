import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../../core/models/build-http-params';
import {
  ListProductOffersRequest,
  ListProductOffersResponse,
} from './product-offers-api.models';

@Injectable({
  providedIn: 'root'
})
export class ProductOffersApiService {
  private readonly baseUrl = `${environment.apiUrl}/ProductOffers`;
  private http = inject(HttpClient);

  list(request?: ListProductOffersRequest): Observable<ListProductOffersResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;
    return this.http.get<ListProductOffersResponse>(this.baseUrl, { params });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
