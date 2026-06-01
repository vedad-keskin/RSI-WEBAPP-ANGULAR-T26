import {Component, inject, OnInit} from '@angular/core';
import {BaseFormComponent} from '../../../../core/components/base-classes/base-form-component';
import {
  CreateOrderShipmentsCommand,
  GetOrderShipmentsByIdQueryDto
} from '../../../../api-services/order-shipments/order-shipments-api.model';
import {ProductsApiService} from '../../../../api-services/products/products-api.service';
import {ProductCategoriesApiService} from '../../../../api-services/product-categories/product-categories-api.service';
import {ProductFormService} from '../../catalogs/products/services/product-form.service';
import {Router} from '@angular/router';
import {ToasterService} from '../../../../core/services/toaster.service';
import {OrderShipmentsApiService} from '../../../../api-services/order-shipments/order-shipments-api.service';
import {OrdersApiService} from '../../../../api-services/orders/orders-api.service';
import {OrderShipmentsFormService} from '../services/order-shipments-form.service';
import {ListProductCategoriesQueryDto} from '../../../../api-services/product-categories/product-categories-api.model';
import {ListOrdersQueryDto} from '../../../../api-services/orders/orders-api.models';
import {largePaging} from '../../../../core/models/paging/paging-utils';
import {CreateProductCommand} from '../../../../api-services/products/products-api.models';

@Component({
  selector: 'app-posiljka-add',
  standalone: false,
  templateUrl: './posiljka-add.component.html',
  styleUrl: './posiljka-add.component.scss',
  providers: [OrderShipmentsFormService]
})
export class PosiljkaAddComponent
  extends BaseFormComponent<GetOrderShipmentsByIdQueryDto>
  implements OnInit
  {

    private api = inject(OrderShipmentsApiService);
    private ordersApi = inject(OrdersApiService);
    private formService = inject(OrderShipmentsFormService);
    private router = inject(Router);
    private toaster = inject(ToasterService);

    orders: ListOrdersQueryDto[] = [];

    ngOnInit(): void {
      this.initForm(false); // Add mode
      this.loadOrders();
    }

    protected loadData(): void {
      // Not needed in add mode
    }

    private loadOrders(): void {
      this.ordersApi.list({ paging: largePaging }).subscribe({
        next: (response) => {
          this.orders = response.items;
        },
        error: (err) => {
          this.toaster.error('Failed to load orders');
          console.error('Load orders error:', err);
        }
      });
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
      this.form = this.formService.createOrderShipmentsForm();
    }

    onCancel(): void {
      this.router.navigate(['/admin/posiljke']);
    }

    getErrorMessage(controlName: string): string {
      return this.formService.getErrorMessage(this.form, controlName);
    }

}
