import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../../core/models/build-http-params';
import {
  CreateOrderShipmentsCommand,
  GetOrderShipmentsByIdQueryDto,
  ListOrderShipmentsRequest,
  ListOrderShipmentsResponse,
} from './order-shipments-api.model';

@Injectable({
  providedIn: 'root',
})
export class OrderShipmentsApiService {

  // http://localhost:7001/OrdersShipment
  private readonly baseUrl = `${environment.apiUrl}/OrderShipments`;
  private http = inject(HttpClient);

  /**
   * GET /ProductCategories
   * List categories with optional query parameters.
   */
  list(request?: ListOrderShipmentsRequest): Observable<ListOrderShipmentsResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListOrderShipmentsResponse>(this.baseUrl, {
      params,
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * GET /ProductCategories/{id}
   * Get a single category by ID.
   */
  getById(id: number): Observable<GetOrderShipmentsByIdQueryDto> {
    return this.http.get<GetOrderShipmentsByIdQueryDto>(`${this.baseUrl}/${id}`);
  }
  //
  // /**
  //  * POST /ProductCategories
  //  * Create a new category.
  //  * @returns ID of the newly created category
  //  */
  create(payload: CreateOrderShipmentsCommand): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }
  //
  // /**
  //  * PUT /ProductCategories/{id}
  //  * Update an existing category.
  //  */
  // update(id: number, payload: ProductCategoriesCommand): Observable<void> {
  //   return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  // }
  //
  // /**
  //  * DELETE /ProductCategories/{id}
  //  * Delete a category.
  //  */
  // delete(id: number): Observable<void> {
  //   return this.http.delete<void>(`${this.baseUrl}/${id}`);
  // }
  //
  // /**
  //  * PUT /ProductCategories/{id}/disable
  //  * Disable a category.
  //  */
  // disable(id: number): Observable<void> {
  //   return this.http.put<void>(`${this.baseUrl}/${id}/disable`, {});
  // }
  //
  // /**
  //  * PUT /ProductCategories/{id}/enable
  //  * Enable a category.
  //  */
  // enable(id: number): Observable<void> {
  //   return this.http.put<void>(`${this.baseUrl}/${id}/enable`, {});
  // }
}
