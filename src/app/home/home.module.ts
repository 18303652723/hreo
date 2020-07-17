import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage,
        children: [
          { path: '', redirectTo: 'sell' },
          {
            path: 'index',
            loadChildren: () => import('./index/index.module').then(m => m.IndexModule)
          }, {
            path: 'buy',
            loadChildren: () => import('./buy/buy.module').then(m => m.BuyModule)
          }, {
            path: 'forum',
            loadChildren: () => import('./forum/forum.module').then(m => m.ForumModule)
          }, {
            path: 'personal',
            loadChildren: () => import('./personal/personal.module').then(m => m.PersonalModule)
          }, {
            path: 'sell',
            loadChildren: () => import('./sell/sell.module').then(m => m.SellModule)
          }
        ]
      },
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
