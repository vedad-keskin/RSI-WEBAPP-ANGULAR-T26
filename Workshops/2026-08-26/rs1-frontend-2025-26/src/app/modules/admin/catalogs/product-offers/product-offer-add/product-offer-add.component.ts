import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseFormComponent } from '../../../../../core/components/base-classes/base-form-component';
import { ProductOffersApiService } from '../../../../../api-services/product-offers/product-offers-api.service';
import { ExamProductsApiService } from '../../../../../api-services/exam-products/exam-products-api.service';
import { ExamProductLookupItem } from '../../../../../api-services/exam-products/exam-products-api.models';
import {
  CreateProductOfferCommand,
  ListProductOffersQueryDto,
} from '../../../../../api-services/product-offers/product-offers-api.models';
import { ToasterService } from '../../../../../core/services/toaster.service';
import { getErrorMessage as getApiErrorMessage } from '../../../../../core/interceptors/error-logging-interceptor.service';
import { ProductOfferFormService } from '../services/product-offer-form.service';

@Component({
  selector: 'app-product-offer-add',
  standalone: false,
  templateUrl: './product-offer-add.component.html',
  styleUrl: './product-offer-add.component.scss',
  providers: [ProductOfferFormService],
})
export class ProductOfferAddComponent
  extends BaseFormComponent<ListProductOffersQueryDto>
  implements OnInit {

  private api = inject(ProductOffersApiService);
  private examProductsApi = inject(ExamProductsApiService);
  private formService = inject(ProductOfferFormService);
  private router = inject(Router);
  private toaster = inject(ToasterService);

  products: ExamProductLookupItem[] = [];

  ngOnInit(): void {
    this.initForm(false);
    this.loadProducts();
  }

  protected loadData(): void {
    // Not needed in add mode
  }

  protected save(): void {
    if (this.form.invalid || this.isLoading) {
      return;
    }

    this.startLoading();

    const raw = this.form.value;
    const command: CreateProductOfferCommand = {
      code: (raw.code ?? '').trim(),
      productId: raw.productId,
      discountPercent: raw.discountPercent,
      validUntilUtc: raw.validUntilUtc,
    };

    this.api.create(command).subscribe({
      next: () => {
        this.stopLoading();
        this.toaster.success('Ponuda uspješno kreirana');
        this.router.navigate(['/admin/product-offers']);
      },
      error: (err) => {
        this.stopLoading();
        this.toaster.error(getApiErrorMessage(err));
        console.error('Create offer error:', err);
      }
    });
  }

  private loadProducts(): void {
    this.examProductsApi.lookup().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        this.toaster.error('Failed to load products');
        console.error('Load products error:', err);
      }
    });
  }

  protected override initForm(isEdit: boolean): void {
    super.initForm(isEdit);
    this.form = this.formService.createProductOfferForm();
  }

  onCancel(): void {
    this.router.navigate(['/admin/product-offers']);
  }

  getErrorMessage(controlName: string): string {
    return this.formService.getErrorMessage(this.form, controlName);
  }
}
