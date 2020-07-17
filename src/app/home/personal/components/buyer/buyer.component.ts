import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';
import { API_CONFIG } from '@app/services/services.module';
import { Inject } from '@angular/core';
import wx from 'src/typings';

@Component({
	selector: 'app-buyer',
	templateUrl: './buyer.component.html',
	styleUrls: ['./buyer.component.scss'],
})
export class BuyerComponent implements OnInit {

	constructor(
		private active: ActivatedRoute,
		private alertController: AlertController,
		private toastController: ToastController,
		private GethttpdataService: GethttpdataService,
		private GetCurrentUser: GetCurrentUser,
		private loadingController: LoadingController,
		@Inject(API_CONFIG) private uri: string
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
		this.getData()
	}

	ngOnInit() {
		this.active.queryParamMap.subscribe(queryMap => {
			this.title = queryMap.get('title')
			console.log(this.id, this.title)
		});
	}

	async getData() {
		const loading = await this.loadingController.create({
			message: '正在加载...'
		});
		loading.present();
		const params = this.GethttpdataService.getParams({
			id: this.id,
			title: this.title
		});
		this.GethttpdataService.toBePaidOrder(params).subscribe(response => {
			this.orderData = response.reverse();
			response.forEach(element => {
				element['countDown'] = { hours: '00', minutes: '26' }
			});
			loading.dismiss();
		})
	}

	// 继续支付
	continuePay(orderId) {
		const data = this.orderData.find(item => {
			return item.id === orderId;
		})
		if (!Boolean(data)) {
			this.toastPresent('该订单不存在', 'danger');
			return;
		}
		console.log(data);
    wx.miniProgram.navigateTo({
      url: `/page/paydetail/paydetail?order_sn=${data.order_sn}&title=${data.title}`
    });
		// window.location.href = this.uri + 'GameLogin/pay?order_sn=' + data.order_sn + '&title=' + data.goods_title;
		return;
		let params = this.GethttpdataService.getParams({
			id: this.id,
			orderId,
		});
		this.GethttpdataService.continuePay(params).subscribe(response => {
			if(response){
				this.toastPresent('订单支付成功', 'dark').then(toast => {
					toast.present();
				});
				this.getData()
			}
		})
	}

	cancelPayment(orderId) {
		this.alertPresent('是否确认取消该订单？', () => {
			// 执行删除操作
			let params = this.GethttpdataService.getParams({
				id: orderId
			});
			this.GethttpdataService.delOrder(params).subscribe(response => {
				console.log(response)
				if(response){
					this.toastPresent('取消订单成功', 'dark').then(toast => {
						toast.present();
					});
					this.getData()
				}else{
					this.toastPresent('取消订单失败', 'dark').then(toast => {
						toast.present();
					});
				}
			})
		}).then(alert => {
			alert.present();
		});
	}

	// 订单操作(退款, 确认收货)
	orderHandle(orderId, status, result){
		let params = this.GethttpdataService.getParams({
			orderId,
			status,
			id: this.id
		});
		this.GethttpdataService.orderHandle(params).subscribe(response => {
			console.log(response)
			if(response){
				this.toastPresent('操作成功', 'dark').then(toast => {
					toast.present();
				});
				this.getData()
			}else{
				this.toastPresent('操作失败', 'dark').then(toast => {
					toast.present();
				});
			}
		})
	}

	// 退款
	refund(orderId){
		this.alertPresent('是否确认退款？', () => {
			// 执行退款操作
			this.orderHandle(orderId, 4, '退款')
		}).then(alert => {
			alert.present();
		});
	}

	// 确认收货
	receiveConfirm(orderId) {
		this.alertPresent('是否确认收货？', () => {
			// 执行收货操作
			this.orderHandle(orderId, 3, '收货')
		}).then(alert => {
			alert.present();
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

}
