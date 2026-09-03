import { BasePagedQuery } from '../../core/models/paging/base-paged-query';
import { PageResult } from '../../core/models/paging/page-result';

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
  onlyActive?: boolean;
}

export interface ListProductOffersQueryDto {
  id: number;
  code: string;
  productName: string;
  productPrice: number;
  discountPercent: number;
  discountedPrice: number;
  validUntilUtc: string;
  state: ProductOfferStateType;
  stateLabel: string;
  isEnabled: boolean;
}

export type ListProductOffersResponse = PageResult<ListProductOffersQueryDto>;
