import { PageResult } from '../../core/models/paging/page-result';
import { BasePagedQuery } from '../../core/models/paging/base-paged-query';

export enum OrderShipmentStatusType {
  Kreirana = 1,
  USkladistu = 2,
  UDostavi = 3,
  Dostavljena = 4,
  Otkazana = 5
}

export class ListOrderShipmentsRequest extends BasePagedQuery {
  orderId?: number | null;
}

export interface ListOrderShipmentsQueryDto {
  id: number;
  shipmentNumber: string;
  orderReferenceNumber: string;
  status: OrderShipmentStatusType;
  shippingCost: number;
  shippedAtUtc: string;
  deliveredAtUtc: string | null;
}

export type ListOrderShipmentsResponse = PageResult<ListOrderShipmentsQueryDto>;

export interface GetOrderShipmentByIdQueryDto {
  id: number;
  shipmentNumber: string;
  status: OrderShipmentStatusType;
  shippingCost: number;
  orderId: number;
  shippedAtUtc: string;
  deliveredAtUtc: string | null;
}

export interface CreateOrderShipmentCommand {
  shipmentNumber: string;
  status: OrderShipmentStatusType;
  shippingCost: number;
  orderId: number;
  shippedAtUtc: string;
  deliveredAtUtc?: string | null;
}

export interface UpdateOrderShipmentCommand {
  shipmentNumber: string;
  status: OrderShipmentStatusType;
  shippingCost: number;
  orderId: number;
  shippedAtUtc: string;
  deliveredAtUtc?: string | null;
}
