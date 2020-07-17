import { Component, OnInit } from '@angular/core';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
	selector: 'app-personal',
	templateUrl: './personal.component.html',
	styleUrls: ['./personal.component.scss'],
})
export class PersonalComponent implements OnInit {

	constructor(
		private GetCurrentUser: GetCurrentUser,
		private GethttpdataService: GethttpdataService,
		private router: Router
		) { }

	public currentUser = {
		user_title: '',
		user_phone: '',
		id: '',
		img_url: '',
		have_news: false
	};

	ngOnInit() {
		this.currentUser['id'] = this.GetCurrentUser.getCurrentUserId()
		let params = this.GethttpdataService.getParams({
			id: this.currentUser['id']
		})
		
		this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
			this.GethttpdataService.personalInfo(params).subscribe(response => {
				this.currentUser['have_news'] = response[0]['have_news']
				this.currentUser['img_url'] = response[0]['img_url']
				this.currentUser['user_title'] = response[0]['user_title']
				this.currentUser['user_phone'] = response[0]['user_phone']
			})
		})
	}

	navigateMessage(e: Event) {
		e.stopPropagation();
		this.router.navigate(['/personalComponents/messageList']);
	}

	navigatePersonalInfo(e: Event) {
		e.stopPropagation();
		this.router.navigate(['/personalComponents/personalInfomation']);
	}
}
