import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UplateApiService } from '../../../api-services/uplate/uplate-api.service';
import {ListUplateQuery, ListUplateQueryDto} from '../../../api-services/uplate/uplate-api.models';
import {BaseListPagedComponent} from '../../../core/components/base-classes/base-list-paged-component';
import {
  ListOrderShipmentsQueryDto,
  ListOrderShipmentsRequest
} from '../../../api-services/order-shipments/order-shipments-api.model';
import {MatDialog} from '@angular/material/dialog';
import {ToasterService} from '../../../core/services/toaster.service';
import {DialogHelperService} from '../../shared/services/dialog-helper.service';

@Component({
  selector: 'app-uplate',
  standalone: false,
  templateUrl: './uplate.component.html',
  styleUrl: './uplate.component.scss'
})
export class UplateComponent
  extends BaseListPagedComponent<ListUplateQueryDto, ListUplateQuery>
  implements OnInit {


  private router = inject(Router);
  private api = inject(UplateApiService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToasterService);
  private dialogHelper = inject(DialogHelperService);

  // uplate: ListUplateQueryDto[] = [];
  displayedColumns: string[] = ['brojUplate', 'orderReferenceNumber', 'datumKreiranja', 'ukupanIznos'];


  constructor() {
    super();
    this.request = new ListOrderShipmentsRequest();
  }


  ngOnInit(): void {
    // this.loadUplate();
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
        this.stopLoading('Failed to load order shipments');
        console.error('Load order shipments error:', err);
      },
    });

  }



  onNovaUplata(): void {
    this.router.navigate(['/admin/uplate/add']);
  }

}
