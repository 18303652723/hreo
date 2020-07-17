import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonContent, IonSegment, IonHeader } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { StorageService } from 'src/app/services/storage.service';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';


@Component({
  selector: 'app-goods-detail',
  templateUrl: './goods-detail.component.html',
  styleUrls: ['./goods-detail.component.scss'],
})
export class GoodsDetailComponent implements OnInit, AfterViewInit {

  constructor(
    private activeRouter: ActivatedRoute,
    private gethttp: GethttpdataService,
    private router: Router,
    private storage: StorageService,
    private GetCurrentUser: GetCurrentUser
  ) { }

  public collected: boolean;
  @ViewChild(IonHeader, { static: true }) public ionHeader: any;
  @ViewChild(IonContent, { static: true }) ionContent: IonContent;
  @ViewChild(IonSegment, { static: true }) ionSegment: IonSegment | any;
  @ViewChild('goods_info', { static: true }) goodsInfo: any;
  @ViewChild('recommend', { static: true }) recommend: any;
  @ViewChild('process', { static: true }) process: any;
  public offsetTop = {
    segmentOffsetTop: 0,
    contentOffsetTop: 0
  };
  public segmentValue: '商品' | '推荐' | '流程' = '商品';
  // 轮播图配置选项
  public slidesConfig = {
    show: false,
    initialSlide: 0,
    speed: 400,
    pagination: {
      clickable: false
    },
  };

  public goodsInfoData: any[];
  public goodsImg = [
    'http://attach.bbs.miui.com/forum/201304/25/195151szk8umd8or8fmfa5.jpg',
    'http://attach.bbs.miui.com/forum/201408/07/194456i55q58pqnb55fi88.jpg'
  ];
  public localStorageGoodsInfo: any[] = [];
  private scrollEnd = true;

  public goodsData: any = {};
  public record_id: string = '';
  public collect_info: any = {};
  public collect_status: boolean;

  
  public relatedGoods: any[] = [];// 推荐商品
  public sell_store_info: any = {};// 卖家店铺

  public isDisable = false;

  public prompt = false;

  public attr_cate: '';

  public ws_deposit: any;

  // 商品详情信息
  unsold_goods_detail() {
    this.gethttp.unsold_goods_detail({ record_id: this.record_id }).subscribe(res => {
      // console.log(res);
      this.goodsImg = JSON.parse(res.data1.picUrls);
      this.goodsInfoData = res.data3.concat(res.data2);
      this.goodsData = res.data1;
      this.attr_cate = res.data1.attr_cate;
      if(res.data1.attr_cate == '租号') {
        this.ws_deposit = res.data1.ws_deposit
      }else{
        this.ws_deposit = '';
      }
    })
  }
  // 发布者店铺
  sell_store() {
    this.gethttp.sell_store({ record_id: this.record_id }).subscribe(res => {
      console.log('res', res);
      this.sell_store_info = res;
      // 控制聊一聊按钮显隐
      if(this.sell_store_info['sell_user_id'] == this.GetCurrentUser.getCurrentUserId()){
        this.isDisable = true
      }
    })
    
  }
  // 商品相关推荐
  unsold_goods_related() {
    this.gethttp.unsold_goods_related().subscribe(res => {
      // console.log(res);
      this.relatedGoods = res;
    })
  }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(params => {
      this.record_id = params.id;
      this.localStorageGoodsInfo = JSON.parse(localStorage.getItem('goods') || '[]');
      this.collect_status = Boolean(this.localStorageGoodsInfo.find(item => item.id === params.id));
      console.log('this.collect_status', this.collect_status);
      this.unsold_goods_detail();
      this.unsold_goods_related();
      this.sell_store();
      // this.judge_collect();
      // this.changeDetectorRef.detectChanges();
      console.log(this.collect_status)
    })
  }

  ngAfterViewInit() {
    this.ionContent.ionScrollStart.subscribe(() => {
      this.scrollEnd = false;
    });
    this.ionContent.ionScrollEnd.subscribe(() => {
      this.scrollEnd = true;
    });
    this.ionContent.ionScroll.subscribe(scrollTop => {
      // 获取到 content 滚动的距离
      this.offsetTop.contentOffsetTop = scrollTop.detail.scrollTop;
      // 获取到 segment 距离头部的巨力
      if (!this.offsetTop.segmentOffsetTop || this.offsetTop.segmentOffsetTop === 0) {
        this.offsetTop.segmentOffsetTop = this.ionSegment.el.offsetTop;
      }
      // 滚动距离高度 - segment高度（此时的segment已经浮动）
      if (scrollTop.detail.scrollTop > this.process.el.offsetTop - this.ionSegment.el.offsetHeight) {
        this.segmentValue = '流程';
      } else if (scrollTop.detail.scrollTop > this.recommend.el.offsetTop - this.ionSegment.el.offsetHeight) {
        this.segmentValue = '推荐';
      } else if (scrollTop.detail.scrollTop > this.goodsInfo.el.offsetTop - this.ionSegment.el.offsetHeight) {
        this.segmentValue = '商品';
      }
    });
  }

  segmentChange({ detail }) {
    if (this.scrollEnd) {
      if (detail.value === '商品') {
        this.ionContent.scrollToPoint(null, this.goodsInfo.el.offsetTop - this.ionSegment.el.offsetHeight + 10, 400);
      } else if (detail.value === '推荐') {
        this.ionContent.scrollToPoint(null, this.recommend.el.offsetTop - this.ionSegment.el.offsetHeight + 10, 400);
      } else if (detail.value === '流程') {
        this.ionContent.scrollToPoint(null, this.process.el.offsetTop - this.ionSegment.el.offsetHeight + 10, 400);
      }
    }
  }

  goToLink(id, type) {
    switch (type) {
      case 'detail':
        this.scrollEnd = false;
        this.router.navigate(['/buyComponents/goodsDetail'], { queryParams: { id } })
        this.segmentValue = '商品';
        this.ionContent.scrollToTop();
        break;
      case 'purchaseConfirm':
        this.router.navigate(['/buyComponents/purchaseConfirm'], { queryParams: { id } })
        break;
      case 'communication':
        console.log(this.sell_store_info)
        this.router.navigate(['/buyComponents/communication'], { queryParams: { sellerId: this.sell_store_info['sell_user_id'] } })
        break;
      default:
        break;
    }
  }


  collectBtn() {
    console.log('this.collect_status', this.collect_status);
    this.collect_status = !this.collect_status; 
    console.log(this.localStorageGoodsInfo)
    const dataIndex = this.localStorageGoodsInfo.findIndex(item => item.id === this.record_id);
    if (this.collect_status && dataIndex === -1) {
      this.localStorageGoodsInfo.push({
        id: this.record_id,
        title: this.goodsData['goods_name'],
        logo: this.goodsImg[0],
        tags: [],
        price: this.goodsData['goods_price']
      });
    } else if (!this.collect_status && dataIndex !== -1) {
      this.localStorageGoodsInfo.splice(dataIndex, 1);
    }
    localStorage.setItem('goods', JSON.stringify(this.localStorageGoodsInfo));
    // this.judge_collect();
  }

  judge_collect() {
    this.collect_info = this.storage.getStorage('Collect') || [];
    const index = this.collect_info.findIndex(item => {
      return item.id == this.record_id
    })
    if (index != -1) {
      this.collect_status = true; 
    }else{
      this.collect_status = false;
    }
  }
}
