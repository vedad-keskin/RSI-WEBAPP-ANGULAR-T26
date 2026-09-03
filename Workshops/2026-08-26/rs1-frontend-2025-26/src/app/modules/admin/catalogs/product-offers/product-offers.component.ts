import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseListPagedComponent } from '../../../../core/components/base-classes/base-list-paged-component';
import { ToasterService } from '../../../../core/services/toaster.service';
import { DialogHelperService } from '../../../shared/services/dialog-helper.service';
import { ProductOffersApiService } from '../../../../api-services/product-offers/product-offers-api.service';
import { ExamProductsApiService } from '../../../../api-services/exam-products/exam-products-api.service';
import { ExamProductLookupItem } from '../../../../api-services/exam-products/exam-products-api.models';
import {
  ListProductOffersQueryDto,
  ListProductOffersRequest,
} from '../../../../api-services/product-offers/product-offers-api.models';
import { DialogButton } from '../../../shared/models/dialog-config.model';
import { getErrorMessage } from '../../../../core/interceptors/error-logging-interceptor.service';

@Component({
  selector: 'app-product-offers',
  standalone: false,
  templateUrl: './product-offers.component.html',
  styleUrl: './product-offers.component.scss',
})
export class ProductOffersComponent
  extends BaseListPagedComponent<ListProductOffersQueryDto, ListProductOffersRequest>
  implements OnInit {

  private api = inject(ProductOffersApiService);
  private examProductsApi = inject(ExamProductsApiService);
  private router = inject(Router);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);

  displayedColumns: string[] = ['code', 'product', 'price', 'discount', 'discounted', 'validUntil', 'state', 'actions'];

  products: ExamProductLookupItem[] = [];
  productFilter: number | null = null;
  onlyActive = false;

  constructor() {
    super();
    this.request = new ListProductOffersRequest();
    this.request.paging.pageSize = 5;
  }

  ngOnInit(): void {
    this.examProductsApi.lookup().subscribe({
      next: (data) => this.products = data,
    });
    this.initList();
  }

  protected loadPagedData(): void {
    this.startLoading();
    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Failed to load product offers');
        console.error('Load product offers error:', err);
      },
    });
  }

  filtersChanged(): void {
    this.request.productId = this.productFilter;
    this.request.onlyActive = this.onlyActive;
    this.request.paging.page = 1;
    this.loadPagedData();
  }

  add(): void {
    this.router.navigate(['/admin/product-offers/add']);
  }

  edit(id: number): void {
    this.router.navigate(['/admin/product-offers/edit', id]);
  }

  delete(row: ListProductOffersQueryDto): void {
    this.dialogHelper.confirmDelete(row.code, `Da li želite obrisati ponudu ${row.code}?`).subscribe(result => {
      if (result && result.button === DialogButton.DELETE) {
        this.performDelete(row);
      }
    });
  }

  private performDelete(row: ListProductOffersQueryDto): void {
    this.api.delete(row.id).subscribe({
      next: () => {
        this.toaster.success(`Ponuda ${row.code} uspješno obrisana`);
        this.request.paging.page = 1;
        this.loadPagedData();
      },
      error: (err) => {
        this.toaster.error(getErrorMessage(err));
        console.error('Delete error:', err);
      },
    });
  }
}
