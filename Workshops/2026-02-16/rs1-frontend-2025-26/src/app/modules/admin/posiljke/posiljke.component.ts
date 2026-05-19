import { Component, inject, OnInit } from '@angular/core';
import {BaseListPagedComponent} from '../../../core/components/base-classes/base-list-paged-component';
import {
  ListOrderShipmentsQueryDto,
  ListOrderShipmentsRequest
} from '../../../api-services/order-shipments/order-shipments-api.model';
import {MatDialog} from '@angular/material/dialog';
import {ToasterService} from '../../../core/services/toaster.service';
import {DialogHelperService} from '../../shared/services/dialog-helper.service';
import {OrderShipmentsApiService} from '../../../api-services/order-shipments/order-shipments-api.service';
import {OrderShipmentStatusHelper} from '../../../api-services/order-shipments/order-shipments-status.helper';
import {ListOrdersQueryDto, ListOrdersRequest} from '../../../api-services/orders/orders-api.models';
import {OrdersApiService} from '../../../api-services/orders/orders-api.service';

@Component({
  selector: 'app-posiljke',
  standalone: false,
  templateUrl: './posiljke.component.html',
  styleUrl: './posiljke.component.scss'
})
export class PosiljkeComponent
  extends BaseListPagedComponent<ListOrderShipmentsQueryDto, ListOrderShipmentsRequest>
  implements OnInit {

  protected readonly OrderShipmentStatusHelper = OrderShipmentStatusHelper;

  private api = inject(OrderShipmentsApiService);
  private ordersApi = inject(OrdersApiService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);

  // Order filter (null = sve narudžbe)
  orderFilter: number | null = null;
  narudzbe: ListOrdersQueryDto[] = [];

  constructor() {
    super();
    this.request = new ListOrderShipmentsRequest();
  }

  ngOnInit(): void {
    this.loadOrdersForFilter();
    this.initList();
  }

  private loadOrdersForFilter(): void {
    const ordersRequest = new ListOrdersRequest();
    ordersRequest.paging.page = 1;
    ordersRequest.paging.pageSize = 500;

    this.ordersApi.list(ordersRequest).subscribe({
      next: (response) => {
        this.narudzbe = response.items;
      },
      error: (err) => {
        console.error('Load orders for filter error:', err);
      },
    });
  }

  protected override loadPagedData(): void {

    this.startLoading();

    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load order shipments');
        console.error('Load order shipments error:', err);
      },
    });

  }

  // === Filters ===

  onOrderFilterChange(orderId: number | null): void {
    this.orderFilter = orderId;
    this.request.orderId = orderId;
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  displayedColumns: string[] = [
    'shipmentNumber',
    'orderReferenceNumber',
    'status',
    'shippingCost',
    'shippedAtUtc',
    'deliveredAtUtc',
    'actions'
  ];

  onCreate(): void {
  }

}
