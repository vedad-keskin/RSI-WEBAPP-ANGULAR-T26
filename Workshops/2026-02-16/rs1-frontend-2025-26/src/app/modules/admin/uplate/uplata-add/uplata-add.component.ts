import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NacinPlacanjaType } from '../../../../api-services/uplate/uplate-api.models';
import {
  ListOrdersWithItemsQueryDto,
  ListOrdersWithItemsQueryDtoItem
} from '../../../../api-services/orders/orders-api.models';
import { OrdersApiService } from '../../../../api-services/orders/orders-api.service';
import { ToasterService } from '../../../../core/services/toaster.service';
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
  private toaster = inject(ToasterService);

  form: FormGroup;
  isSaving = false;
  isLoading = false;

  narudzbe: ListOrdersWithItemsQueryDto[] = [];
  selectedOrderItems: ListOrdersWithItemsQueryDtoItem[] = [];

  nacinPlacanjaOptions: NacinPlacanja[] = [
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

  // copy: posiljka-add.component.ts -> loadOrders()
  private loadOrders(): void {
    this.isLoading = true;

    this.ordersApi.listWithItems({ paging: largePaging }).subscribe({
      next: (response) => {
        this.narudzbe = response.items;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toaster.error('Greška pri učitavanju narudžbi');
        console.error('Load orders error:', err);
      }
    });
  }

  onOrderChange(orderId: number): void {
    const order = this.narudzbe.find(o => o.id === orderId);
    this.selectedOrderItems = order ? order.items : [];

    this.items.controls.forEach(control => {
      control.patchValue({ productId: '' });
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      productId: ['', Validators.required],
      kolicina: [1, [Validators.required, Validators.min(1)]],
      nacinPlacanja: ['', Validators.required]
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
  }
}
