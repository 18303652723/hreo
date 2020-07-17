import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { LoadingController, ToastController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';
import { DealSecurityComponent } from '@app/terms/deal-security/deal-security.component';

@Component({
  selector: 'app-account-info-perfect',
  templateUrl: './account-info-perfect.component.html',
  styleUrls: ['./account-info-perfect.component.scss'],
})
export class AccountInfoPerfectComponent implements OnInit {

  constructor(
    private activeRouter: ActivatedRoute,
    private gethttp: GethttpdataService,
    public toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
		private GetCurrentUser: GetCurrentUser,
    private modalController: ModalController,
  ) { }

  public formData: any = {

  };

  public goods_data: any = {};

  public formDataLayout = [
  ];

  public agreementList = {}

  goods_model_field() {
    const params = { cate_id: this.goods_data.field_id,f_cate_id: this.goods_data.f_cate_id };
    this.gethttp.goods_model_field(params).subscribe(res => {
      res.forEach(item => {
        if (!item.is_default) return;
        item.is_default = JSON.parse(item.is_default);
      });
      console.log(res);
      this.formDataLayout = res;
    })
  }

  get_agreement_list() {
    this.gethttp.agreement_list().subscribe(res => {
      console.log(res);
      this.agreementList = res.find(item => item.agreement_title == '卖家出售协议')
      console.log(this.agreementList);
    })
 }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(params => {
      this.goods_data = JSON.parse(params.goods_data);
      this.goods_data.picUrls = JSON.stringify(this.goods_data.picUrls);
      console.log(this.goods_data);
      this.goods_model_field();
      this.get_agreement_list();
    })
  }

  checkDealSecurity() {
    this.modalController.create({
      component: DealSecurityComponent,
      componentProps: {
        'data': JSON.stringify(this.agreementList),
        'title': '卖家出售协议'
      }
    }).then(popover => {
      popover.present();
    });
  }

  multipleStatusChange(item: any, type: string) {
    item.selected = !item.selected;
    if (item.selected) {
      if (!this.formData[type] || Object.prototype.toString.call(this.formData[type]).indexOf('Array') === -1) {
        this.formData[type] = [];
      }
      this.formData[type].push(item);
    } else {
      const index = this.formData[type].findIndex(ele => item.title === ele.title);
      this.formData[type].splice(index, 1);
    }
    console.log(item);
  }

  submit() {
    this.formData.seller_id = this.GetCurrentUser.getCurrentUserId();
    var data = { ...this.formData, ...this.goods_data };
    console.log('提交总数据', data);
    // return;
    const params = { data: JSON.stringify(data) };


    this.loadingController.create({
      message: '正在保存，请稍候...'
    }).then(loading => {
      loading.present();
      this.gethttp.user_sell_opt(params).subscribe((res: any) => {
        console.log(res);
        if (res) {
          setTimeout(() => {
            loading.dismiss();
            this.router.navigate(['/home/sell']);
            this.toastController.create({
              message: '保存成功',
              duration: 1000,
              color: 'dark',
              mode: 'ios'
            }).then(toast => {
              toast.present();
            });
          }, 1000);
        } else {
          setTimeout(() => {
            loading.dismiss();
            this.toastController.create({
              message: '保存失败',
              duration: 1000,
              color: 'dark',
              mode: 'ios'
            }).then(toast => {
              toast.present();
            });
          }, 1000);
        }
      })
    });
  }

}
