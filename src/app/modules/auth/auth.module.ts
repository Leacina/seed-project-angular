import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { PoFieldModule, PoButtonModule } from '@po-ui/ng-components';

@NgModule({
  declarations: [
    LoginComponent,
    RecoveryComponent
  ],
  imports: [
    PoFieldModule,
    PoButtonModule,
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
