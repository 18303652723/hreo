import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { StorageService } from '@app/services/storage.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {

	@ViewChild(IonSlides, { static: true }) private slides: IonSlides;
	constructor(
		private gethttp: GethttpdataService,
		private storage: StorageService,
		private router: Router
	) {

	}

	public bannerOptions = {
		speed: 500,
		loop: false,
		autoplay: {
			delay: 3000
		},
	};

	public bannerList = [];

	public recommendGoods = [];

	public cateList = [
	];

	ngOnInit() {
		console.log(this.bannerList)
		this.gethttp.banner().subscribe(response => {
			this.bannerList = response
			this.bannerOptions.loop = this.bannerList.length > 1;
		})
		this.gethttp.recommend().subscribe(response => {
			console.log(response)
			this.recommendGoods = response
		})

		console.log(this.cateList)

		// this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
		// .subscribe(() => {
			this.gethttp.intention_category(this.storage.getStorage('intention_data')).subscribe(response => {
				console.log(response)
				this.cateList = response.cate_info;
			})
		// })

	}

}
