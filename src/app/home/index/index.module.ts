import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '@share/share.module';
import { RouterModule } from '@angular/router';
import { IndexComponent } from './index.component';



@NgModule({
  declarations: [IndexComponent],
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: '', component: IndexComponent }
    ])
  ]
})
export class IndexModule { }
