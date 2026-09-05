import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../../core/models/build-http-params';
import {
  CreateProductOfferCommand,
  GetProductOfferByIdQueryDto,
  ListProductOffersRequest,
  ListProductOffersResponse,
  UpdateProductOfferCommand
} from './product-offers-api.models';

@Injectable({
  providedIn: 'root'
})
export class ProductOffersApiService {
  private readonly baseUrl = `${environment.apiUrl}/ProductOffers`;
  private http = inject(HttpClient);

  /**
   * GET /Products
   * List products with optional query parameters.
   */
  list(request?: ListProductOffersRequest): Observable<ListProductOffersResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListProductOffersResponse>(this.baseUrl, {
      params,
    });
  }

  /**
   * GET /Products/{id}
   * Get a single product by ID.
   */
  getById(id: number): Observable<GetProductOfferByIdQueryDto> {
    return this.http.get<GetProductOfferByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /ProductOffers
   * Create a new product offer.
   * @returns ID of the newly created offer
   */
  create(payload: CreateProductOfferCommand): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  /**
   * PUT /ProductOffers/{id}
   * Update an existing product offer.
   */
  update(id: number, payload: UpdateProductOfferCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * DELETE /ProductOffers/{id}
   * Delete a product offer.
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
