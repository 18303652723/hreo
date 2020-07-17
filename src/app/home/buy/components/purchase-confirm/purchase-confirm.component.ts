import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, LoadingController, ModalController,AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';
import { API_CONFIG } from '@app/services/services.module';
import { Inject } from '@angular/core';
import { DealSecurityComponent } from '@app/terms/deal-security/deal-security.component';

@Component({
	selector: 'app-purchase-confirm',
	templateUrl: './purchase-confirm.component.html',
	styleUrls: ['./purchase-confirm.component.scss'],
})
export class PurchaseConfirmComponent implements OnInit {

	constructor(
		private router: Router,
		private active: ActivatedRoute,
		private toastController: ToastController,
		private GethttpdataService: GethttpdataService,
		private GetCurrentUser: GetCurrentUser,
  		private loadingController: LoadingController,
		private modalController: ModalController,
		@Inject(API_CONFIG) private uri: string,
		public alertController: AlertController
	) { }


	// 卖家id
	public sellerId = '5e6883667ad7c02188003424';
	// 商品id
	public goodsId = '';

	public showDetailFrame = false;
	public data: any = {
		// pic_url: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2698237212,1200017883&fm=26&gp=0.jpg',
		// title: '1分抢个咖喱给给ahh',
		// tags: ['礼包', '全服通用'],
		// price: '0.01',
		// count: '2',
		// unit: '件'
	};

	public receiveInfo = {
		mobile: '',
		QQ: '',
		// customerService: '公共客服'
		customerService: ''
	};

	// 当前用户的id
	public id: string;

	public customerServiceList = [];
	private async loadingPresent() {
    return await this.loadingController.create({
      message: '正在处理...'
    });
	}
	public disableBtn = false;

	public agreementList = {};

	get_agreement_list() {
		this.GethttpdataService.agreement_list().subscribe(res => {
		  console.log(res);
		  this.agreementList = res.find(item => item.agreement_title == '买家购买协议')
		  console.log(this.agreementList);
		})
	 }

	ngOnInit() {
		this.id = this.GetCurrentUser.getCurrentUserId()
		this.active.queryParamMap.subscribe(queryMap => {
			this.goodsId = queryMap.get('id');
			if(this.goodsId){
				let params = this.GethttpdataService.getParams({
					goodsId: this.goodsId
				});
				this.GethttpdataService.confirmBuy(params).subscribe(response => {
					console.log(response['receiverInfo']);
					this.data = response['orderDetail'];
					this.customerServiceList = response['customerService'];
					this.sellerId = response['orderDetail']['sell_user_id'];
				})
			}
    	});
			this.get_agreement_list();
	}

	checkDealSecurity() {
		this.modalController.create({
		  component: DealSecurityComponent,
		  componentProps: {
			'data': JSON.stringify(this.agreementList),
			'title': '买家购买协议'
		  }
		}).then(popover => {
		  popover.present();
		});
	  }

	async purchaseConfirm() {
		if (!this.receiveInfo.mobile) {
			this.toastPresent('请输入手机号码', 'danger');
			return;
		} else if (!(/^1[3456789]\d{9}$/.test(this.receiveInfo.mobile))) {
			this.toastPresent('请输入正确的手机号码', 'danger');
			return;
		} else if (!this.receiveInfo.QQ) {
			this.toastPresent('请输入QQ号码', 'danger');
			return;
		} else if (!(/^[1-9][0-9]{4,}$/.test(this.receiveInfo.QQ))) {
			this.toastPresent('请输入正确的QQ号码', 'danger');
			return;
		}
		this.disableBtn = true;
		const params = this.GethttpdataService.getParams({
			id: this.id,
			goods_img: this.data.pic_url,
			goods_title: this.data.title,
			tags: JSON.stringify(this.data.tags),
			deal_money: this.data.price,
			count: this.data.count,
			unit: this.data.unit,
			receiver_phone: this.receiveInfo['mobile'],
			receiver_QQ: this.receiveInfo['QQ'],
			cus_service_id: this.receiveInfo['customerService'],
			seller_id: this.sellerId,
			goods_id: this.goodsId,
			ws_deposit: this.data.ws_deposit,
			goods_price: this.data.goods_price
		})
		const loading = await this.loadingPresent();
    loading.present();
		this.GethttpdataService.addOrder(params).subscribe(response => {
			console.log(response);
			loading.dismiss();
			if (response) {
				var price: any;
				if(this.data.attr_cate == '代练') {
					price = this.data.goods_price * this.data.count
				} else {
					price = this.data.price
				}
				this.router.navigate(['/buyComponents/settlement'], {
					queryParams: {
						price: price,
						orderSn: response.order_sn,
						title: response.title
					}
				});
				// window.location.href = this.uri + 'GameLogin/pay?order_sn=' + response.order_sn + '&title=' + response.title;
			}else{
				this.disableBtn = false;
			}
		})
	}

	/**
	 * 弹框提示
	 * @param message  string
	 * @param color 'dark' | 'danger'
	 */
	private toastPresent(message: string, color: 'dark' | 'danger') {
		this.toastController.create({
			message,
			color,
			duration: 1500,
			mode: 'ios'
		}).then(toast => {
			toast.present();
		});
	}


		/**
	 * 数量增加减按钮
	 * @param type 'add' | 'drop' | 'input'
	 */
	amountOpt(type: 'add' | 'drop' | 'input') {
		if (type == 'add') {
			this.data.count += 1
		} else if (type == 'drop') {
			if (this.data.count == 1) {
				this.toastPresent('购买数量不得少于1', 'danger');
				return
			}
			this.data.count -= 1
		} else {
			this.presentAlertPrompt();
		}
		console.log(this.data.count)
	}

	/**
	 * 设置购买数量
	 */
	async presentAlertPrompt() {
		const alert = await this.alertController.create({
			cssClass: 'my-custom-class',
			header: '设置数量',
			inputs: [
				{
					name: 'amount',
					type: 'number',
				},
			],
			buttons: [
				{
					text: '取消',
					role: 'cancel',
					cssClass: 'secondary',
					handler: () => {
						console.log(this.data.count)
					}
				}, {
					text: '确定',
					handler: (val) => {
						if (val.amount < 1) {
							this.toastPresent('购买数量不得少于1', 'danger');
							return
						}
						this.data.count = val.amount
					}
				}
			]
		});

		await alert.present();
	}

}
