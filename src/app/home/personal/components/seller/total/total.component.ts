import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';

@Component({
	selector: 'app-total',
	templateUrl: './total.component.html',
	styleUrls: ['./total.component.scss'],
})
export class TotalComponent implements OnInit {

	constructor(
		private active: ActivatedRoute,
		private GethttpdataService: GethttpdataService,
		private GetCurrentUser: GetCurrentUser
	) { }

	public type: string;

	// 当前用户的id
	public id: string;

	public buyerOrders_num = [0, 0, 0, 0, 0];
	public sellerGoods_num = [0, 0, 0, 0, 0];
	// 我是卖家 -- 商品总数
	public sellerGoodsAll = 0;
	public sellerOrders_num = [0, 0, 0, 0, 0];
	// 我是卖家 -- 订单总数
	public sellerOrdersAll = 0;

	ngOnInit() {
		this.active.queryParamMap.subscribe(res => {
			this.type = res.get('type');
			this.id = this.GetCurrentUser.getCurrentUserId()

			this.sellerGoodsAll = 0;
			this.sellerOrdersAll = 0;
			let params = this.GethttpdataService.getParams({
				id: this.id,
			});
			if (this.type == 'buyerOrders') {
				this.GethttpdataService.orderListNum(params).subscribe(response => {
					this.buyerOrders_num = response
				})
			} else if (this.type == 'sellerGoods') {
				this.GethttpdataService.sellerGoodsNum(params).subscribe(response => {
					this.sellerGoods_num = response
					for (var i = 0; i < this.sellerGoods_num.length; i++) {
						this.sellerGoodsAll += this.sellerGoods_num[i]
					}
				})
			} else if (this.type == 'sellerOrders') {
				this.GethttpdataService.sellerOrdersNum(params).subscribe(response => {
					this.sellerOrders_num = response
					for (var i = 0; i < this.sellerOrders_num.length; i++) {
						this.sellerOrdersAll += this.sellerOrders_num[i]
					}
				})
			}
		});
	}

}
