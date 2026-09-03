import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {
  ListProductOffersQueryDto, ListProductOffersRequest,
  ProductOfferStateType
} from '../../../../api-services/product-offers/product-offers-api.models';
import {BaseListPagedComponent} from '../../../../core/components/base-classes/base-list-paged-component';
import {
  ListProductCategoriesQueryDto,
  ListProductCategoriesRequest
} from '../../../../api-services/product-categories/product-categories-api.model';
import {ProductCategoriesApiService} from '../../../../api-services/product-categories/product-categories-api.service';
import {MatDialog} from '@angular/material/dialog';
import {ToasterService} from '../../../../core/services/toaster.service';
import {DialogHelperService} from '../../../shared/services/dialog-helper.service';
import {ProductOffersApiService} from '../../../../api-services/product-offers/product-offers-api.service';
import {ProductsApiService} from '../../../../api-services/products/products-api.service';

@Component({
  selector: 'app-product-offers',
  standalone: false,
  templateUrl: './product-offers.component.html',
  styleUrl: './product-offers.component.scss',
})
export class ProductOffersComponent
  extends BaseListPagedComponent<ListProductOffersQueryDto, ListProductOffersRequest>
  implements OnInit
{
  private readonly router = inject(Router);

  private api = inject(ProductOffersApiService);
  private productsApi = inject(ProductsApiService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);


  readonly displayedColumns = ['code', 'product', 'price', 'discount', 'discounted', 'validUntil', 'state', 'actions'];
  // readonly products: Array<{ id: number; name: string }> = [];

  products: any;

  constructor() {
    super();
    this.request = new ListProductOffersRequest();
    this.request.paging.pageSize = 5; // same as admin-orders.component.ts (they use 20)
    this.request.onlyActive = false;
  }

  ngOnInit(): void {
    this.initList();
    this.loadProducts();
  }

  protected loadPagedData(): void {
    this.startLoading();

    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load offers');
        console.error('Load offers error:', err);
      },
    });
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
      },
    });

  }

  // Ispitni zadatak: zamijeniti demo redove rezultatom API poziva.
  // readonly rows = [
  //   { id: 1, code: 'OFF-001', product: 'Tastatura', price: 20, discount: 10, discounted: 18, validUntil: '2026-09-05', state: ProductOfferStateType.Aktivna, stateLabel: 'Aktivna', isEnabled: true },
  //   { id: 2, code: 'OFF-002', product: 'Tastatura', price: 20, discount: 15, discounted: 17, validUntil: '2026-08-25', state: ProductOfferStateType.Istekla, stateLabel: 'Istekla', isEnabled: true },
  //   { id: 3, code: 'OFF-003', product: 'Tastatura', price: 20, discount: 20, discounted: 16, validUntil: '2026-09-15', state: ProductOfferStateType.Iskljucena, stateLabel: 'Iskljucena', isEnabled: false },
  // ];

  add(): void { this.router.navigate(['/admin/product-offers/add']); }
  edit(id: number): void { this.router.navigate(['/admin/product-offers/edit', id]); }
  delete(id: number): void { void id; /* TODO: student implementira potvrdu i brisanje. */ }
  // same pattern as products onSearch / admin-orders onStatusFilterChange
  filtersChanged(): void {
    this.request.paging.page = 1;
    this.loadPagedData();
  }


}
