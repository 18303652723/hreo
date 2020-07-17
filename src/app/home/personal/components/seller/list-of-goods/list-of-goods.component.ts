import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';


@Component({
	selector: 'app-list',
	templateUrl: './list-of-goods.component.html',
	styleUrls: ['./list-of-goods.component.scss'],
})
export class ListOfGoodsComponent implements OnInit {

	constructor(
		private active: ActivatedRoute,
		private GethttpdataService: GethttpdataService,
		private alertController: AlertController,
		private toastController: ToastController,
		private GetCurrentUser: GetCurrentUser,
		private loadingController: LoadingController
	) { }

	public title: string;

	public id: string;


	public is_shelves = false;

	public data = [
		// {
		// 	id: '1001',
		// 	title: '1分抢个咖喱给给ahh1分抢个咖喱给给ah',
		// 	tags: ['全服通用', 'ios'],
		// 	price: '0.01',
		// 	picUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2698237212,1200017883&fm=26&gp=0.jpg'
		// }, {
		// 	id: '1001',
		// 	title: '就爱不覅吧额方法而非阿尔法啊额 ',
		// 	tags: ['全服通用', 'ios'],
		// 	price: '0.26',
		// 	picUrl: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2698237212,1200017883&fm=26&gp=0.jpg'
		// }
	];

	ionViewDidEnter() {
		this.id = this.GetCurrentUser.getCurrentUserId()
		this.getGoodsList()
	}

	ngOnInit() {
		this.active.queryParamMap.subscribe(queryMap => {
			this.title = queryMap.get('title')
		});
	}

	// 获取商品列表
	async getGoodsList() {
		const loading = await this.loadingController.create({
			message: '正在加载...'
		});
		loading.present();
		let params = this.GethttpdataService.getParams({
			title: this.title,
			id: this.id
		});
		this.GethttpdataService.sellerGoods(params).subscribe(response => {
			this.data = response;
			loading.dismiss();
		})
	}

	// 删除
	remove(id) {
		this.alertPresent('是否确认删除该商品？', () => {
			// 执行删除操作
			let params = this.GethttpdataService.getParams({
				id,
			});
			this.GethttpdataService.delGoods(params).subscribe(response => {
				if (response) {
					this.getGoodsList()
					this.toastPresent('删除成功', 'dark').then(toast => {
						toast.present();
					});
				}
			})
		}).then(alert => {
			alert.present();
		});
	}
	// 提交审核
	submitAudit(id) {
		this.alertPresent('确认将该商品提交审核？', () => {
			// 执行提交审核操作
			let params = this.GethttpdataService.getParams({
				id,
				status: 1
			});
			this.GethttpdataService.submitGoods(params).subscribe(response => {
				if (response) {
					this.getGoodsList()
					this.toastPresent('提交成功', 'dark').then(toast => {
						toast.present();
					});
				}
			})
		}).then(alert => {
			alert.present();
		});
	}

	// 上下架
	shelves(id, is_shelves) {
		if (is_shelves) {
			this.goodsStatusChange(id, 3, '下架')
		} else {
			this.goodsStatusChange(id, 2, '上架')
		}
	}

	// 商品操作(上下架)
	goodsStatusChange(id, status, msg) {
		this.alertPresent('是否确认将该商品' + msg + '？', () => {
			// 执行下架操作
			let params = this.GethttpdataService.getParams({
				id,
				status
			});
			this.GethttpdataService.submitGoods(params).subscribe(response => {
				if (response) {
					this.getGoodsList()
					this.toastPresent(msg + '成功', 'dark').then(toast => {
						toast.present();
					});
				}
			})
		}).then(alert => {
			alert.present();
		});
	}

	// 修改价格
	modifyPrice(id) {
		this.alertController.create({
			message: '修改价格',
			inputs: [{
				placeholder: '请输入数字',
				type: 'number',
				name: 'price'
			}],
			buttons: [
				{ text: '取消', role: 'cancel' },
				{
					text: '确定', handler: (({ price }) => {
						let params = this.GethttpdataService.getParams({
							id,
							price
						});
						this.GethttpdataService.modifyPrice(params).subscribe(response => {
							if (response) {
								this.getGoodsList()
							}
						})
						this.toastPresent('价格修改成功', 'dark').then(toast => {
							toast.present();
						});
						console.log(price);
					}).bind(this)
				}
			]
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
