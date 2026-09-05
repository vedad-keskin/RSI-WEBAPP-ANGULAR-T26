import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseComponent} from '../../../../../core/components/base-classes/base-component';
import {
  ProductCategoriesApiService
} from '../../../../../api-services/product-categories/product-categories-api.service';
import {ProductOffersApiService} from '../../../../../api-services/product-offers/product-offers-api.service';
import {
  GetProductCategoryByIdQueryDto
} from '../../../../../api-services/product-categories/product-categories-api.model';
import {
  CreateProductOfferCommand,
  GetProductOfferByIdQueryDto, UpdateProductOfferCommand
} from '../../../../../api-services/product-offers/product-offers-api.models';
import {ProductsApiService} from '../../../../../api-services/products/products-api.service';
import {ToasterService} from '../../../../../core/services/toaster.service';
import {getErrorMessage} from '../../../../../core/interceptors/error-logging-interceptor.service';

@Component({
  selector: 'app-product-offer-edit',
  standalone: false,
  templateUrl: './product-offer-edit.component.html',
  styleUrl: '../product-offer-add/product-offer-add.component.scss'
})


export class ProductOfferEditComponent extends BaseComponent implements OnInit  {


  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private route= inject(ActivatedRoute);
  private api = inject(ProductOffersApiService);
  private productsApi = inject(ProductsApiService);
  private toaster = inject(ToasterService);

  public productOfferDto: GetProductOfferByIdQueryDto| null = null;


  private offerId: number=0;

  products: any;


  readonly form = this.fb.group({
    code: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20),
      Validators.pattern(/^OFF-/),
    ]],

    productId: [null as number | null , [
      Validators.required,
      Validators.min(1),
    ]],

    discountPercent: [null as number | null , [
      Validators.required,
      Validators.min(0.01),
      Validators.max(50)
    ]   ],
    validUntilUtc: [null as string | null , [
      Validators.required,
    ]   ],
    isEnabled: [false]
  });


  ngOnInit(): void {
    this.startLoading();

    this.loadProducts();


    this.offerId = +this.route.snapshot.params['id'];


    this.api.getById(this.offerId).subscribe({
        next: (response) => {

          this.productOfferDto = response;

          this.form.patchValue(response);

          this.stopLoading();
        },
        error: (err) => {
          console.error('Load offers error:', err);
          this.stopLoading();
        }
      }
    );
  }


  private loadProducts() {

    this.startLoading();

    this.productsApi.list().subscribe({
      next: (response) => {

        this.products = response.items;


        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load offers');
        console.error('Load offers error:', err);
      }
    });

  }


  cancel(): void { this.router.navigate(['/admin/product-offers']); }

  save(): void { /* TODO: student implementira ucitavanje, validaciju i izmjenu. */

    if (this.form.invalid || this.isLoading) return;

    this.startLoading();

    const payload: UpdateProductOfferCommand = {

      code : this.form.value.code?.trim() ?? '',
      productId : this.form.value.productId ?? 0,
      discountPercent : this.form.value.discountPercent ?? 0,
      validUntilUtc : this.form.value.validUntilUtc ?? '',
      isEnabled : this.form.value.isEnabled ?? false,

    };


    this.api.update(this.offerId, payload).subscribe({
      next: () => {

        this.stopLoading();


        this.router.navigate(['/admin/product-offers']);

        this.toaster.success('Ponuda je uspješno editovana');



      },
      error: (err) => {

        this.toaster.error(getErrorMessage(err) || 'Neuspješno editovanje');


        this.stopLoading('Something went wrong. Please try again.');
        console.error('Edit error:', err);
      },
    });

  }
}
