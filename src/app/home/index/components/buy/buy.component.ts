import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, IonSegment, IonHeader, LoadingController } from '@ionic/angular';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from '@app/services/storage.service';

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
    private activeRouter: ActivatedRoute,
    private gethttp: GethttpdataService,
		private storage: StorageService,
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
    },
  };

  public search_title = '';

  public region_filter = 1;

  public sort_filter = 1;

  public game_filter = 1;

  public filterObject: any = {};

  public title_all = {
    game: { title1: '游戏', 'title1_id': '', title2: '', title2_id: '' },
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
        this.area_title = res[0].title;
        this.region_filter = res[0].id;
      })
    }

  private async loadingPresent() {
    return await this.loadingController.create({
      message: '正在加载...'
    });
  }

  async ionViewDidEnter() {
    const loading = await this.loadingPresent();
    loading.present()
    this.gethttp.intention_category(this.storage.getStorage('intention_data')).subscribe(response => {
      loading.dismiss()
      console.log(response)
      this.area_title = response.f_cate_info.title
      this.area_id = response.f_cate_info.id
      this.area_list();
      this.game_list();
      this.goods_type_list();
      this.unsold_goods_list();
    })
  }

  // 游戏接口
  async game_list() {
    const loading = await this.loadingPresent();
    loading.present()
    this.gethttp.game_list({  area_id: this.area_id  }).subscribe(res => {
      loading.dismiss()
      // console.log(res);
      this.queryData.game.data = res;
    })
  }

  // 商品筛选接口
  async goods_type_list() {
    const loading = await this.loadingPresent();
    loading.present()
    this.gethttp.goods_type_list({ f_cate_id: this.area_id }).subscribe(res => {
      loading.dismiss()
    // console.log(res);
      this.queryData.type.data = res;
    })
  }

  unsold_goods_list() {
    this.goods_type_list();
    this.gethttp.unsold_goods_list({ search_title: this.search_title, sort_filter: this.sort_filter, filterObject: JSON.stringify(this.filterObject), title_all: JSON.stringify(this.title_all) }).subscribe(res => {
      console.log(res);
      this.data = res;
      this.data.forEach(item => {
        item.type = item.Parent[1].title;
      })

      this.ionContent.scrollToTop();
    })
  }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(params => {
      this.title_all.type.title1 = params.title;
      this.title_all.type.title1_id = params.id;
    })
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
    }else{
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
          this.title_all[type]['title1'] = '游戏'
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
  }

  confirmFilter() {
    this.filterObject.low_price = this.queryData.filter.lowest;
    this.filterObject.high_price = this.queryData.filter.highest;
    console.log(this.filterObject);
    this.QuerySlideStatusChange();

    this.unsold_goods_list();
  }

  QuerySlideStatusChange(type?: 'game' | 'type' | 'server' | 'filter' | 'sort' | 'region') {
    if (type && this.slideShow[type]) {
      this.slideShow[type] = false;
    } else if (type) {
      this.slideShow.game = this.slideShow.type = this.slideShow.server = this.slideShow.filter = this.slideShow.sort = this.slideShow.region = false;
      this.slideShow[type] = true;
    } else {
      this.slideShow.game = this.slideShow.type = this.slideShow.server = this.slideShow.filter = this.slideShow.sort = this.slideShow.region = false;
    }
    console.log(this.slideShow.region)
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
    this.sort_filter = detail.value
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
    setTimeout(() => {
      event.target.complete();
      this.unsold_goods_list();
    }, 1000);
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
