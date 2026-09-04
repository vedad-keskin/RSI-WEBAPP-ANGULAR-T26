import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {
  ListProductOffersQueryDto, ListProductOffersRequest,
} from '../../../../api-services/product-offers/product-offers-api.models';
import {BaseListPagedComponent} from '../../../../core/components/base-classes/base-list-paged-component';
import {ProductsApiService} from '../../../../api-services/products/products-api.service';
import {ToasterService} from '../../../../core/services/toaster.service';
import {DialogHelperService} from '../../../shared/services/dialog-helper.service';
import {ProductOffersApiService} from '../../../../api-services/product-offers/product-offers-api.service';
import {DialogButton} from '../../../shared/models/dialog-config.model';
import {getErrorMessage} from '../../../../core/interceptors/error-logging-interceptor.service';

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
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);
  private productsApi = inject(ProductsApiService);

  readonly displayedColumns = ['code', 'product', 'price', 'discount', 'discounted', 'validUntil', 'state', 'actions'];
  products: any;

  constructor() {
    super();
    this.request = new ListProductOffersRequest();
    this.request.paging.pageSize = 5;
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
      }
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
      }
    });
  }

  add(): void { this.router.navigate(['/admin/product-offers/add']); }
  edit(id: number): void { this.router.navigate(['/admin/product-offers/edit', id]); }

  // same as products.component.ts onDelete / performDelete
  delete(row: ListProductOffersQueryDto): void {
    this.dialogHelper.confirmDelete(
      row.code,
      `Da li želite obrisati ponudu ${row.code}?`
    ).subscribe(result => {
      if (result && result.button === DialogButton.DELETE) {
        this.performDelete(row);
      }
    });
  }

  private performDelete(row: ListProductOffersQueryDto): void {
    this.startLoading();

    this.api.delete(row.id).subscribe({
      next: () => {
        this.toaster.success(`Ponuda ${row.code} uspješno obrisana`);
        this.request.paging.page = 1;
        this.loadPagedData();
      },
      error: (err) => {
        this.stopLoading();
        this.toaster.error(getErrorMessage(err));
        console.error('Delete offer error:', err);
      }
    });
  }

  filtersChanged(): void {
    this.request.paging.page = 1;
    this.loadPagedData();
  }
}
