import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InventoryCountsApiService } from '../../../../../api-services/inventory-counts/inventory-counts-api.service';
import { ExamProductsApiService } from '../../../../../api-services/exam-products/exam-products-api.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { BaseComponent } from '../../../../../core/components/base-classes/base-component';
import { CreateInventoryCountCommand } from '../../../../../api-services/inventory-counts/inventory-counts-api.models';
import { getErrorMessage } from '../../../../../core/interceptors/error-logging-interceptor.service';

@Component({
  selector: 'app-inventory-count-add',
  standalone: false,
  templateUrl: './inventory-count-add.component.html',
  styleUrl: './inventory-count-add.component.scss'
})
export class InventoryCountAddComponent extends BaseComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private toaster = inject(ToasterService);
  private api = inject(InventoryCountsApiService);
  private productsApi = inject(ExamProductsApiService);

  products: any;

  readonly form = this.fb.group({
    countNumber: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.pattern(/^INV-/),
    ]],
    note: ['', [
      Validators.maxLength(500),
    ]],
    items: this.fb.array<FormGroup>([]),
  });

  constructor() {
    super();
    this.addItem();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    this.productsApi.lookup().subscribe({
      next: (response) => {
        this.products = response;
      },
      error: (err) => {
        this.toaster.error('Failed to load products');
        console.error('Load products error:', err);
      }
    });
  }

  get items(): FormArray<FormGroup> {
    return this.form.controls.items;
  }

  addItem(): void {
    this.items.push(
      this.fb.group({
        productId: [null as number | null, [Validators.required, Validators.min(1)]],
        countedQuantity: [null as number | null, [
          Validators.required,
          Validators.min(0),
          Validators.max(100000),
        ]],
      }));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  cancel(): void {
    this.router.navigate(['/admin/inventory-counts']);
  }

  save(): void {
    if (this.form.invalid || this.isLoading) return;

    this.startLoading();

    const command: CreateInventoryCountCommand = {
      countNumber: this.form.value.countNumber?.trim() ?? '',
      note: this.form.value.note?.trim() || null,
      items: this.form.value.items,
    };

    this.api.create(command).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Inventura je uspješno dodana');
        this.router.navigate(['/admin/inventory-counts']);
      },
      error: (err) => {
        this.toaster.error(getErrorMessage(err) || 'Neuspješno dodavanje');
        this.stopLoading();
        console.error('Create inventura error:', err);
      }
    });
  }
}
