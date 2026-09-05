import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseComponent } from '../../../../../core/components/base-classes/base-component';
import { UpdateProductOfferCommand } from '../../../../../api-services/product-offers/product-offers-api.models';
import { ProductOffersApiService } from '../../../../../api-services/product-offers/product-offers-api.service';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { getErrorMessage } from '../../../../../core/interceptors/error-logging-interceptor.service';
import { ProductsApiService } from '../../../../../api-services/products/products-api.service';

@Component({
  selector: 'app-product-offer-edit',
  standalone: false,
  templateUrl: './product-offer-edit.component.html',
  styleUrl: '../product-offer-add/product-offer-add.component.scss'
})
export class ProductOfferEditComponent extends BaseComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ProductOffersApiService);
  private readonly toaster = inject(ToasterService);
  private readonly productsApi = inject(ProductsApiService);

  private offerId = 0;
  products: any;

  readonly form = this.fb.group({
    code: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.pattern(/^OFF-/),
    ]],
    productId: [null as number | null, [
      Validators.required,
      Validators.min(1),
    ]],
    discountPercent: [null as number | null, [
      Validators.required,
      Validators.min(0.01),
      Validators.max(50),
    ]],
    validUntilUtc: [null as Date | null, [
      Validators.required,
    ]],
    isEnabled: [false],
  });

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.params['id'];
    this.loadProducts();
    this.loadOffer();
  }

  private loadProducts(): void {
    this.startLoading();

    this.productsApi.list().subscribe({
      next: (response) => {
        this.products = response.items;
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load products');
        console.error('Load products error:', err);
      }
    });
  }

  private loadOffer(): void {
    this.startLoading();

    this.api.getById(this.offerId).subscribe({
      next: (dto) => {
        this.form.patchValue({
          code: dto.code,
          productId: dto.productId,
          discountPercent: dto.discountPercent,
          validUntilUtc: new Date(dto.validUntilUtc),
          isEnabled: dto.isEnabled,
        });
        this.stopLoading();
      },
      error: (err) => {
        this.toaster.error(getErrorMessage(err) || 'Neuspješno učitavanje');
        this.stopLoading('Something went wrong. Please try again.');
        console.error('Load offer error:', err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/product-offers']);
  }

  save(): void {
    if (this.form.invalid || this.isLoading) return;

    this.startLoading();

    const payload: UpdateProductOfferCommand = {
      code: this.form.value.code?.trim() ?? '',
      productId: this.form.value.productId ?? 0,
      discountPercent: this.form.value.discountPercent ?? 0,
      validUntilUtc: this.form.value.validUntilUtc ?? new Date(),
      isEnabled: this.form.value.isEnabled ?? false,
    };

    this.api.update(this.offerId, payload).subscribe({
      next: () => {
        this.stopLoading();
        this.router.navigate(['/admin/product-offers']);
        this.toaster.success('Ponuda je uspješno izmijenjena');
      },
      error: (err) => {
        this.toaster.error(getErrorMessage(err) || 'Neuspješna izmjena');
        this.stopLoading('Something went wrong. Please try again.');
        console.error('Update offer error:', err);
      },
    });
  }
}
