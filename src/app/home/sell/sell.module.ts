import { NgModule } from '@angular/core';
import { ShareModule } from '@share/share.module';
import { RouterModule } from '@angular/router';
import { SellComponent } from './sell.component';



@NgModule({
  declarations: [SellComponent],
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: '', component: SellComponent },
    ])
  ]
})
export class SellModule { }
