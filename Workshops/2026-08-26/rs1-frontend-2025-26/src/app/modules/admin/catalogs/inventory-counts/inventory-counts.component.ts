import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseListPagedComponent } from '../../../../core/components/base-classes/base-list-paged-component';
import {
  ListInventoryCountsQueryDto,
  ListInventoryCountsRequest,
} from '../../../../api-services/inventory-counts/inventory-counts-api.models';
import { InventoryCountsApiService } from '../../../../api-services/inventory-counts/inventory-counts-api.service';

@Component({
  selector: 'app-inventory-counts',
  standalone: false,
  templateUrl: './inventory-counts.component.html',
  styleUrl: './inventory-counts.component.scss',
})
export class InventoryCountsComponent
  extends BaseListPagedComponent<ListInventoryCountsQueryDto, ListInventoryCountsRequest>
  implements OnInit
{
  private readonly router = inject(Router);
  private readonly api = inject(InventoryCountsApiService);

  readonly displayedColumns = ['countNumber', 'createdAtUtc', 'itemsCount', 'totalDifferenceValue', 'note'];

  constructor() {
    super();
    this.request = new ListInventoryCountsRequest();
    this.request.paging.pageSize = 5;
  }

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

  add(): void {
    this.router.navigate(['/admin/inventory-counts/add']);
  }
}
