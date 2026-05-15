import { PageResult } from '../../core/models/paging/page-result';
import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import {ListProductCategoriesQueryDto} from '../product-categories/product-categories-api.model';
import {OrderStatusType} from '../orders/orders-api.models';

// === ENUMS ===

/**
 * Order status enum
 * Corresponds to: OrderStatusType.cs
 */
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





// === QUERIES (READ) ===

/**
 * Query parameters for GET /Orders
 * Corresponds to: ListOrdersQuery.cs
 */
export class ListOrderShipmentsRequest extends BasePagedQuery {
  orderId?: number | null;


  constructor() {
    super();
  }
}


export interface ListOrderShipmentsDto {
  id: number;
  shipmentNumber: string ;
  status: OrderShipmentStatusType;
  shippingCost: number;
  referenceNumber: string;
  shippedAtUtc: string ; // ISO date string
  deliveredAtUtc: string | null;
}

export type ListOrderShipmentsResponse = PageResult<ListOrderShipmentsDto>;


// /**
//  * Product info in order items
//  */
// export interface ListOrdersWithItemsQueryDtoItemProduct {
//   id: number;
//   name: string | null;
//   price: number;
// }
//
// /**
//  * Order item in list with items
//  */
// export interface ListOrdersWithItemsQueryDtoItem {
//   id: number;
//   product: ListOrdersWithItemsQueryDtoItemProduct;
//   quantity: number;
//   unitPrice: number;
//   discountPercent: number;
//   discountAmount: number;
//   subtotal: number;
//   total: number;
// }
//
// /**
//  * User info in list with items response
//  */
// export interface ListOrdersWithItemsQueryDtoUser {
//   userFirstname: string | null;
//   userLastname: string | null;
//   userAddress: string | null;
//   userCity: string | null;
// }
//
// /**
//  * Response item for GET /Orders/with-items
//  * Corresponds to: ListOrdersWithItemsQueryDto.cs
//  */
// export interface ListOrdersWithItemsQueryDto {
//   id: number;
//   referenceNumber: string | null;
//   user: ListOrdersWithItemsQueryDtoUser;
//   orderedAtUtc: string; // ISO date string
//   paidAtUtc: string | null; // ISO date string
//   status: OrderStatusType;
//   totalAmount: number;
//   note: string | null;
//   items: ListOrdersWithItemsQueryDtoItem[];
// }
//
// /**
//  * User info in GetById response
//  */
// export interface GetByIdOrderQueryDtoUser {
//   userFirstname: string | null;
//   userLastname: string | null;
//   userAddress: string | null;
//   userCity: string | null;
// }
//
// /**
//  * Product info in GetById order item
//  */
// export interface GetByIdOrderQueryDtoItemProduct {
//   productId: number;
//   productName: string | null;
//   productCategoryName: string | null;
// }
//
// /**
//  * Order item in GetById response
//  */
// export interface GetByIdOrderQueryDtoItem {
//   id: number;
//   product: GetByIdOrderQueryDtoItemProduct;
//   quantity: number;
//   unitPrice: number;
//   discountPercent: number;
//   discountAmount: number;
//   subtotal: number;
//   total: number;
// }
//
// /**
//  * Response for GET /Orders/{id}
//  * Corresponds to: GetOrderByIdQueryDto.cs
//  */
// export interface GetOrderByIdQueryDto {
//   id: number;
//   referenceNumber: string | null;
//   user: GetByIdOrderQueryDtoUser;
//   orderedAtUtc: string; // ISO date string
//   paidAtUtc: string | null; // ISO date string
//   status: OrderStatusType;
//   totalAmount: number;
//   note: string | null;
//   items: GetByIdOrderQueryDtoItem[];
// }
//
// /**
//  * Paged response for GET /Orders
//  */
// export type ListOrdersResponse = PageResult<ListOrdersQueryDto>;
//
// /**
//  * Paged response for GET /Orders/with-items
//  */
// export type ListOrdersWithItemsResponse = PageResult<ListOrdersWithItemsQueryDto>;
//
// // === COMMANDS (WRITE) ===
//
// /**
//  * Order item for create command
//  */
// export interface CreateOrderCommandItem {
//   productId: number;
//   quantity: number;
// }
//
// /**
//  * Command for POST /Orders
//  * Corresponds to: CreateOrderCommand.cs
//  */
// export interface CreateOrderCommand {
//   note?: string | null;
//   items?: CreateOrderCommandItem[];
// }
//
// /**
//  * Order item for update command
//  */
// export interface UpdateOrderCommandItem {
//   id?: number; // Optional - if present, updates existing item
//   productId: number;
//   quantity: number;
// }
//
// /**
//  * Command for PUT /Orders/{id}
//  * Corresponds to: UpdateOrderCommand.cs
//  */
// export interface UpdateOrderCommand {
//   note?: string | null;
//   items?: UpdateOrderCommandItem[];
// }
