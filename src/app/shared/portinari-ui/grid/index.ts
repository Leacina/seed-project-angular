import { PoTableColumnSort, PoTableColumnSortType } from '@po-ui/ng-components';

export default class Grid {
  getItems(items: any, sort?: PoTableColumnSort, loadAll: boolean = false): Array<any> {
    const result = [...items];

    if (sort && sort.column) {
      result.sort((value, valueToCompare) => this.sort(value, valueToCompare, sort));
    }

    if (!loadAll) {
      result.length = 10;
    }

    return result;
  }

  private sort(value: any, valueToCompare: any, sort: PoTableColumnSort) {
    const property = sort.column.property;
    const type = sort.type;

    if (value[property] < valueToCompare[property]) {
      return type === PoTableColumnSortType.Ascending ? -1 : 1;
    }

    if (value[property] > valueToCompare[property]) {
      return type === PoTableColumnSortType.Ascending ? 1 : -1;
    }

    return 0;
  }
}
