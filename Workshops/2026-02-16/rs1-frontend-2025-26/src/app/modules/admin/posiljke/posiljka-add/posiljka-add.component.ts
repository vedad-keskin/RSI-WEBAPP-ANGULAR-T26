import {Component, inject, OnInit} from '@angular/core';
import {OrderShipmentsApiService} from '../../../../api-services/order-shipments/order-shipments-api.service';
import {BaseFormComponent} from '../../../../core/components/base-classes/base-form-component';
import {
  CreateOrderShipmentsCommand,
  GetOrderShipmentsByIdQueryDto
} from '../../../../api-services/order-shipments/order-shipments-api.model';
import {Router} from '@angular/router';
import {ToasterService} from '../../../../core/services/toaster.service';
import {OrdersApiService} from '../../../../api-services/orders/orders-api.service';
import {ListOrdersQueryDto} from '../../../../api-services/orders/orders-api.models';
import {OrderShipmentFormService} from '../posiljke-form.service';

@Component({
  selector: 'app-posiljka-add',
  standalone: false,
  templateUrl: './posiljka-add.component.html',
  styleUrl: './posiljka-add.component.scss',
  providers: [OrderShipmentFormService]
})
export class PosiljkaAddComponent
  extends BaseFormComponent<GetOrderShipmentsByIdQueryDto>
  implements OnInit{

  private api = inject(OrderShipmentsApiService);
  private ordersApi = inject(OrdersApiService);
  private formService = inject(OrderShipmentFormService);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  orderOptions: ListOrdersQueryDto[] = [];

  ngOnInit(): void {
    this.initForm(false);
    this.loadOrders();
  }

  private loadOrders(): void {
    this.ordersApi.list().subscribe({
      next: (response) => {
        this.orderOptions = response.items;
      },
      error: (err) => {
        console.error('Load orders error:', err);
      },
    });
  }

  protected loadData(): void {
    // Not needed in add mode
  }

  protected save(): void {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.startLoading();

    const command: CreateOrderShipmentsCommand = {
      shipmentNumber: this.form.value.shipmentNumber,
      shippingCost: this.form.value.shippingCost,
      orderId: this.form.value.orderId,
    };

    this.api.create(command).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Order shipment created successfully');
        this.router.navigate(['/admin/posiljke']);
      },
      error: (err) => {
        this.stopLoading('Failed to create order shipment');
        console.error('Create order shipment error:', err);
      }
    });
  }



  protected override initForm(isEdit: boolean): void {
    super.initForm(isEdit);
    this.form = this.formService.createOrderShipmentForm();
  }

  onCancel(): void {
    this.router.navigate(['/admin/posiljke']);
  }

  getErrorMessage(controlName: string): string {
    return this.formService.getErrorMessage(this.form, controlName);
  }

}
