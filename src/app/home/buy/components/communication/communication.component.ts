import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { IonInfiniteScroll, IonContent, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';



@Component({
	selector: 'app-communication',
	templateUrl: './communication.component.html',
	styleUrls: ['./communication.component.scss'],
})
export class CommunicationComponent {
	@ViewChild(IonInfiniteScroll, { static: true }) infiniteScroll: IonInfiniteScroll
	@ViewChild(IonContent, { static: true }) ionContent: IonContent
	constructor(
		private active: ActivatedRoute,
		private GethttpdataService: GethttpdataService,
		private http: HttpClient,
		private toastController: ToastController,
		private GetCurrentUser: GetCurrentUser,
		private loadingController: LoadingController
	) { }

	// 聊天记录
	public data = [];

	// 当前用户的id
	public id: string;

	// 卖家id
	public sellerId: string;


	public sending: any = {
		messageStr: ''
	};

	public page = 0;

	public temp = [];
	// 第一次
	public first = 0;
	// 第一条消息
	public firstMsg = [];

	// 聊天id
	public communicationId = '';
	// 买家创建的聊天的id
	// public question_id = '';

	public sellerName = '';

	async ionViewDidEnter() {
		const loading = await this.loadingController.create({
			message: '正在加载'
		});
		loading.present();
		this.id = this.GetCurrentUser.getCurrentUserId()
		this.active.queryParamMap.subscribe(queryMap => {
			loading.dismiss();
			this.communicationId = queryMap.get('id');
			this.sellerId = queryMap.get('sellerId');
			console.log(this.sellerId)
			// this.infiniteScroll.disabled = false;
			this.page = 0;
			this.getData()
		})
	}

	getData() {
		// this.infiniteScroll.disabled = false;
		let params = this.GethttpdataService.getParams({
			page: this.page,
			sellerId: this.sellerId,
		});
		this.GethttpdataService.feedbackChat(params).subscribe(response => {
			// console.log(response);
			if (this.sellerId) {
				console.log(response)
				// this.sellerName = response

				// this.question_id = response['res'][0]['_id']['$id']
				// 判断后续聊天条数大于5条(每页最多显示五条)

				this.data = response['result'];
				this.sellerName = response['sellerInfo'].user_title;

			} else {
				if (!response['result']) {
					this.data = response['res'][0]
				} else {
					// this.question_id = response['res'][0]['_id']['$id']
					// 判断后续聊天条数大于5条(每页最多显示五条)
					if (response['result'].length >= 5) {
						console.log(response['res'])
						response['result'] = response['result'].reverse()
						this.data = response['result']
					} else {
						console.log(response['res'])
						response['result'] = response['result'].reverse()
						// 所有的信息
						var allMsg = response['res'].concat(response['result'])
						this.first = 1
						this.data = allMsg
					}
					if (response['res'][0]['userOrSelf'] == 'self') {
						this.sellerName = response['sellerInfo'][0] && response['sellerInfo'][0]['user_title']
					} else {
						this.sellerName = response['res'][0]['name']
					}
				}
			}
			setTimeout(() => {
				this.ionContent.scrollToBottom(300);
			}, 300);
		})
	}

	getData__1() {
		// this.infiniteScroll.disabled = false;
		let params = this.GethttpdataService.getParams({
			id: this.id,
			communicationId: this.communicationId,
			page: this.page,
			sellerId: this.sellerId,
		});
		this.GethttpdataService.feedbackChat(params).subscribe(response => {
			console.log(response);
			if (this.sellerId) {
				console.log(response)
				// this.sellerName = response
				if (!response['result']) {
					this.data = response['res']
				} else {
					// this.question_id = response['res'][0]['_id']['$id']
					// 判断后续聊天条数大于5条(每页最多显示五条)
					if (response['result'].length >= 5) {
						console.log(response['res'])
						response['result'] = response['result'].reverse()
						this.data = response['result']
					} else {
						console.log(response['res'])
						response['result'] = response['result'].reverse()
						// 所有的信息
						var allMsg = response['res'].concat(response['result'])
						this.first = 1
						this.data = allMsg
					}
					if (response['res'][0]['userOrSelf'] == 'self') {
						this.sellerName = response['sellerInfo'][0] && response['sellerInfo'][0]['user_title']
					} else {
						this.sellerName = response['res'][0]['name']
					}
				}
			} else {
				if (!response['result']) {
					this.data = response['res'][0]
				} else {
					// this.question_id = response['res'][0]['_id']['$id']
					// 判断后续聊天条数大于5条(每页最多显示五条)
					if (response['result'].length >= 5) {
						console.log(response['res'])
						response['result'] = response['result'].reverse()
						this.data = response['result']
					} else {
						console.log(response['res'])
						response['result'] = response['result'].reverse()
						// 所有的信息
						var allMsg = response['res'].concat(response['result'])
						this.first = 1
						this.data = allMsg
					}
					if (response['res'][0]['userOrSelf'] == 'self') {
						this.sellerName = response['sellerInfo'][0] && response['sellerInfo'][0]['user_title']
					} else {
						this.sellerName = response['res'][0]['name']
					}
				}
				this.ionContent.scrollToBottom();
			}
		})
	}

	refresh(event: any) {
		// this.infiniteScroll.disabled = false;
		this.page++
		let params = this.GethttpdataService.getParams({
			id: this.id,
			communicationId: this.communicationId,
			page: this.page
		});
		this.GethttpdataService.feedbackChat(params).subscribe(response => {
			// this.question_id = response['res'][0]['_id']['$id']
			this.firstMsg = response['res']
			// this.firstMsg[0]['avatar'] = response['buyerInfo']['img_url']
			// 反转数组
			this.temp = response['result'].reverse()
		})
		setTimeout(() => {
			this.data = this.temp.concat(this.data)
			if (this.temp.length < 5 && this.first == 0) {
				this.first = 1
				this.data = this.firstMsg.concat(this.data)
			}
			event.target.complete();
		}, 1000);
	}

	uploadFile(e: any) {
		const file = e.target.files;
		const fileListArr = [];
		const formData = new FormData();
		for (const key in file) {
			if (!(file[key] instanceof File)) { continue; }
			fileListArr.push(file[key]);
			formData.append('file', file[key]);
			console.log(formData.get('file'))
			// 其中formData就是图片文件，post 把formData传上去就行了
			this.http.post('uploadPicture', formData).subscribe((ev: any) => {
				console.log(ev)
				if (ev['url'] != 'undefined' && ev['url'] != null) {
					let params = this.GethttpdataService.getParams({
						sellerId: this.sellerId,
						content_img: ev['url']
					});
					this.GethttpdataService.inputChat(params).subscribe(response => {
						if (response['res']) {
							this.page = 0
							this.getData()
						} else {

						}
					})
				} else {
					this.toastPresent('图片发送失败', 'dark').then(toast => {
						toast.present();
					});
				}
			})
		}
	}

	// 发送消息
	sendMessage() {
		// this.infiniteScroll.disabled = false;
		console.log(this.sending.messageStr);
		this.page = 0;
		let params = this.GethttpdataService.getParams({
			// questionId: this.question_id,
			content: this.sending.messageStr,
			sellerId: this.sellerId,
		});
		this.GethttpdataService.inputChat(params).subscribe(response => {
			if (response['res']) {
				this.page = 0;
				this.getData()
				// this.location.back();
				// this.toastPresent('消息回复成功，等待答复吧');
				// console.log(this.message);
			} else {

			}
		})
		this.sending.messageStr = '';
		this.ionContent.scrollToBottom(300);
	}

	scrollTop() {
		window.scrollTo(0, 0);
	}

	private toastPresent(message: string, color: 'dark' | 'danger') {
		return this.toastController.create({
			message,
			color,
			duration: 1500
		});
	}

}
