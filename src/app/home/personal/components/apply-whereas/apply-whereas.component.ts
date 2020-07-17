import { Component, OnInit } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import wx from 'src/typings';
import { AuthenticationService } from '@app/_services';

@Component({
  selector: 'app-apply-whereas',
  templateUrl: './apply-whereas.component.html',
  styleUrls: ['./apply-whereas.component.scss'],
})
export class ApplyWhereasComponent implements OnInit {

  constructor(
    private gethttpdataService: GethttpdataService,
    private toastController: ToastController,
    public alertController: AlertController,
    private auth: AuthenticationService
  ) { }

  price = '500';
  is_whereas = 0;

  ngOnInit() {
    this.getWhereasInfo();
  }

  optbtn() {
    var name = '1';
    var obj = { name : '2', getname: function(){
      return this.name
    } }
    var test = obj.getname.bind(obj);
    console.log(test())
  }


  getWhereasInfo() {
    this.gethttpdataService.getIsWhereas().pipe(filter((res: any) => res.status === 1))
    .subscribe(res => {
      console.log(res);
      this.price = res.data.cash_deposit
      this.is_whereas = Number(res.data.is_whereas)
    });
  }

  applyOpen() {
    wx.miniProgram.navigateTo({
      url: `/page/paydetail/paydetail?id=${this.auth.currentUserValue.data.id}&price=${this.price}`
    });
    // this.gethttpdataService.applyOpen().pipe(filter((res: any) => res.status === 1))
    // .subscribe(res => {
    //   console.log(res);
    //   this.toastPresent(res.msg,'dark');
    //   this.getWhereasInfo();
    // })
  }

  applyReturn() {
    this.gethttpdataService.applyReturn().subscribe((res: any) => {
      if(res.status === 1) {
        this.toastPresent(res.msg,'dark');
        this.getWhereasInfo();
      }else{
        this.toastPresent(res.msg,'danger');
      }
    })
  }


  applyBtnOpt(type) {
    if(type == 'open') {
      this.presentAlertConfirm('申请开通','是否申请开通？',type);
    }else{
      this.presentAlertConfirm('回退押金','是否回退押金？',type);
    }
  }

  toastPresent(message, color: 'danger' | 'dark') {
    this.toastController.create({
      message,
      color,
      duration: 1500
    }).then(toast => {
      toast.present();
    });
  }

  async presentAlertConfirm(header,message,type: 'open' | 'return') {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: '取消',
          role: '取消',
          cssClass: 'secondary',
          handler: () => {
            console.log('取消回退');
          }
        }, {
          text: '确定',
          handler: () => {
            if(type == 'open') {
              this.applyOpen();
            }else{
              this.applyReturn();
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
