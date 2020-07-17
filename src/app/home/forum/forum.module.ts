import { NgModule } from '@angular/core';
import { ShareModule } from '@share/share.module';
import { RouterModule } from '@angular/router';
import { ForumComponent } from './forum.component';



@NgModule({
  declarations: [ForumComponent],
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: '', component: ForumComponent }
    ])
  ]
})
export class ForumModule { }
