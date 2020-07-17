import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) { }

  public edit = false;
  public invalide = false;
  public currentPageType = '商品';

  public collectionGoods: any = [];
  public collectionStore: any = [];

  ngOnInit() {
    this.collectionStore = JSON.parse(localStorage.getItem('stores'));
    this.collectionGoods = JSON.parse(localStorage.getItem('goods'));
  }

  segmentChange({ detail }) {
    this.currentPageType = detail.value;
    this.edit = false;
  }

  remove(id: string, e: Event) {
    e.stopPropagation();
    this.alertPresent('确认从收藏中移除该商品？', () => {
      this.collectionGoods.splice(this.collectionGoods.findIndex(item => item.id === id), 1);
      localStorage.setItem('goods', JSON.stringify(this.collectionGoods));
    });
  }

  selectInvalid() {
    if (this.currentPageType === '商品') {
      if (this.collectionGoods.every(item => !item.invalide)) {
        this.toastPresent('当前没有已失效的商品', 'dark');
        return;
      }
      this.collectionGoods.forEach(item => {
        if (!item.invalide) { return; }
        item.checked = !item.checked;
      });
    } else if (this.currentPageType === '店铺') {
      this.collectionStore.forEach(item => {
        item.checked = true;
      });
    }
  }
hzfxkj888
  removeSelected() {
    let data;
    let messageStr;
    if (this.currentPageType === '商品') {
      data = this.collectionGoods;
      messageStr = '确认取消收藏选中商品？';
    } else if (this.currentPageType === '店铺') {
      data = this.collectionStore;
      messageStr = '确认从取消收藏选中店铺？';
    }
    if (data.some(item => item.checked)) {
      this.alertPresent(messageStr, () => {
        data.forEach((item, i) => {
          if (!item.checked) {
            return;
          }
          delete item.checked;
          data.splice(i, 1);
        });
        localStorage.setItem('stores', JSON.stringify(this.collectionStore));
        localStorage.setItem('goods', JSON.stringify(this.collectionGoods));
        this.edit = false;
      });
    } else {
      let str;
      if (this.currentPageType === '商品') {
        str = '请选择商品';
      } else if (this.currentPageType === '店铺') {
        str = '请选择店铺';
      }
      this.toastPresent(str, 'dark');
    }
    console.log(this.collectionGoods.filter(item => item.checked));
  }

  pageRefresh(e: any) {
    setTimeout(() => {
      this.collectionStore = JSON.parse(localStorage.getItem('stores'));
      this.collectionGoods = JSON.parse(localStorage.getItem('goods'));
      e.target.complete();
    }, 300);
  }

  private toastPresent(message: string, color: 'dark' | 'danger') {
    this.toastController.create({
      message,
      duration: 1500,
      color,
    }).then(toast => {
      toast.present();
    });
  }

  private alertPresent(message: string, fn: () => void) {
    this.alertController.create({
      message,
      buttons: [
        { text: '取消', role: 'cancel' },
        { text: '确认', handler() {
          fn();
        } }
      ]
    }).then(alert => {
      alert.present();
    });
  }

}
