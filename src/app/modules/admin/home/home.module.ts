import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeRoutingModule } from './home-routing.module';
import { PoChartModule, PoWidgetModule } from '@po-ui/ng-components';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    PoChartModule,
    PoWidgetModule
  ]
})
export class HomeModule {}
