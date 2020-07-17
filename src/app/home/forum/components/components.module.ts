import { NgModule } from '@angular/core';
import { ShareModule } from '@share/share.module';
import { RouterModule } from '@angular/router';
import { MessageComponent } from './message/message.component';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';



@NgModule({
  declarations: [DetailComponent, MessageComponent, AddComponent],
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: 'detail', component: DetailComponent },
      { path: 'message', component: MessageComponent },
      { path: 'add', component: AddComponent }
    ])
  ]
})
export class ComponentsModule { }
