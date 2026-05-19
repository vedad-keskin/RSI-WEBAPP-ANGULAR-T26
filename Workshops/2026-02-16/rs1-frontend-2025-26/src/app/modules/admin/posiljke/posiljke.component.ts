import { Component, inject, OnInit } from '@angular/core';
import {BaseListPagedComponent} from '../../../core/components/base-classes/base-list-paged-component';
import {
  ListProductCategoriesQueryDto,
  ListProductCategoriesRequest
} from '../../../api-services/product-categories/product-categories-api.model';
import {
  ListOrderShipmentsQueryDto,
  ListOrderShipmentsRequest
} from '../../../api-services/order-shipments/order-shipments-api.model';
import {ProductCategoriesApiService} from '../../../api-services/product-categories/product-categories-api.service';
import {MatDialog} from '@angular/material/dialog';
import {ToasterService} from '../../../core/services/toaster.service';
import {DialogHelperService} from '../../shared/services/dialog-helper.service';
import {OrderShipmentsApiService} from '../../../api-services/order-shipments/order-shipments-api.service';
import {OrderShipmentStatusHelper} from '../../../api-services/order-shipments/order-shipments-status.helper';
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

  orderOptions:any;
  orderFilter: number | null = null;

  constructor() {
    super();
    this.request = new ListOrderShipmentsRequest();
  }


  ngOnInit(): void {
    this.loadOrdersForFiltering();
    this.initList();
  }

  private loadOrdersForFiltering() {

    this.startLoading();

    this.ordersApi.list().subscribe({
      next: (response) => {

        this.orderOptions = response.items;

        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load order shipments');
        console.error('Load order shipments error:', err);
      },
    });

  }

  onOrderFilterChange(orderId: any) {

    this.orderFilter = orderId;
    this.request.orderId = orderId;
    this.paging.page = 1;
    this.loadPagedData();
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
