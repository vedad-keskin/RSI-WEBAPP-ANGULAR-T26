import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {LoginCommand} from '../../../../../api-services/auth/auth-api.model';
import {BaseComponent} from '../../../../../core/components/base-classes/base-component';
import {CreateProductOfferCommand} from '../../../../../api-services/product-offers/product-offers-api.models';
import {ProductOffersApiService} from '../../../../../api-services/product-offers/product-offers-api.service';
import {ToasterService} from '../../../../../core/services/toaster.service';
import {getErrorMessage} from '../../../../../core/interceptors/error-logging-interceptor.service';
import {ProductsApiService} from '../../../../../api-services/products/products-api.service';

@Component({
  selector: 'app-product-offer-add',
  standalone: false,
  templateUrl: './product-offer-add.component.html',
  styleUrl: './product-offer-add.component.scss'
})


export class ProductOfferAddComponent extends BaseComponent implements OnInit{


  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private api = inject(ProductOffersApiService);
  private toaster = inject(ToasterService);
  private productsApi = inject(ProductsApiService);





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
    validUntilUtc: [null as Date | null , [
      Validators.required,
    ]   ],

  });

  ngOnInit(): void {
    this.loadProducts();
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



  cancel(): void {
    this.router.navigate(['/admin/product-offers']);
  }

  save(): void { /* TODO: student implementira validaciju i snimanje. */

    if (this.form.invalid || this.isLoading) return;

    this.startLoading();

    const payload: CreateProductOfferCommand = {

      code : this.form.value.code?.trim() ?? '',
      productId : this.form.value.productId ?? 0,
      discountPercent : this.form.value.discountPercent ?? 0,
      validUntilUtc : this.form.value.validUntilUtc ?? new Date(),


    };

    this.api.create(payload).subscribe({
      next: () => {

        this.stopLoading();


        this.router.navigate(['/admin/product-offers']);

        this.toaster.success('Ponuda je uspješno dodana');



      },
      error: (err) => {

        this.toaster.error(getErrorMessage(err) || 'Neuspješno dodavanje');


        this.stopLoading('Something went wrong. Please try again.');
        console.error('Add error:', err);
      },
    });




  }
}
