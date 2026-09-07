import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../../../core/components/base-classes/base-component';
import { CreateInventoryCountCommand } from '../../../../../api-services/inventory-counts/inventory-counts-api.models';
import { InventoryCountsApiService } from '../../../../../api-services/inventory-counts/inventory-counts-api.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { getErrorMessage } from '../../../../../core/interceptors/error-logging-interceptor.service';
import { ExamProductsApiService } from '../../../../../api-services/exam-products/exam-products-api.service';
import { ExamProductLookupItem } from '../../../../../api-services/exam-products/exam-products-api.models';

@Component({
  selector: 'app-inventory-count-add',
  standalone: false,
  templateUrl: './inventory-count-add.component.html',
  styleUrl: './inventory-count-add.component.scss'
})
export class InventoryCountAddComponent extends BaseComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly api = inject(InventoryCountsApiService);
  private readonly toaster = inject(ToasterService);
  private readonly productsApi = inject(ExamProductsApiService);

  products: ExamProductLookupItem[] = [];

  readonly form = this.fb.group({
    countNumber: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.pattern(/^INV-/),
    ]],
    note: ['', [Validators.maxLength(500)]],
    items: this.fb.array<FormGroup>([]),
  });

  constructor() {
    super();
    this.addItem();
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  get items(): FormArray<FormGroup> {
    return this.form.controls.items;
  }

  private loadProducts(): void {
    this.startLoading();

    this.productsApi.lookup().subscribe({
      next: (response) => {
        this.products = response;
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load products');
        console.error('Load products error:', err);
      }
    });
  }

  addItem(): void {
    this.items.push(this.fb.group({
      productId: [null as number | null, [Validators.required, Validators.min(1)]],
      countedQuantity: [null as number | null, [Validators.required, Validators.min(0), Validators.max(100000)]],
    }));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onProductChange(item: FormGroup): void {
    item.get('countedQuantity')?.setValue(null);
  }

  getProduct(productId: number | null): ExamProductLookupItem | undefined {
    return this.products.find(p => p.id === productId);
  }

  getDifference(item: FormGroup): number | null {
    const product = this.getProduct(item.value.productId);
    const counted = item.value.countedQuantity;
    if (!product || counted === null || counted === undefined) return null;
    return counted - product.stockQuantity;
  }

  getDifferenceValue(item: FormGroup): number | null {
    const product = this.getProduct(item.value.productId);
    const difference = this.getDifference(item);
    if (!product || difference === null) return null;
    return Math.round(difference * product.price * 100) / 100;
  }

  get totalDifferenceValue(): number | null {
    const values = this.items.controls.map(c => this.getDifferenceValue(c));
    if (values.some(v => v === null)) return null;
    return values.reduce((sum, v) => sum + (v ?? 0), 0);
  }

  hasDuplicateProducts(): boolean {
    const ids = this.items.controls
      .map(c => c.value.productId)
      .filter((id: number | null) => id != null);
    return ids.length !== new Set(ids).size;
  }

  needsNote(): boolean {
    return this.items.controls.some(c => {
      const difference = this.getDifference(c);
      return difference !== null && difference < 0;
    });
  }

  get canSave(): boolean {
    if (this.form.invalid || this.isLoading) return false;
    if (this.items.length === 0) return false;
    if (this.hasDuplicateProducts()) return false;
    if (this.needsNote() && !this.form.value.note?.trim()) return false;
    return true;
  }

  cancel(): void {
    this.router.navigate(['/admin/inventory-counts']);
  }

  save(): void {
    if (!this.canSave) return;

    this.startLoading();

    const payload: CreateInventoryCountCommand = {
      countNumber: this.form.value.countNumber?.trim() ?? '',
      note: this.form.value.note?.trim() || null,
      items: this.items.controls.map(c => ({
        productId: c.value.productId ?? 0,
        countedQuantity: c.value.countedQuantity ?? 0,
      })),
    };

    this.api.create(payload).subscribe({
      next: () => {
        this.stopLoading();
        this.router.navigate(['/admin/inventory-counts']);
        this.toaster.success('Inventura je uspješno dodana');
      },
      error: (err) => {
        this.toaster.error(getErrorMessage(err) || 'Neuspješno dodavanje');
        this.stopLoading('Something went wrong. Please try again.');
        console.error('Add error:', err);
      },
    });
  }
}
