import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './account/account.component';
import { ShareModule } from '@share/share.module';
import { AccountInfoPerfectComponent } from './account-info-perfect/account-info-perfect.component';
import { SerllerDetailComponent } from './serller-detail/serller-detail.component';



@NgModule({
  declarations: [AccountComponent, AccountInfoPerfectComponent, SerllerDetailComponent],
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: 'account', component: AccountComponent },
      { path: 'accountInfoPerfect', component: AccountInfoPerfectComponent },
      { path: 'sellerDetail', component: SerllerDetailComponent }
    ])
  ]
})
export class ComponentsModule { }
