import {Component, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {BaseListPagedComponent} from '../../../../core/components/base-classes/base-list-paged-component';
import {ListProductsQueryDto, ListProductsRequest} from '../../../../api-services/products/products-api.models';
import {
  ListInventoryCountsQueryDto,
  ListInventoryCountsRequest
} from '../../../../api-services/inventory-counts/inventory-counts-api.models';
import {ProductsApiService} from '../../../../api-services/products/products-api.service';
import {ToasterService} from '../../../../core/services/toaster.service';
import {DialogHelperService} from '../../../shared/services/dialog-helper.service';
import {InventoryCountsApiService} from '../../../../api-services/inventory-counts/inventory-counts-api.service';

@Component({
  selector: 'app-inventory-counts',
  standalone: false,
  templateUrl: './inventory-counts.component.html',
  styleUrl: './inventory-counts.component.scss'
})


export class InventoryCountsComponent
  extends BaseListPagedComponent<ListInventoryCountsQueryDto, ListInventoryCountsRequest>
  implements OnInit
{

  private readonly router = inject(Router);
  private api = inject(InventoryCountsApiService);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);

  readonly displayedColumns =
    [
      'countNumber',
      'createdAtUtc',
      'itemsCount',
      'totalDifferenceValue',
      'note'
    ];

  // Ispitni zadatak: povezati vec dati list API i paginator.

  constructor() {
    super();
    this.request = new ListInventoryCountsRequest();

    this.request.paging.pageSize = 5;
  }


  // readonly rows = [
  //   { countNumber: 'INV-DEMO-1', createdAtUtc: new Date(), itemsCount: 2, totalDifferenceValue: -40, note: 'Kontrolno brojanje' },
  //   { countNumber: 'INV-DEMO-2', createdAtUtc: new Date(), itemsCount: 1, totalDifferenceValue: 0, note: null },
  // ];

  ngOnInit(): void {
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
        this.stopLoading('Failed to load inventory counts');
        console.error('Load inventory counts error:', err);
      }
    });
  }



  add(): void { this.router.navigate(['/admin/inventory-counts/add']); }



}
