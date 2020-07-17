import { NgModule } from '@angular/core';
import { ShareModule } from '@share/share.module';
import { RouterModule } from '@angular/router';
import { GoodsDetailComponent } from './goods-detail/goods-detail.component';
import { PurchaseConfirmComponent } from './purchase-confirm/purchase-confirm.component';
import { DealCompleteComponent } from './deal-complete/deal-complete.component';
import { CommunicationComponent } from './communication/communication.component';
import { SettlementComponent } from './settlement/settlement.component';



@NgModule({
  declarations: [
    GoodsDetailComponent,
    PurchaseConfirmComponent,
    DealCompleteComponent,
    CommunicationComponent,
    SettlementComponent
  ],
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: 'goodsDetail', component: GoodsDetailComponent },
      { path: 'purchaseConfirm', component: PurchaseConfirmComponent },
      { path: 'dealComplete', component: DealCompleteComponent },
      { path: 'communication', component: CommunicationComponent },
      { path: 'settlement', component: SettlementComponent }
    ])
  ]
})
export class ComponentsModule { }
