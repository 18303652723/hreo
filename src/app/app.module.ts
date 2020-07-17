import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ShareModule } from './share/share.module';
import { CoreModule } from './core/core.module';
import { DealSecurityComponent } from './terms/deal-security/deal-security.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ModalComponent } from './modal/modal.component';
import { JwtInterceptor, ErrorInterceptor } from '@app/_helpers';

@NgModule({
  declarations: [AppComponent, DealSecurityComponent,ModalComponent],
  entryComponents: [],
  imports: [CoreModule, AppRoutingModule, ShareModule, HttpClientModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
