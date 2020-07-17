import { NgModule, SkipSelf, Optional, enableProdMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ServicesModule } from 'src/app/services/services.module';
import zh from '@angular/common/locales/zh';

enableProdMode();
registerLocaleData(zh);

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    BrowserModule,
    ServicesModule
  ]
})
export class CoreModule {
  constructor(@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule只允许被AppModule引入');
    }
  }
}
