import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseFormComponent } from '../../../../core/components/base-classes/base-form-component';
import { ToasterService } from '../../../../core/services/toaster.service';
import { OrderShipmentsApiService } from '../../../../api-services/order-shipments/order-shipments-api.service';
import {
  OrderShipmentStatusType,
  UpdateOrderShipmentCommand
} from '../../../../api-services/order-shipments/order-shipments-api.models';
import { orderShipmentStatusOptions } from '../../../../api-services/order-shipments/order-shipment-status.helper';
import { OrdersApiService } from '../../../../api-services/orders/orders-api.service';
import { ListOrdersQueryDto } from '../../../../api-services/orders/orders-api.models';
import { allItemsPaging } from '../../../../core/models/paging/paging-utils';

@Component({
  selector: 'app-posiljka-edit',
  standalone: false,
  templateUrl: './posiljka-edit.component.html',
  styleUrl: './posiljka-edit.component.scss'
})
export class PosiljkaEditComponent extends BaseFormComponent<void> implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(OrderShipmentsApiService);
  private ordersApi = inject(OrdersApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  shipmentId!: number;
  orders: ListOrdersQueryDto[] = [];
  statusOptions = orderShipmentStatusOptions;

  ngOnInit(): void {
    this.shipmentId = +this.route.snapshot.params['id'];
    this.initForm(true);
  }

  protected loadData(): void {
    this.startLoading();
    forkJoin({
      shipment: this.api.getById(this.shipmentId),
      orders: this.ordersApi.list({ paging: allItemsPaging })
    }).subscribe({
      next: ({ shipment, orders }) => {
        this.orders = orders.items;
        this.form = this.fb.group({
          shipmentNumber: [shipment.shipmentNumber, [Validators.required, Validators.maxLength(20)]],
          orderId: [shipment.orderId, Validators.required],
          status: [shipment.status, Validators.required],
          shippingCost: [shipment.shippingCost, [Validators.required, Validators.min(0)]],
          shippedAt: [this.toDatetimeLocalValue(shipment.shippedAtUtc), Validators.required],
          deliveredAt: [shipment.deliveredAtUtc ? this.toDatetimeLocalValue(shipment.deliveredAtUtc) : '']
        });
        this.stopLoading();
      },
      error: () => {
        this.stopLoading('Greška');
        this.toaster.error('Pošiljka nije pronađena.');
        this.router.navigate(['/admin/posiljke']);
      }
    });
  }

  protected override initForm(isEdit: boolean): void {
    this.form = this.fb.group({});
    super.initForm(isEdit);
  }

  protected save(): void {
    if (this.form.invalid || this.isLoading) return;
    this.startLoading();
    const v = this.form.getRawValue();
    const cmd: UpdateOrderShipmentCommand = {
      shipmentNumber: v.shipmentNumber,
      orderId: v.orderId,
      status: v.status as OrderShipmentStatusType,
      shippingCost: Number(v.shippingCost),
      shippedAtUtc: this.fromDatetimeLocalValue(v.shippedAt),
      deliveredAtUtc: v.deliveredAt ? this.fromDatetimeLocalValue(v.deliveredAt) : null
    };
    this.api.update(this.shipmentId, cmd).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Pošiljka ažurirana.');
        this.router.navigate(['/admin/posiljke']);
      },
      error: () => {
        this.stopLoading('Greška');
        this.toaster.error('Ažuriranje nije uspjelo.');
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/posiljke']);
  }

  getErrorMessage(controlName: string): string {
    const c = this.form.get(controlName);
    if (!c || !c.errors || !c.touched) return '';
    if (c.errors['required']) return 'Obavezno polje';
    if (c.errors['maxlength']) return 'Predugačko';
    if (c.errors['min']) return 'Vrijednost je premala';
    return 'Neispravno';
  }

  private toDatetimeLocalValue(iso: string): string {
    const d = new Date(iso);
    const p = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  private fromDatetimeLocalValue(local: string): string {
    return new Date(local).toISOString();
  }
}
