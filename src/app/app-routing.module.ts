import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { DealSecurityComponent } from './terms/deal-security/deal-security.component';
import { AuthGuard } from '@app/_helpers';
import { ModalComponent } from './modal/modal.component';

const routes: Routes = [
  { path: '', redirectTo: '/home/index', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  }, {
    path: 'modal',
    component: ModalComponent
  }, {
    path: 'term',
    component: DealSecurityComponent
  }, {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  }, {
    path: 'forumComponents',
    loadChildren: () => import('./home/forum/components/components.module').then(m => m.ComponentsModule)
  }, {
    path: 'buyComponents',
    loadChildren: () => import('./home/buy/components/components.module').then(m => m.ComponentsModule),
    canActivate: [AuthGuard]
  }, {
    path: 'indexComponents',
    loadChildren: () => import('./home/index/components/components.module').then(m => m.ComponentsModule),
    canActivate: [AuthGuard]
  }, {
    path: 'personalComponents',
    loadChildren: () => import('./home/personal/components/components.module').then(m => m.ComponentsModule),
    canActivate: [AuthGuard]
  }, {
    path: 'sellComponents',
    loadChildren: () => import('./home/sell/components/components.module').then(m => m.ComponentsModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
