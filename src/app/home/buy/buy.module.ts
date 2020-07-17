import { NgModule } from '@angular/core';
import { ShareModule } from '@share/share.module';
import { RouterModule } from '@angular/router';
import { BuyComponent } from './buy.component';



@NgModule({
  declarations: [BuyComponent],
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: '', component: BuyComponent }
    ])
  ]
})
export class BuyModule { }
