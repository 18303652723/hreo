import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, AlertController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss'],
})
export class SellComponent implements OnInit {

  constructor(
    private router: Router,
    private gethttp: GethttpdataService,
    private alertController: AlertController
  ) { }

  @ViewChild(IonSlides, { static: true }) ionSlides: IonSlides;

  public slidesConfig = {
    initialSlide: 0,
    speed: 400,
    followFinger: false,
    pagination: {
      clickable: false
    },
  };

  // public goodsSellType: any = [[
  //   { title: '游戏币', value: '游戏币', children: [
  //     { title: '金币【担保】', value: '金币【担保】' }
  //   ] },
  //   { title: '道具', value: '道具', children: [
  //     { title: '道具【担保】', value: '道具【担保】', link: '/home/buy' },
  //     { title: '黑莲花【担保】', value: '黑莲花【担保】', link: '/home/buy' },
  //     { title: '合剂【担保】', value: '合剂【担保】', link: '/home/buy' },
  //     { title: '材料【担保】', value: '材料【担保】', link: '/home/buy' },
  //     { title: '配方【担保】', value: '配方【担保】', link: '/home/buy' },
  //     { title: '药剂【担保】', value: '药剂【担保】', link: '/home/buy' },
  //     { title: '装备【担保】', value: '装备【担保】', link: '/home/buy' },
  //     { title: '坐骑【担保】', value: '坐骑【担保】', link: '/home/buy' },
  //     { title: '其他【担保】', value: '其他【担保】', link: '/home/buy' }
  //   ] },
  //   { title: '账号', value: '账号', children: [
  //     { title: '战网账号', value: '战网账号', children: [
  //       { title: '咖喱给给', value: '咖喱给给', children: [
  //         { title: '张三的咖喱烤肉', value: '张三的咖喱烤肉' }
  //       ] }
  //     ] }
  //   ] },
  //   { title: '代充', value: '代充', link: '/home/buy' },
  //   { title: '代练', value: '代练', link: '/home/buy' },
  //   { title: '礼包', value: '礼包', link: '/home/buy' }
  // ]];

  public goodsSellType = [];

  public f_cate_id = '';

  public goodsSellTypeTitle = '';


  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.goodsSellType.splice(1, this.goodsSellType.length);
      });
    this.gethttp.goods_model_category().subscribe(res => {
      this.goodsSellType[0] = res;
      console.log(res);
    });
  }

  typeChange(i: number) {
    console.log(this.goodsSellType)
    this.ionSlides.getActiveIndex().then(index => {
      console.log(index)
      if (index == 0) {
        // console.log(this.goodsSellType[index][i]);
        this.f_cate_id = this.goodsSellType[index][i]['id'];
      }
      if (index == 1) {
        this.goodsSellTypeTitle = this.goodsSellType[index][i]['title']
        console.log(this.goodsSellType[index][i]);
      }
      if (!(this.goodsSellType[index][i].children === this.goodsSellType[index + 1])) {
        this.goodsSellType.splice(index + 1, this.goodsSellType.length);
      }
      if (!this.goodsSellType[index][i].children || this.goodsSellType[index][i].children.length === 0) {
        return;
      }
      this.goodsSellType[index + 1] = this.goodsSellType[index][i].children;
      setTimeout(() => {
        this.ionSlides.slideNext();
      }, 100);
    });
  }


  goToLink(data,title) {
    var type_tilte = '';
    if(this.goodsSellTypeTitle) {
      type_tilte = this.goodsSellTypeTitle
    }else{
      type_tilte = title
    }
    if (type_tilte == '代练') {
      this.gethttp.getIsWhereas().subscribe((res: any) => {
        console.log(res)
        if (res.status == 1 && res.data.is_whereas == 0) {
          this.presentAlert()
          return 
        }else{
          this.router.navigate(['/sellComponents/account'], { queryParams: { cate_id: data.id, f_cate_id: this.f_cate_id, type_title: type_tilte } })
        }
      });
    }else{
      this.router.navigate(['/sellComponents/account'], { queryParams: { cate_id: data.id, f_cate_id: this.f_cate_id, type_title: type_tilte } })
    }
  }


  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: '申请代练资格',
      message: '点击前往申请认证',
      buttons: [{
        text: '暂不认证',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('暂不认证')
        }
      }, {
        text: '前往认证',
        handler: () => {
          this.router.navigate(['/personalComponents/ApplyWhereas'])
        }
      }]
    });

    await alert.present();
  }

}
