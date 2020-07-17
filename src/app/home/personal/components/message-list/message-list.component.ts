import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';


@Component({
	selector: 'app-message-list',
	templateUrl: './message-list.component.html',
	styleUrls: ['./message-list.component.scss'],
})
export class MessageListComponent implements OnInit {

	constructor(
		private GethttpdataService: GethttpdataService,
		private active: ActivatedRoute,
		private GetCurrentUser: GetCurrentUser,
		private router: Router,
	) { }

	public data = [
		// {
		// 	id: '000151',
		// 	avatar: 'http://img4.imgtn.bdimg.com/it/u=1224179288,4154333226&fm=26&gp=0.jpg',
		// 	nickname: '啊哈呵发',
		// 	time: '10:53',
		// 	latest_msg: '我觉得不行'
		// }, {
		// 	id: '000156',
		// 	avatar: 'http://img1.imgtn.bdimg.com/it/u=3767853615,1812532226&fm=26&gp=0.jpg',
		// 	nickname: '我那个的发',
		// 	time: '昨天 19:30',
		// 	latest_msg: '我觉得可以'
		// },
	];

	public id: string;

	public sellerId: string;

	ngOnInit() {
		this.id = this.GetCurrentUser.getCurrentUserId()
		console.log(this.id)
		this.getChat()
	}

	ionViewDidEnter(){
		this.getChat()
	}

	getChat(){
		let params = this.GethttpdataService.getParams({
			id: this.id
		})
		this.GethttpdataService.feedBackList(params).subscribe(response => {
			console.log(response)
			var arr = []
			for (let i in response) {
				arr.push(response[i]);
			}
			console.log(arr)
			this.data = arr
		})
	}

	pageRefresh(e) {
		this.getChat()
		setTimeout(() => {
			e.target.complete();
		}, 1000);
	}

	goToCommunication(id) {
		let params = this.GethttpdataService.getParams({
			receiver_id: id
		})
		this.GethttpdataService.viewedNewMsg(params).subscribe(response => {
			console.log(response);
			this.router.navigate(['/buyComponents/communication'], { queryParams: { sellerId: id } })
		})
	}
}
