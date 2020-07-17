import { Component, OnInit } from '@angular/core';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { ActivatedRoute } from '@angular/router';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';

@Component({
	selector: 'app-dynamic',
	templateUrl: './dynamic.component.html',
	styleUrls: ['./dynamic.component.scss'],
})
export class DynamicComponent implements OnInit {

	constructor(
		private GethttpdataService: GethttpdataService,
		private active: ActivatedRoute,
		private GetCurrentUser: GetCurrentUser
	) { }
	public dataType = '站内信';

	public page = 0;

	public id:string;

	public temp = [];

	public dynamicMessageList = [];
	public noticeList = [
		{
			id: '5512',
			title: '公告标题',
			discription: '公告描述信息公告描述信息公告描述信息公告描述信息公告描述信息公告描述信息',
			time: '2019-12-15 10:33'
		}
	];

	ngOnInit() {
		this.id = this.GetCurrentUser.getCurrentUserId()
		this.getMessage()
	}

	getMessage(){
		let params = this.GethttpdataService.getParams({
			id: this.id
		});
		this.GethttpdataService.message(params).subscribe(response => {
			console.log(response)
			this.dynamicMessageList = response
		})
	}

	pageRefresh(event: any) {
		this.getMessage()
		setTimeout(() => {
			event.target.complete();
		}, 1000);
	}
	loadData(event: any) {
		this.page++
		let params = this.GethttpdataService.getParams({
			id: this.id,
			page: this.page
		});
		this.GethttpdataService.message(params).subscribe(response => {
			console.log(response)
			this.temp = response['data']
			
		})
		setTimeout(() => {
			event.target.complete();
			this.dynamicMessageList = this.dynamicMessageList.concat(this.temp)
			if(this.temp.length < 5){
				event.target.disabled = true;  // 禁止加载更多（没有更多数据）
			}
		}, 500);
	}

}
