import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/admin/home',
    pathMatch: 'full'
  },
  // HOME
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'establishment',
    loadChildren: () => import('./establishment/establishment.module').then(m => m.EstablishmentModule) },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)
  },
  {
    path: 'brand',
    loadChildren: () => import('./brand/brand.module').then(m => m.BrandModule)
  },
  {
    path: 'model',
    loadChildren: () => import('./model/model.module').then(m => m.ModelModule)
  },
  {
    path: 'piece',
    loadChildren: () => import('./piece/piece.module').then(m => m.PieceModule)
  },
  {
    path: 'budget',
    loadChildren: () => import('./budget/budget.module').then(m => m.BudgetModule)
  },
  {
    path: 'quotation',
    loadChildren: () => import('./quotation/quotation.module').then(m => m.QuotationModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
