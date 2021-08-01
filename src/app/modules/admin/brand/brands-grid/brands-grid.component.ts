import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PieceService } from 'src/app/core/services/piece.service';
import { BrandService } from 'src/app/core/services/brand.service';
import { PoPageDynamicTableFilters } from '@po-ui/ng-templates';
import { UnsubscrableGrid } from 'src/app/shared/table';
import { takeUntil } from 'rxjs/operators';
import { PoTableColumn, PoTableColumnSort } from '@po-ui/ng-components';

@Component({
  selector: 'app-brands-grid',
  templateUrl: './brands-grid.component.html',
  styleUrls: ['./brands-grid.component.scss'],
})
export class BrandsGridComponent extends UnsubscrableGrid  implements OnInit {
  readonly fields: Array<PoTableColumn> = [
    { property: 'id', label:'ID', type: 'number', width: '8%' },
    { property: 'marca', label: 'MARCA/FABRICANTE' },
    { property: 'pais', label: 'PAÍS' },
    { property: 'dh_inc', label: 'DATA CADASTRO', type: 'date',format: 'dd/MM/yyyy' },
    { property: 'typeId', label: 'VISUALIZAR', type: 'columnTemplate', width: '10%' },
  ]

  constructor(
    private brandService: BrandService,
    private router: Router
  ) {
    super()
  }

  onCreate(){
    this.router.navigate(['admin/brand/create']);
  }

  ngOnInit(): void {
    this.disclaimerGroup = {
      title: 'Filters',
      disclaimers: [],
      change: this.onChangeDisclaimer.bind(this)
    };

    this.brandService.getAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        this.hiringProcesses = new Array<object>();
        for(let i = 0; i < res.items.length; i++){
          res.items[i].typeId = res.items[i].id;
          this.hiringProcesses.push(res.items[i]);
        }
        this.hasNext = !res.hasNext;
        this.hiringProcessesColumns = this.fields;

        this.hiringProcessesFiltered = [...this.hiringProcesses];
      });
  }

  openBrandEdit(row) {
    this.router.navigate(['admin/brand/update/' + row]);
  }

  showMore(sort: PoTableColumnSort) {
    this.page += 11;

    const params = this.parseGridStateToHttpParams({page: this.page});

    this.brandService.query(params)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((res) => {
        for(let i = 0; i < res.items.length; i++){
          res.items[i].typeId = res.items[i].id;
          this.hiringProcesses.push(res.items[i]);
        }

        this.hasNext = !res.hasNext;

        this.hiringProcessesColumns = this.fields;
        this.hiringProcessesFiltered = [...this.hiringProcesses];
      });
  }
}
