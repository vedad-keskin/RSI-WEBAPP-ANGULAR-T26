import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseListPagedComponent } from '../../../core/components/base-classes/base-list-paged-component';
import { UplateApiService } from '../../../api-services/uplate/uplate-api.service';
import { ListUplateQueryDto, ListUplateRequest } from '../../../api-services/uplate/uplate-api.models';
import { ToasterService } from '../../../core/services/toaster.service';

@Component({
  selector: 'app-uplate',
  standalone: false,
  templateUrl: './uplate.component.html',
  styleUrl: './uplate.component.scss'
})
export class UplateComponent
  extends BaseListPagedComponent<ListUplateQueryDto, ListUplateRequest>
  implements OnInit {

  private router = inject(Router);
  private uplateApiService = inject(UplateApiService);
  private toaster = inject(ToasterService);

  displayedColumns: string[] = ['brojUplate', 'orderReferenceNumber', 'datumKreiranja', 'ukupanIznos'];

  constructor() {
    super();
    this.request = new ListUplateRequest();
    this.request.paging.pageSize = 10;
  }

  ngOnInit(): void {
    this.initList();
  }

  protected override loadPagedData(): void {
    this.startLoading();

    this.uplateApiService.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Greška pri učitavanju uplata');
        console.error('Greška pri učitavanju uplata:', err);
      }
    });
  }

  onNovaUplata(): void {
    this.router.navigate(['/admin/uplate/add']);
  }

}
