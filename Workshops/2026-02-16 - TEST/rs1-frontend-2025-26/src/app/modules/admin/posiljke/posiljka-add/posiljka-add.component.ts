import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../../../core/components/base-classes/base-form-component';
import { ToasterService } from '../../../../core/services/toaster.service';
import { OrderShipmentsApiService } from '../../../../api-services/order-shipments/order-shipments-api.service';
import {
  CreateOrderShipmentCommand,
  OrderShipmentStatusType
} from '../../../../api-services/order-shipments/order-shipments-api.models';
import { OrdersApiService } from '../../../../api-services/orders/orders-api.service';
import { ListOrdersQueryDto } from '../../../../api-services/orders/orders-api.models';
import { allItemsPaging } from '../../../../core/models/paging/paging-utils';

@Component({
  selector: 'app-posiljka-add',
  standalone: false,
  templateUrl: './posiljka-add.component.html',
  styleUrl: './posiljka-add.component.scss'
})
export class PosiljkaAddComponent extends BaseFormComponent<void> implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(OrderShipmentsApiService);
  private ordersApi = inject(OrdersApiService);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  orders: ListOrdersQueryDto[] = [];

  ngOnInit(): void {
    this.initForm(false);
    this.loadOrders();
  }

  protected loadData(): void {}

  protected override initForm(isEdit: boolean): void {
    super.initForm(isEdit);
    const nowLocal = this.toDatetimeLocalValue(new Date().toISOString());
    this.form = this.fb.group({
      shipmentNumber: ['', [Validators.required, Validators.maxLength(20)]],
      orderId: [null as number | null, Validators.required],
      status: [OrderShipmentStatusType.Kreirana, Validators.required],
      shippingCost: [0, [Validators.required, Validators.min(0)]],
      shippedAt: [nowLocal, Validators.required],
      deliveredAt: ['']
    });
  }

  private loadOrders(): void {
    this.ordersApi.list({ paging: allItemsPaging }).subscribe({
      next: (r) => (this.orders = r.items),
      error: () => this.toaster.error('Ne mogu učitati narudžbe.')
    });
  }

  protected save(): void {
    if (this.form.invalid || this.isLoading) return;
    this.startLoading();
    const v = this.form.getRawValue();
    const cmd: CreateOrderShipmentCommand = {
      shipmentNumber: v.shipmentNumber,
      orderId: v.orderId,
      status: v.status,
      shippingCost: Number(v.shippingCost),
      shippedAtUtc: this.fromDatetimeLocalValue(v.shippedAt),
      deliveredAtUtc: v.deliveredAt ? this.fromDatetimeLocalValue(v.deliveredAt) : null
    };
    this.api.create(cmd).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Pošiljka kreirana.');
        this.router.navigate(['/admin/posiljke']);
      },
      error: () => {
        this.stopLoading('Greška');
        this.toaster.error('Kreiranje nije uspjelo.');
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
