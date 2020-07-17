import { NgModule } from '@angular/core';
import { ShareModule } from '@share/share.module';
import { RouterModule } from '@angular/router';
import { BuyerComponent } from './buyer/buyer.component';
import { ListOfGoodsComponent } from './seller/list-of-goods/list-of-goods.component';
import { TotalComponent } from './seller/total/total.component';
import { CollectionComponent } from './collection/collection.component';
import { ListOfOrderComponent } from './seller/list-of-order/list-of-order.component';
import { MessageListComponent } from './message-list/message-list.component';
import { DynamicComponent } from './dynamic/dynamic.component';
import { DynamicDetailComponent } from './dynamic-detail/dynamic-detail.component';
import { InteractionComponent } from './interaction/interaction.component';
import { InteractionDetailComponent } from './interaction-detail/interaction-detail.component';
import { PersonalInfomationComponent } from './personal-infomation/personal-infomation.component';
import { NoticeDetailComponent } from './notice-detail/notice-detail.component';
import { ApplyCashWithdrawComponent } from './apply-cash-withdraw/apply-cash-withdraw.component';
import { CashWithdrawRecordComponent } from './cash-withdraw-record/cash-withdraw-record.component';
import { AgreementComponent } from './agreement/agreement.component';
import { ApplyWhereasComponent } from './apply-whereas/apply-whereas.component';


@NgModule({
  declarations: [
    BuyerComponent,
    TotalComponent,
    CollectionComponent,
    ListOfGoodsComponent,
    ListOfOrderComponent,
    MessageListComponent,
    DynamicComponent,
    DynamicDetailComponent,
    NoticeDetailComponent,
    InteractionComponent,
    InteractionDetailComponent,
    PersonalInfomationComponent,
    ApplyCashWithdrawComponent,
    CashWithdrawRecordComponent,
    AgreementComponent,
    ApplyWhereasComponent
  ],
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: 'buyer', component: BuyerComponent },
      { path: 'sellerListOfGoods', component: ListOfGoodsComponent },
      { path: 'sellerListOfOrder', component: ListOfOrderComponent },
      { path: 'sellerDealTotal', component: TotalComponent },
      { path: 'collection', component: CollectionComponent },
      { path: 'messageList', component: MessageListComponent },
      { path: 'dynamic', component: DynamicComponent },
      { path: 'dynamicDetail', component: DynamicDetailComponent },
      { path: 'noticeDetail', component: NoticeDetailComponent },
      { path: 'interaction', component: InteractionComponent },
      { path: 'interactionDetail', component: InteractionDetailComponent },
      { path: 'personalInfomation', component: PersonalInfomationComponent },
      { path: 'applyCashWithdraw', component: ApplyCashWithdrawComponent },
      { path: 'cashWithdrawRecord', component: CashWithdrawRecordComponent },
      { path: 'Agreement', component: AgreementComponent },
      { path: 'ApplyWhereas', component: ApplyWhereasComponent },
    ])
  ]
})
export class ComponentsModule { }
