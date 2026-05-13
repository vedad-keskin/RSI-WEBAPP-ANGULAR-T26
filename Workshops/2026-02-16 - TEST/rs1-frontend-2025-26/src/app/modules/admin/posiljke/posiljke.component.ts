import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ListOrderShipmentsQueryDto,
  ListOrderShipmentsRequest
} from '../../../api-services/order-shipments/order-shipments-api.models';
import { OrderShipmentsApiService } from '../../../api-services/order-shipments/order-shipments-api.service';
import { orderShipmentStatusLabel } from '../../../api-services/order-shipments/order-shipment-status.helper';
import { BaseListPagedComponent } from '../../../core/components/base-classes/base-list-paged-component';
import { ToasterService } from '../../../core/services/toaster.service';
import { DialogHelperService } from '../../shared/services/dialog-helper.service';
import { DialogButton } from '../../shared/models/dialog-config.model';
import { OrdersApiService } from '../../../api-services/orders/orders-api.service';
import { ListOrdersQueryDto } from '../../../api-services/orders/orders-api.models';
import { allItemsPaging } from '../../../core/models/paging/paging-utils';

@Component({
  selector: 'app-posiljke',
  standalone: false,
  templateUrl: './posiljke.component.html',
  styleUrl: './posiljke.component.scss'
})
export class PosiljkeComponent
  extends BaseListPagedComponent<ListOrderShipmentsQueryDto, ListOrderShipmentsRequest>
  implements OnInit
{
  private api = inject(OrderShipmentsApiService);
  private ordersApi = inject(OrdersApiService);
  private router = inject(Router);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);

  orders: ListOrdersQueryDto[] = [];

  displayedColumns: string[] = [
    'shipmentNumber',
    'orderReferenceNumber',
    'status',
    'shippingCost',
    'shippedAtUtc',
    'deliveredAtUtc',
    'actions'
  ];

  constructor() {
    super();
    this.request = new ListOrderShipmentsRequest();
    this.request.paging.pageSize = 10;
  }

  ngOnInit(): void {
    this.loadOrdersForFilter();
    this.initList();
  }

  statusLabel = orderShipmentStatusLabel;

  private loadOrdersForFilter(): void {
    this.ordersApi.list({ paging: allItemsPaging }).subscribe({
      next: (res) => {
        this.orders = res.items;
      },
      error: () => {
        this.toaster.error('Ne mogu učitati narudžbe za filter.');
      }
    });
  }

  protected loadPagedData(): void {
    this.startLoading();
    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: () => {
        this.stopLoading('Greška pri učitavanju pošiljki');
        this.toaster.error('Greška pri učitavanju pošiljki.');
      }
    });
  }

  onOrderFilterChange(): void {
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  onCreate(): void {
    this.router.navigate(['/admin/posiljke/add']);
  }

  onEdit(row: ListOrderShipmentsQueryDto): void {
    this.router.navigate(['/admin/posiljke', row.id, 'edit']);
  }

  onDelete(row: ListOrderShipmentsQueryDto): void {
    this.dialogHelper.confirmDelete(row.shipmentNumber).subscribe((result) => {
      if (result && result.button === DialogButton.DELETE) {
        this.performDelete(row);
      }
    });
  }

  private performDelete(row: ListOrderShipmentsQueryDto): void {
    this.startLoading();
    this.api.delete(row.id).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Pošiljka obrisana.');
        this.loadPagedData();
      },
      error: () => {
        this.stopLoading();
        this.toaster.error('Brisanje nije uspjelo.');
      }
    });
  }
}
