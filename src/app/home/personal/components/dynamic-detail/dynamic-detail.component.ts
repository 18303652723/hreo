import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';

@Component({
	selector: 'app-dynamic-detail',
	templateUrl: './dynamic-detail.component.html',
	styleUrls: ['./dynamic-detail.component.scss'],
})
export class DynamicDetailComponent implements OnInit {

	constructor(
		private GethttpdataService: GethttpdataService,
		private active: ActivatedRoute
	) { }

	public id = '';

	public data: any;

	ngOnInit() {
		this.active.queryParamMap.subscribe(queryMap => {
			this.id = queryMap.get('id');
			// this.infiniteScroll.disabled = false;
			this.getMessageDetail()
		})
	}
	getMessageDetail(){
		let params = this.GethttpdataService.getParams({
			id: this.id
		});
		this.GethttpdataService.messageDetail(params).subscribe(response => {
			console.log(response)
			this.data = response['data'][0]
		})
	}
	

}
