import {BasePagedQuery} from '../../core/models/paging/base-paged-query';
import {OrderStatusType} from '../orders/orders-api.models';
import {PageResult} from '../../core/models/paging/page-result';
import {ListProductsQueryDto} from '../products/products-api.models';

export enum ProductOfferStateType {
  Aktivna = 1,
  Istekla = 2,
  Iskljucena = 3,
}

export const PRODUCT_OFFER_STATE_LABELS: Record<ProductOfferStateType, string> = {
  [ProductOfferStateType.Aktivna]: 'Aktivna',
  [ProductOfferStateType.Istekla]: 'Istekla',
  [ProductOfferStateType.Iskljucena]: 'Iskljucena',
};


export class ListProductOffersRequest extends BasePagedQuery {
  productId?: number | null;
  onlyActive?: boolean | null;
  // Future filters: categoryId?, isEnabled?, priceMin?, priceMax?
}

export interface ListProductOffersQueryDto {
  id: number;
  code: string;
  productName: string;
  productPrice: number;
  discountPercent: number;
  discountPrice: number;
  validUntilUtc: string;
  isEnabled: boolean;
  status: ProductOfferStateType;
  statusLabel: string;
}

export type ListProductOffersResponse = PageResult<ListProductOffersQueryDto>;

// === COMMANDS (WRITE) ===

export interface CreateProductOfferCommand {
  code: string;
  productId: number;
  discountPercent: number;
  validUntilUtc: string;
}
