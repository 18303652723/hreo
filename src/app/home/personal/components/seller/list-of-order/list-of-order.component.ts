import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';


@Component({
	selector: 'app-list-of-order',
	templateUrl: './list-of-order.component.html',
	styleUrls: ['./list-of-order.component.scss'],
})
export class ListOfOrderComponent implements OnInit {

	constructor(
		private active: ActivatedRoute,
		private GethttpdataService: GethttpdataService,
		private alertController: AlertController,
		private toastController: ToastController,
		private GetCurrentUser: GetCurrentUser,
		private loadingController: LoadingController
	) { }

	public title: string;

	// 当前用户的id
	public id: string;


	public orderData: any = [
		// {
		// 	id: '001',
		// 	storeTitle: '王的发先生的理发店',
		// 	status: '待支付',
		// 	title: '支付一分钱获得永久大礼包',
		// 	tags: ['【IOS系统】', 'App-Store - 正版', '全服'],
		// 	price: '0.01',
		// 	count: '2',
		// 	countDown: {
		// 		hours: '00',
		// 		minutes: '26'
		// 	}
		// }
	];

	ionViewDidEnter() {
		this.id = this.GetCurrentUser.getCurrentUserId()
		this.getOrderList()
	}

	ngOnInit() {
		this.active.queryParamMap.subscribe(queryMap => {
			this.title = queryMap.get('title');
		});
	}

	// 获取订单列表
	async getOrderList() {
		const loading = await this.loadingController.create({
			message: '正在加载...'
		});
		loading.present();
		const params = this.GethttpdataService.getParams({
			title: this.title,
			id: this.id,
		});
		this.GethttpdataService.sellerOrders(params).subscribe(response => {
			this.orderData = response;
			console.log(this.orderData);
			loading.dismiss();
		})
	}

	cancelPayment() {
		this.alertPresent('是否确认取消该订单？', () => {
			// 执行删除操作
			this.toastPresent('取消订单成功', 'dark').then(toast => {
				toast.present();
			});
		}).then(alert => {
			alert.present();
		});
	}

	receiveConfirm() {
		this.alertPresent('是否确认收货？', () => {
			// 执行收货操作
			this.toastPresent('收货成功', 'dark').then(toast => {
				toast.present();
			});
		}).then(alert => {
			alert.present();
		});
	}

	private alertPresent(message: string, fn: () => void) {
		return this.alertController.create({
			message,
			buttons: [
				{ text: '取消', role: 'cancel' },
				{
					text: '确认', handler() {
						fn();
					}
				}
			]
		});
	}

	private toastPresent(message: string, color: 'dark' | 'danger') {
		return this.toastController.create({
			message,
			color,
			duration: 1500
		});
	}

	// 确认发货
	sendConfirm(orderId) {
		this.alertPresent('是否确认发货？', () => {
			// 执行发货操作
			this.orderHandle(orderId, 5, '发货')
		}).then(alert => {
			alert.present();
		});
	}

	// 订单操作(退款, 确认收货)
	orderHandle(orderId, status, result){
		let params = this.GethttpdataService.getParams({
			orderId,
			status,
			id: this.id,
			title: 3
		});
		this.GethttpdataService.orderHandle(params).subscribe(response => {
			console.log(response)
			if(response){
				this.toastPresent('操作成功', 'dark').then(toast => {
					toast.present();
				});
				this.getOrderList()
			}else{
				this.toastPresent('操作失败', 'dark').then(toast => {
					toast.present();
				});
			}
		})
	}
}
