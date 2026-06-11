import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseListPagedComponent } from '../../../core/components/base-classes/base-list-paged-component';
import { UplateApiService } from '../../../api-services/uplate/uplate-api.service';
import {
  ListUplateQueryDto,
  ListUplateRequest
} from '../../../api-services/uplate/uplate-api.models';
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
  private api = inject(UplateApiService);
  private toaster = inject(ToasterService);

  displayedColumns: string[] = ['brojUplate', 'orderReferenceNumber', 'datumKreiranja', 'ukupanIznos'];

  constructor() {
    super();
    this.request = new ListUplateRequest();
  }

  ngOnInit(): void {
    this.initList();
  }

  protected override loadPagedData(): void {
    this.startLoading();

    this.api.list(this.request).subscribe({
      next: (response) => {
        this.handlePageResult(response);
        this.stopLoading();
      },
      error: (err) => {
        this.stopLoading('Greška pri učitavanju uplata');
        this.toaster.error('Greška pri učitavanju uplata');
        console.error('Load uplate error:', err);
      },
    });
  }

  onNovaUplata(): void {
    this.router.navigate(['/admin/uplate/add']);
  }

}
