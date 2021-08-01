import { Directive, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { PoTableColumn, PoMultiselectOption, PoCheckboxGroupOption, PoModalAction, PoPageFilter, PoModalComponent } from '@po-ui/ng-components';
import { HttpParams } from '@angular/common/http';

export interface GridState {
  sort?: string;
  order?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export interface  GridResponse {
  items: any[];
  limit: number;
  page: number;
  count: number;
  total: number;
  hasNext: boolean;
}

@Directive()
export abstract class UnsubscrableGrid implements OnDestroy {

  protected ngUnsubscribe = new Subject();
  disclaimerGroup;
  hiringProcesses: Array<any>;
  hiringProcessesColumns: Array<PoTableColumn>;
  hiringProcessesFiltered: Array<object>;
  jobDescription: Array<string> = [];
  jobDescriptionOptions: Array<PoMultiselectOption>;
  labelFilter: string = '';
  status: Array<string> = [];
  statusOptions: Array<PoCheckboxGroupOption>;

  isLoading: boolean = false;
  hasNext: boolean = false;
  search: string;

  advancedFilters: boolean;

  // Filtros para paginação e carregar mais resultados
  page: number = 0;
  pageSize: number = 0;

  public readonly filterSettings: PoPageFilter = {
    action: this.filterAction.bind(this),
    advancedAction: this.advancedFilterActionModal.bind(this),
    placeholder: 'Search'
  };

  public readonly filterSimpleSettings: PoPageFilter = {
    action: this.filterAction.bind(this),
    placeholder: 'Search'
  };

  private disclaimers = [];

  @ViewChild('advancedFilterModal', { static: true }) advancedFilterModal: PoModalComponent;

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  advancedFilterActionModal() {
    this.advancedFilterModal.open();
  }

  filter() {
    const filters = this.disclaimers.map(disclaimer => disclaimer.value);

    filters.length ? this.hiringProcessesFilter(filters) : this.resetFilterHiringProcess();
  }

  filterAction(labelFilter: string | Array<string>) {
    const filter = typeof labelFilter === 'string' ? [labelFilter] : [...labelFilter];
    this.advancedFilters = typeof labelFilter !== 'string';

    this.populateDisclaimers(filter);
    //this.filter();
  }

  hiringProcessesFilter(filters) {
    this.hiringProcessesFiltered = this.hiringProcesses.filter(item => {
      return Object.keys(item).some(key => !(item[key] instanceof Object) && this.includeFilter(item[key], filters));
    });
  }

  includeFilter(item, filters) {
    return filters.some(filter => String(item).toLocaleLowerCase().includes(filter.toLocaleLowerCase()));
  }

  onChangeDisclaimer(disclaimers) {
    this.disclaimers = disclaimers;

    this.filter();
  }

  populateDisclaimers(filters: Array<any>) {
    this.disclaimers = filters.map(value => ({ value }));

    if (this.disclaimers && this.disclaimers.length > 0) {
      //this.disclaimerGroup.disclaimers = [...this.disclaimerGroup.disclaimers, ...this.disclaimers];
      this.disclaimerGroup.disclaimers = [...this.disclaimers];
    } else {
      this.disclaimerGroup.disclaimers = [];
    }
  }

  resetFilterHiringProcess() {
    this.hiringProcessesFiltered = [...this.hiringProcesses];
    this.status = [];
    this.jobDescription = [];
  }

  parseGridStateToHttpParams(args: GridState): HttpParams {
    const obj: any = {};
    const { sort, order, page, limit, search } = args;

    if (sort) {
      obj.sort = sort;
    }

    if (order) {
      obj.order = order;
    }

    if (page) {
      obj.page = page;
    }

    if (limit) {
      obj.limit = limit;
    }

    if (search) {
      obj.search = search;
    }

    return new HttpParams({
      fromObject: obj
    });
  }
}
