import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { buildHttpParams } from '../../core/models/build-http-params';
import {
  ListOrderShipmentsRequest,
  ListOrderShipmentsDto,
  ListOrderShipmentsResponse
} from './order-shipments-api.models';

@Injectable({
  providedIn: 'root'
})
export class OrdersShipmentApiService {
  private readonly baseUrl = `${environment.apiUrl}/OrdersShipment`;
  private http = inject(HttpClient);

  /**
   * GET /Orders
   * List orders with optional query parameters.
   * Returns basic order info without items.
   */
  list(request?: ListOrderShipmentsRequest): Observable<ListOrderShipmentsResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;

    return this.http.get<ListOrderShipmentsResponse>(this.baseUrl, {
      params,
    });
  }



  // /**
  //  * GET /Orders/{id}
  //  * Get a single order by ID with full details including items.
  //  */
  // getById(id: number): Observable<GetOrderByIdQueryDto> {
  //   return this.http.get<GetOrderByIdQueryDto>(`${this.baseUrl}/${id}`);
  // }
  //
  // /**
  //  * POST /Orders
  //  * Create a new order.
  //  * @returns ID of the newly created order
  //  */
  // create(payload: CreateOrderCommand): Observable<number> {
  //   return this.http.post<number>(this.baseUrl, payload);
  // }
  //
  // /**
  //  * PUT /Orders/{id}
  //  * Update an existing order.
  //  * Can update order note and items.
  //  */
  // update(id: number, payload: UpdateOrderCommand): Observable<void> {
  //   return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  // }
  //
  // /**
  //  * PUT /Orders/{id}/change-status
  //  * Change order status.
  //  * Validates status transitions on backend.
  //  */
  // changeStatus(id: number, newStatus: OrderStatusType): Observable<void> {
  //   return this.http.put<void>(`${this.baseUrl}/${id}/change-status`, {
  //     newStatus: newStatus
  //   });
  // }
}
