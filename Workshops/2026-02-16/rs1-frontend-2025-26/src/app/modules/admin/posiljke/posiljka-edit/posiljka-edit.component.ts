import {Component, inject, OnInit} from '@angular/core';
import {OrderShipmentsFormService} from '../services/order-shipments-form.service';
import {BaseFormComponent} from '../../../../core/components/base-classes/base-form-component';
import {GetOrderShipmentsByIdQueryDto} from '../../../../api-services/order-shipments/order-shipments-api.model';
import {ActivatedRoute, Router} from '@angular/router';
import {ToasterService} from '../../../../core/services/toaster.service';
import {OrderShipmentsApiService} from '../../../../api-services/order-shipments/order-shipments-api.service';
import {OrdersApiService} from '../../../../api-services/orders/orders-api.service';
import {ListOrdersQueryDto} from '../../../../api-services/orders/orders-api.models';
import {forkJoin} from 'rxjs';
import {largePaging} from '../../../../core/models/paging/paging-utils';

@Component({
  selector: 'app-posiljka-edit',
  standalone: false,
  templateUrl: './posiljka-edit.component.html',
  styleUrl: './posiljka-edit.component.scss',
  providers: [OrderShipmentsFormService]
})
export class PosiljkaEditComponent
  extends BaseFormComponent<GetOrderShipmentsByIdQueryDto>
  implements OnInit {

  private api = inject(OrderShipmentsApiService);
  private ordersApi = inject(OrdersApiService);
  private formService = inject(OrderShipmentsFormService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  orderShipmentId!: number;
  orders: ListOrdersQueryDto[] = [];


  ngOnInit(): void {
    this.orderShipmentId = +this.route.snapshot.params['id']; // 6
    this.initForm(true); // Edit mode
  }

  protected loadData(): void {
    this.startLoading();

    // Load product and categories in parallel
    forkJoin({
      orderShipment: this.api.getById(this.orderShipmentId),
      orders: this.ordersApi.list({ paging: largePaging })
    }).subscribe({
      next: ({ orderShipment, orders }) => {
        this.model = orderShipment;
        this.orders = orders.items;
        this.form = this.formService.updateOrderShipmentsForm(orderShipment);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load orderShipment');
        this.toaster.error('Order Shipment not found');
        console.error('Load Order Shipment error:', err);
        this.router.navigate(['/admin/posiljke']);
      }
    });
  }

  protected save(): void {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.startLoading();

    const payload = this.form.getRawValue();

    this.api.update(this.orderShipmentId, payload).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Order Shipment updated successfully');
        this.router.navigate(['/admin/posiljke']);
      },
      error: (err) => {
        this.stopLoading('Failed to update order shipment');
        console.error('Update order shipment error:', err);
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/posiljke']);
  }

  getErrorMessage(controlName: string): string {
    return this.formService.getErrorMessage(this.form, controlName);
  }


}
