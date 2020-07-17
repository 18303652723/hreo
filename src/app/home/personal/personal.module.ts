import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PersonalComponent } from './personal.component';
import { ShareModule } from 'src/app/share/share.module';

@NgModule({
	declarations: [PersonalComponent],
	imports: [
		ShareModule,
		RouterModule.forChild([
			{ path: '', component: PersonalComponent }
		])
	]
})
export class PersonalModule {
	// 卖家id
	public id = '5e6883667ad7c02188003424';
}
