import { NgModule } from '@angular/core';
import { ShareModule } from '@share/share.module';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { ServerSelectionComponent } from './server-selection/server-selection.component';
import { ProfessionSelectionComponent } from './profession-selection/profession-selection.component';
import { IndexComponent } from './index/index.component';



@NgModule({
  declarations: [
    LoginComponent,
    IndexComponent,
    ServerSelectionComponent,
    ProfessionSelectionComponent
  ],
  imports: [
    ShareModule,
    RouterModule.forChild([
      { path: '',  component: LoginComponent },
      { path: 'index',  component: IndexComponent },
      { path: 'serverSelection',  component: ServerSelectionComponent },
      { path: 'professtionSelection',  component: ProfessionSelectionComponent }
    ])
  ]
})
export class LoginModule { }
