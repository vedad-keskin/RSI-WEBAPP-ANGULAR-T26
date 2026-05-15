import { Component, inject, OnInit } from '@angular/core';
import {BaseListPagedComponent} from '../../../core/components/base-classes/base-list-paged-component';
import {
  ListOrderShipmentsDto,
  ListOrderShipmentsRequest, OrderShipmentStatusType
} from '../../../api-services/order-shipments/order-shipments-api.models';
import {MatDialog} from '@angular/material/dialog';
import {ToasterService} from '../../../core/services/toaster.service';
import {Router} from '@angular/router';
import {OrdersShipmentApiService} from '../../../api-services/order-shipments/order-shipments-api.service';
import {OrderShipmentsStatusHelper} from '../../../api-services/order-shipments/order-shipments-status.helper';


@Component({
  selector: 'app-posiljke',
  standalone: false,
  templateUrl: './posiljke.component.html',
  styleUrl: './posiljke.component.scss'
})
export class PosiljkeComponent
  extends BaseListPagedComponent<ListOrderShipmentsDto, ListOrderShipmentsRequest>
  implements OnInit {

  protected readonly OrderShipmentsStatusHelper = OrderShipmentsStatusHelper;


  private api = inject(OrdersShipmentApiService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToasterService);
  private router = inject(Router);

  constructor() {
    super();
    this.request = new ListOrderShipmentsRequest();
  }

  protected override loadPagedData(): void {

    this.startLoading();

    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load shipments');
        console.error('Load shipments error:', err);
      },
    });


  }

  // hardkodirano - obrisati ovo
  // items = [
  //   { id: 1, shipmentNumber: 'SHP-00001', orderReferenceNumber: 'ORD-0001', status: 4, statusNaziv: 'Dostavljena', shippingCost: 12.50, shippedAtUtc: '02.02.2026', deliveredAtUtc: '04.02.2026' },
  //   { id: 2, shipmentNumber: 'SHP-00002', orderReferenceNumber: 'ORD-0002', status: 3, statusNaziv: 'U dostavi',   shippingCost: 8.00,  shippedAtUtc: '07.02.2026', deliveredAtUtc: null },
  //   { id: 3, shipmentNumber: 'SHP-00003', orderReferenceNumber: 'ORD-0003', status: 1, statusNaziv: 'Kreirana',    shippingCost: 15.00, shippedAtUtc: '12.02.2026', deliveredAtUtc: null },
  //   { id: 4, shipmentNumber: 'SHP-00004', orderReferenceNumber: 'ORD-0004', status: 2, statusNaziv: 'U skladištu', shippingCost: 10.00, shippedAtUtc: '15.02.2026', deliveredAtUtc: null },
  //   { id: 5, shipmentNumber: 'SHP-00005', orderReferenceNumber: 'ORD-0005', status: 5, statusNaziv: 'Otkazana',    shippingCost: 9.50,  shippedAtUtc: '10.02.2026', deliveredAtUtc: null },
  //   { id: 6, shipmentNumber: 'SHP-00006', orderReferenceNumber: 'ORD-0001', status: 4, statusNaziv: 'Dostavljena', shippingCost: 20.00, shippedAtUtc: '03.02.2026', deliveredAtUtc: '05.02.2026' },
  // ];

  displayedColumns: string[] = [
    'shipmentNumber',
    'orderReferenceNumber',
    'status',
    'shippingCost',
    'shippedAtUtc',
    'deliveredAtUtc',
    'actions'
  ];

  ngOnInit(): void {
    this.initList();
  }



  onCreate(): void {
  }

}
