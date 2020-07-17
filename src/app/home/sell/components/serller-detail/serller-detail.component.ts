import { Component, OnInit } from '@angular/core';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '@app/services/storage.service';

@Component({
  selector: 'app-serller-detail',
  templateUrl: './serller-detail.component.html',
  styleUrls: ['./serller-detail.component.scss'],
})
export class SerllerDetailComponent implements OnInit {

  constructor(
    private activeRouter: ActivatedRoute,
    private gethttp: GethttpdataService,
    private storage: StorageService
  ) { }

  public user_id = '';
  public sell_user_info: any = {};
  public sell_goods_info: any[] = [];

  public collect_status: Boolean = false;
  public CollectStore_info: any[] = [];

  goods_store() {
    this.gethttp.goods_store({ user_id: this.user_id }).subscribe(res => {
      console.log(res)
      this.sell_user_info = res.sell_user_info
      this.sell_goods_info = res.sell_goods_info
    })
  }
  
  ngOnInit() {
    this.activeRouter.queryParams.subscribe(params => {
      this.user_id = params.user_id;
      this.goods_store();
      // this.judge_collect();
      this.CollectStore_info = JSON.parse(localStorage.getItem('stores') || '[]');
      this.collect_status = Boolean(this.CollectStore_info.find(item => item.id === this.user_id));
    })
  }


  collectBtn() {
    this.collect_status = !this.collect_status;
    const dataIndex = this.CollectStore_info.findIndex(item => item.id === this.user_id);
    if (this.collect_status && dataIndex === -1) {
      this.CollectStore_info.push({id: this.user_id, title: this.sell_user_info.sell_user_name});
    } else if (!this.collect_status && dataIndex !== -1) {
      this.CollectStore_info.splice(dataIndex, 1);
    }
    localStorage.setItem('stores', JSON.stringify(this.CollectStore_info));
  }

  judge_collect() {
    this.CollectStore_info = this.storage.getStorage('CollectStore') || [];
    const index = this.CollectStore_info.findIndex(item => {
      return item.id == this.user_id
    })
    if (index != -1) {
      this.collect_status = true; 
    }else{
      this.collect_status = false;
    }
  }
}
