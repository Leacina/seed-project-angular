import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandRoutingModule } from './brand-routing.module';
import { BrandsGridComponent } from './brands-grid/brands-grid.component';
import { BrandFormComponent } from './brand-form/brand-form.component';
import { PoToolbarModule, PoMenuModule, PoFieldModule, PoButtonModule, PoTableModule, PoPageModule } from '@po-ui/ng-components';
import { PoPageDynamicTableModule } from '@po-ui/ng-templates';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  declarations: [BrandsGridComponent, BrandFormComponent],
  imports: [
    PoButtonModule,
    PoToolbarModule,
    PoMenuModule,
    PoFieldModule,
    PoTableModule,
    CommonModule,
    BrandRoutingModule,
    PoPageDynamicTableModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    PoPageModule
  ]
})
export class BrandModule { }
