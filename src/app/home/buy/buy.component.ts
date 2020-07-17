import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSegment, IonHeader, LoadingController } from '@ionic/angular';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss'],
})
export class BuyComponent implements OnInit {

  @ViewChild(IonHeader, { static: true }) ionHeader: IonHeader;
  @ViewChild(IonContent, { static: true }) ionContent: IonContent;
  @ViewChild(IonSegment, { static: true }) ionSegment: IonSegment | any;

  constructor(
    private gethttp: GethttpdataService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  // 商品列表数据源
  public data = [];

  public slideShow = {
    type: false,
    server: false,
    filter: false,
    sort: false,
    game: false,
    region: false
  };

  // 筛选数据源填充
  public queryData: any = {
    game: {
      parent: 0,
      data: [
        {
          title: '服务器',
          list: [
            // { title: '全部', value: '全部' },
            // { title: '皮肤赠送【担保】', value: '皮肤赠送【担保】' },
            // { title: '改名卡赠送【担保】', value: '改名卡赠送【担保】' },
          ]
        }
      ]
    },
    type: {
      parent: 0,
      data: [
        {
          title: '道具',
          list: [
            { title: '全部', value: '全部' }
          ]
        }
      ]
    },
    server: {
      parent: 0,
      data: [
        {
          title: '全部',
          list: [
            { title: '全部', value: '全部' },
          ]
        }
      ]
    },
    filter: {
      lowest: '',
      highest: '',
      priceRangeOptions: ['0-30', '30-100', '100-200', '200-500', '500-1000', '1000-3000', '3000以上'],
      // service: [
      //   { value: '找回包赔', label: '找回包赔' },
      //   { value: '已上传截图', label: '已上传截图' },
      //   { value: '账号转移', label: '账号转移' },
      //   { value: '已投保', label: '已投保' },
      //   { value: '协议保障', label: '协议保障' }
      // ],
      // auction: [
      //   { value: '支持拍卖', label: '支持拍卖' }
      // ]
    },
  };

  private tempQueryData: any;

  public search_title = '';

  public region_filter = 1;

  public sort_filter = 1;

  public game_filter = 1;

  public filterObject: any = {};

  public title_all = {
    game: { title1: '服务器', 'title1_id': '', title2: '', title2_id: '' },
    type: { title1: '商品类型', 'title1_id': '', title2: '', title2_id: '' }
  }

  public areaList = [];
  public area_id = '';
  public area_title = 'PC区服';

  // 区服接口
  area_list() {
    this.gethttp.area_list().subscribe(res => {
      console.log(res);
      this.areaList = res;
    })
  }

  // 游戏接口
  game_list() {
    this.gethttp.game_list({ area_id: this.area_id }).subscribe(res => {
      console.log(res);
      this.queryData.game.data = res;
    })
  }

  // 商品筛选接口
  goods_type_list() {
    this.gethttp.goods_type_list({ f_cate_id: this.area_id }).subscribe(res => {
      // console.log(res);
      this.queryData.type.data = res;
    })
  }

  async unsold_goods_list() {
    const loading = await this.loadingController.create({
      message: '正在加载...'
    });
    loading.present();
    this.goods_type_list();
    this.gethttp.unsold_goods_list({
      search_title: this.search_title,
      sort_filter: this.sort_filter,
      // region_filter: this.region_filter,
      filterObject: JSON.stringify(this.filterObject),
      title_all: JSON.stringify(this.title_all),
      area_id: this.area_id
    }).subscribe(res => {
      console.log(res);
      loading.dismiss();
      this.data = res;
      this.data.forEach(item => {
        item.type = item.Parent[1].title;
      });

      this.ionContent.scrollToTop();
    })
  }

  ngOnInit() {
    this.tempQueryData = JSON.parse(JSON.stringify(this.queryData));
    // console.log(this.tempQueryData === this.queryData);
    
    this.area_list();
    this.goods_type_list();
    this.unsold_goods_list();
  }


  filterSelectionChange(i: number, type: string) {
    if(type == 'region') {
      this.area_id = this.areaList[i]['id'];
      console.log(this.area_id);
      this.area_title = this.areaList[i]['title'];
      this.game_list();
      
      this.queryData.game.parent = 0
      this.queryData.type.parent = 0
      this.title_all = {
        game: { title1: '服务器', 'title1_id': '', title2: '', title2_id: '' },
        type: { title1: '商品类型', 'title1_id': '', title2: '', title2_id: '' }
      }
    } else {
      this.queryData.type.parent = 0
      this.title_all.type = { title1: '商品类型', 'title1_id': '', title2: '', title2_id: '' }
      // console.log(this.queryData[type]['data'][i]['title'])
      this.queryData[type].parent = i
  
      this.queryData[type]['data'].forEach(item => {
        item['list'].forEach(item2 => {
          delete item2.selected;
        });
      });
      this.title_all[type]['title1'] = this.queryData[type]['data'][i]['title']
      if (this.queryData[type]['data'][i]['title'] != '全部') {
        this.title_all[type]['title1'] = this.queryData[type]['data'][i]['title']
        this.title_all[type]['title1_id'] = this.queryData[type]['data'][i]['id']
        this.title_all[type]['title2'] = ''
        this.title_all[type]['title2_id'] = ''
      } else {
        if (type == 'type') {
          this.title_all[type]['title1'] = '商品类型'
        } else {
          this.title_all[type]['title1'] = '服务器'
        }
        this.title_all[type]['title1_id'] = ''
        this.title_all[type]['title2'] = ''
        this.title_all[type]['title2_id'] = ''
      }
    }
    this.unsold_goods_list();
  }

  filterChildSelectionChange(i: number, type: string) {
    const parent = this.queryData[type].parent;
    let data;
    this.queryData[type].data[parent].list.forEach((item: any, index: number) => {
      delete item.selected;
      if (index === i) {
        item.selected = true;
        data = item;
      }
    });
    // console.log(type)
    // console.log(data);
    // console.log(data.title);
    if (data.title != '全部') {
      this.title_all[type]['title2'] = data.title;
      this.title_all[type]['title2_id'] = data.id;
    } else {
      this.title_all[type]['title2'] = '';
      this.title_all[type]['title2_id'] = '';
    }
    this.QuerySlideStatusChange();
    this.unsold_goods_list();
  }

  fillPriceRange(range: string) {
    const rangeArr = range.split('-');
    if (rangeArr[1]) {
      this.queryData.filter.lowest = parseInt(rangeArr[0]);
      this.queryData.filter.highest = parseInt(rangeArr[1]);
    } else {
      this.queryData.filter.lowest = parseInt(rangeArr[0]);
      this.queryData.filter.highest = '';
    }
  }

  resetFilter() {
    this.queryData.filter.lowest = '';
    this.queryData.filter.highest = '';
    // this.queryData.filter.service = JSON.parse(JSON.stringify(this.tempQueryData.filter.service));
    // this.queryData.filter.auction = JSON.parse(JSON.stringify(this.tempQueryData.filter.auction));
  }

  confirmFilter() {
    this.filterObject.low_price = this.queryData.filter.lowest;
    this.filterObject.high_price = this.queryData.filter.highest;
    // this.filterObject.service = this.queryData.filter.service.filter(item => item.selected);
    // this.filterObject.auction = this.queryData.filter.auction.filter(item => item.selected);
    console.log(this.filterObject);
    this.QuerySlideStatusChange();

    this.unsold_goods_list();
  }

  QuerySlideStatusChange(type?: 'game' | 'type' | 'server' | 'filter' | 'sort' | 'region') {
    if (type && this.slideShow[type]) {
      this.slideShow[type] = false;
    } else if (type) {
      for (const key in this.slideShow) {
        if (!(this.slideShow.hasOwnProperty(key))) { continue; }
        this.slideShow[key] = false;
      }
      this.slideShow[type] = true;
    } else {
      for (const key in this.slideShow) {
        if (!(this.slideShow.hasOwnProperty(key))) { continue; }
        this.slideShow[key] = false;
      }
    }
  }
  regionServerChange({ detail }) {
    this.QuerySlideStatusChange();
    console.log(detail.value);
    this.region_filter = detail.value;
    this.unsold_goods_list();
  }

  sortStatusChange({ detail }) {
    this.QuerySlideStatusChange();
    console.log(detail.value);
    this.sort_filter = detail.value;
    this.unsold_goods_list();
  }

  gameChange({ detail }) {
    this.QuerySlideStatusChange();
    console.log(detail.value);
    this.game_filter = detail.value
    this.unsold_goods_list();
  }

  // 数据刷新
  pageRefresh(event: any) {
    event.target.complete();
    this.unsold_goods_list();
  }

  // 下拉加载数据
  loadData(event: any) {
    setTimeout(() => {
      event.target.complete();
    }, 500);
  }

  goToGoodsDetail(id) {
    // console.log(id)
    this.router.navigate(['/buyComponents/goodsDetail'], { queryParams: { id } })
  }
}
