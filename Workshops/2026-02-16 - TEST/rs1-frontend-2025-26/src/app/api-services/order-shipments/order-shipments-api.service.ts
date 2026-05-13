import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateOrderShipmentCommand,
  GetOrderShipmentByIdQueryDto,
  ListOrderShipmentsRequest,
  ListOrderShipmentsResponse,
  UpdateOrderShipmentCommand
} from './order-shipments-api.models';
import { buildHttpParams } from '../../core/models/build-http-params';

@Injectable({
  providedIn: 'root'
})
export class OrderShipmentsApiService {
  private readonly baseUrl = `${environment.apiUrl}/OrderShipments`;
  private http = inject(HttpClient);

  list(request?: ListOrderShipmentsRequest): Observable<ListOrderShipmentsResponse> {
    const params = request ? buildHttpParams(request as any) : undefined;
    return this.http.get<ListOrderShipmentsResponse>(this.baseUrl, { params });
  }

  getById(id: number): Observable<GetOrderShipmentByIdQueryDto> {
    return this.http.get<GetOrderShipmentByIdQueryDto>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateOrderShipmentCommand): Observable<number> {
    return this.http.post<number>(this.baseUrl, payload);
  }

  update(id: number, payload: UpdateOrderShipmentCommand): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
