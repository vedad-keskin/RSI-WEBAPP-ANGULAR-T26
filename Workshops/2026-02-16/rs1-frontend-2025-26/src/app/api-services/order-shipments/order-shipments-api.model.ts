import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import { PageResult } from '../../core/models/paging/page-result';

// === QUERIES (READ) ===

/**
 * Query parameters for GET /ProductCategories
 * Corresponds to: ListProductCategoriesQuery.cs
 */
export class ListOrderShipmentsRequest extends BasePagedQuery {
  orderId?: number | null;
}

/**
 * Response item for GET /ProductCategories
 * Corresponds to: ListProductCategoriesQueryDto.cs
 */
export interface ListOrderShipmentsQueryDto {
  id: number;
  shipmentNumber: string;
  referenceNumber: string;
  status: OrderShipmentStatusType;
  shippingCost: number;
  shippedAtUtc: string; // ISO date string
  deliveredAtUtc: string | null; // ISO date string
}

export enum OrderShipmentStatusType {
  /** Order is created but not yet confirmed */
  Kreirana = 1,
  /** Order is confirmed and awaiting payment */
  USkladistu = 2,
  /** Payment received and order is being processed */
  UDostavi = 3,
  /** Order has been shipped or delivered */
  Dostavljena = 4,
  /** Order has been cancelled */
  Otkazana = 5,
}

export type ListOrderShipmentsResponse = PageResult<ListOrderShipmentsQueryDto>;

/**
 * Response for GET /ProductCategories/{id}
 * Corresponds to: GetProductCategoryByIdQueryDto.cs
 */
export interface GetOrderShipmentsByIdQueryDto {
  id: number;
  shipmentNumber: string;
  status: OrderShipmentStatusType;
  shippingCost: number;
  shippedAtUtc: string; // ISO date string
  deliveredAtUtc: string | null; // ISO date string
  orderId: number;
}

/**
 * Paged response for GET /ProductCategories
 */

// === COMMANDS (WRITE) ===

/**
 * Command for POST /ProductCategories
 * Corresponds to: CreateProductCategoryCommand.cs
 */
export interface CreateOrderShipmentsCommand {
  shipmentNumber: string;
  orderId: number;
  shippingCost: number;
}
//
// /**
//  * Command for PUT /ProductCategories/{id}
//  * Corresponds to: UpdateProductCategoryCommand.cs
//  */
export interface UpdateOrderShipmentsCommand {
  shipmentNumber: string;
  orderId: number;
  shippingCost: number;
  status: OrderShipmentStatusType;
}
