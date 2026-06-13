import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CreateUplataCommand,
  NacinPlacanjaType
} from '../../../../api-services/uplate/uplate-api.models';
import {
  ListOrdersWithItemsQueryDto,
  ListOrdersWithItemsQueryDtoItem
} from '../../../../api-services/orders/orders-api.models';
import { ToasterService } from '../../../../core/services/toaster.service';
import { OrdersApiService } from '../../../../api-services/orders/orders-api.service';
import { UplateApiService } from '../../../../api-services/uplate/uplate-api.service';
import { largePaging } from '../../../../core/models/paging/paging-utils';

interface NacinPlacanja {
  id: NacinPlacanjaType;
  name: string;
}

@Component({
  selector: 'app-uplata-add',
  standalone: false,
  templateUrl: './uplata-add.component.html',
  styleUrl: './uplata-add.component.scss'
})
export class UplataAddComponent implements OnInit {

  private router = inject(Router);
  private fb = inject(FormBuilder);
  private ordersApi = inject(OrdersApiService);
  private uplateApi = inject(UplateApiService);
  private toaster = inject(ToasterService);

  form: FormGroup;
  isSaving = false;
  isLoading = false;

  narudzbe: ListOrdersWithItemsQueryDto[] = [];
  selectedOrderItems: ListOrdersWithItemsQueryDtoItem[] = [];

  naciniPlacanja: NacinPlacanja[] = [
    { id: NacinPlacanjaType.Kes, name: 'Keš' },
    { id: NacinPlacanjaType.Kartica, name: 'Kartica' }
  ];

  constructor() {
    this.form = this.fb.group({
      brojUplate: ['', Validators.required],
      orderId: ['', Validators.required],
      napomena: [''],
      items: this.fb.array([])
    });

    this.addItem();
    this.addItem();
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.isLoading = true;

    this.ordersApi.listWithItems({ paging: largePaging }).subscribe({
      next: (response) => {
        this.narudzbe = response.items;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toaster.error('Failed to load orders');
        console.error('Load orders error:', err);
      }
    });
  }

  onOrderChange(orderId: number): void {
    const order = this.narudzbe.find(o => o.id === orderId);
    this.selectedOrderItems = order ? order.items : [];
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      productId: ['', Validators.required],
      kolicina: [1, [Validators.required, Validators.min(1)]],
      nacinPlacanja: ['', Validators.required],
    });
    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onCancel(): void {
    this.router.navigate(['/admin/uplate']);
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSaving || this.isLoading) {
      return;
    }

    this.isSaving = true;

    const command: CreateUplataCommand = {
      brojUplate: this.form.value.brojUplate,
      orderId: this.form.value.orderId,
      napomena: this.form.value.napomena || null,
      items: this.form.value.items
    };

    this.uplateApi.create(command).subscribe({
      next: () => {
        this.isSaving = false;
        this.toaster.success('Uplata uspješno kreirana');
        this.router.navigate(['/admin/uplate']);
      },
      error: (err) => {
        this.isSaving = false;
        this.toaster.error('Greška pri kreiranju uplate');
        console.error('Create uplata error:', err);
      }
    });
  }
}
