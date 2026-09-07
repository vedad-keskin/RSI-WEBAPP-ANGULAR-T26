import {Component, inject, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {ProductsApiService} from '../../../../../api-services/products/products-api.service';
import {
  ProductCategoriesApiService
} from '../../../../../api-services/product-categories/product-categories-api.service';
import {InventoryCountsApiService} from '../../../../../api-services/inventory-counts/inventory-counts-api.service';
import {ExamProductsApiService} from '../../../../../api-services/exam-products/exam-products-api.service';
import {largePaging} from '../../../../../core/models/paging/paging-utils';
import {ToasterService} from '../../../../../core/services/toaster.service';
import {CreateProductCommand, GetProductByIdQueryDto} from '../../../../../api-services/products/products-api.models';
import {BaseFormComponent} from '../../../../../core/components/base-classes/base-form-component';
import {LoginCommand} from '../../../../../api-services/auth/auth-api.model';
import {BaseComponent} from '../../../../../core/components/base-classes/base-component';
import {CreateInventoryCountCommand} from '../../../../../api-services/inventory-counts/inventory-counts-api.models';
import {getErrorMessage} from '../../../../../core/interceptors/error-logging-interceptor.service';

@Component({
  selector: 'app-inventory-count-add',
  standalone: false,
  templateUrl: './inventory-count-add.component.html',
  styleUrl: './inventory-count-add.component.scss'
})


export class InventoryCountAddComponent
  extends BaseComponent
  implements OnInit {


  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private toaster = inject(ToasterService);

  private api = inject(InventoryCountsApiService);
  private productsApi = inject(ExamProductsApiService);

  // readonly products: Array<{ id: number; name: string }> = [];
    products:any;



  readonly form =
    this.fb.group({
      countNumber: ['' ,[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.pattern(/^INV-/)
        ]
      ],
      note: ['' ,
        [Validators.maxLength(500)]
      ],
      items: this.fb.array<FormGroup>([])
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


  get items(): FormArray<FormGroup> { return this.form.controls.items; }



  addItem(): void {
    this.items.push(
      this.fb.group({
        productId: [null as number | null , [Validators.required , Validators.min(1) ]],
        countedQuantity: [null as number | null ,  [Validators.required , Validators.min(0), Validators.max(100000) ]],
      }));
  }




  removeItem(index: number): void {
    this.items.removeAt(index);
  }


  cancel(): void {

    this.router.navigate(['/admin/inventory-counts']);
  }


  save(): void { /* TODO: student implementira povezivanje, validaciju, racun i POST. */


    if (this.form.invalid || this.isLoading) return;

    this.startLoading();

    const payload: CreateInventoryCountCommand = {
      countNumber: this.form.value.countNumber ?? '',
      note: this.form.value.note,
      items: this.form.value.items,
    };

    this.api.create(payload).subscribe({
      next: () => {


        this.stopLoading();


        this.router.navigate(['/admin/inventory-counts']);

        this.toaster.success('Inventura uspješno dodana');


      },
      error: (err) => {

        this.toaster.error(getErrorMessage(err));


        this.stopLoading('Something went wrong. Please try again.');
        console.error('Adding error:', err);
      },
    });



  }


}
