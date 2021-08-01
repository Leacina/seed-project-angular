import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BrandsGridComponent } from './brands-grid/brands-grid.component';
import { BrandFormComponent } from './brand-form/brand-form.component';

const routes: Routes = [
  {
    path: '',
    component: BrandsGridComponent
  },
  {
    path: 'create',
    component: BrandFormComponent
  },
  {
    path: 'update/:id',
    component: BrandFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandRoutingModule { }
