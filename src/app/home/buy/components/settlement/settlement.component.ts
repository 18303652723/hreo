import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import wx from 'src/typings';

@Component({
  selector: 'app-settlement',
  templateUrl: './settlement.component.html',
  styleUrls: ['./settlement.component.scss'],
})
export class SettlementComponent implements OnInit {

  constructor(
    private active: ActivatedRoute
  ) { }

  public data = {
    orderSn: null,
    title: null,
    price: null
  };

  ngOnInit() {
    this.active.queryParamMap.pipe(first()).subscribe(queryMap => {
      this.data.orderSn = queryMap.get('orderSn');
      this.data.title = queryMap.get('title');
      this.data.price = queryMap.get('price');
    });
  }

  settlement() {
    wx.miniProgram.reLaunch({
      url: `/page/paydetail/paydetail?order_sn=${this.data.orderSn}&title=${this.data.title}`
    });
  }

}
