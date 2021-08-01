import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocketService } from '../../core/services/socket.service';

import { AdminRoutingModule } from './admin-routing.module';
import { PoToolbarModule, PoMenuModule, PoFieldModule, PoButtonModule } from '@po-ui/ng-components';
@NgModule({
  declarations: [],
  imports: [
    PoFieldModule,
    PoButtonModule,
    PoMenuModule,
    PoToolbarModule,
    CommonModule,
    AdminRoutingModule,
  ],
  providers: [
    SocketService
  ]
})
export class AdminModule { }
