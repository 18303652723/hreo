import { NgModule } from '@angular/core';
import { ShareModule } from '@share/share.module';
import { RouterModule } from '@angular/router';
import { BuyComponent } from './buy/buy.component';


@NgModule({
  declarations: [
    BuyComponent
  ],
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: 'buy', component: BuyComponent },
    ])
  ]
})
export class ComponentsModule { }
