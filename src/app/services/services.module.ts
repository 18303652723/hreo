import { NgModule, InjectionToken } from '@angular/core';


export const API_CONFIG = new InjectionToken('ApiConfigToken');
export const Company_Config = new InjectionToken('ApiConfigToken');
export const BASE_URI = new InjectionToken('ApiConfigToken');


@NgModule({
  declarations: [],
  imports: [
  ],
  providers: [
    { provide: API_CONFIG, useValue:  'https://www.domain.com/index.php/' },
    { provide: BASE_URI, useValue:  'https://www.domain.com/index.php/' },
    { provide: Company_Config, useValue:  { company_id: 15711 } }
  ]
})
export class ServicesModule { }
