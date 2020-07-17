import { Component, OnInit } from '@angular/core';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-apply-cash-withdraw',
  templateUrl: './apply-cash-withdraw.component.html',
  styleUrls: ['./apply-cash-withdraw.component.scss'],
})
export class ApplyCashWithdrawComponent implements OnInit {

  constructor(
    private gethttpdataService: GethttpdataService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router
  ) { }

  public type: '1' | '2' = '1';

  public price: number;
  public balance = '0.00';

  public wechat = {
    qrcodeUrl: '',
    wechatAccount: ''
  };

  public bankAccount = {
    bank: '',
    account: '',
    name: ''
  };

  ngOnInit() {
    this.gethttpdataService.getCashWithdrawPrice().pipe(filter((res: any) => res.status === 1))
    .subscribe(res => {
      this.balance = (res.data[0].money).toString();
      console.log(res.data[0].money);
    });
  }

  uploadFile(event) {
    const file = event.target.files[0];
    if (file.length === 0 || !file) { return; }
    this.gethttpdataService.uoloadFile(event.target.files[0]).subscribe((res: any) => {
      if (res.status === 1) {
        this.toastPresent('图片上传成功');
        this.wechat.qrcodeUrl = res.url;
      } else {
        this.toastPresent(res.info, 'danger');
      }
    });
  }

  async submit() {
    const loading = await this.loadingController.create();
    if (this.type === '1') {
      const text = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
      if (!this.wechat.wechatAccount) {
        this.toastPresent('请输入微信账号', 'danger');
        return;
      } else if (!this.wechat.qrcodeUrl) {
        this.toastPresent('请上传微信收款二维码', 'danger');
        return;
      }
      console.log(this.wechat);
      loading.present();
      this.gethttpdataService.applyCashWithdrawWechat(this.wechat.wechatAccount, this.price, this.wechat.qrcodeUrl)
      .subscribe((res: any) => {
        if (res.status === 1) {
          this.toastPresent('申请提现成功');
          setTimeout(() => {
            loading.dismiss();
            this.router.navigate(['/personalComponents/cashWithdrawRecord']);
          }, 500);
        } else {
          loading.dismiss();
          this.toastPresent(res.msg, 'danger');
        }
      });
    } else if (this.type === '2') {
      if (!(this.bankAccount.bank).toString()) {
        this.toastPresent('请输入开户银行', 'danger');
        return;
      } else if (!(this.bankAccount.account).toString()) {
        this.toastPresent('请输入开户卡号', 'danger');
        return;
      } else if (!(this.bankAccount.name).toString()) {
        this.toastPresent('请输入开户姓名', 'danger');
        return;
      }
      console.log((this.bankAccount.bank).toString(), (this.bankAccount.account).toString(), (this.bankAccount.name).toString())
      console.log(this.price)
      return;
      this.gethttpdataService.applyCashWithdrawBank(this.bankAccount.bank, this.bankAccount.account, this.bankAccount.name)
      .subscribe((res: any) => {
        if (res.status === 1) {
          this.toastPresent('申请提现成功');
          setTimeout(() => {
            loading.dismiss();
            this.router.navigate(['/personalComponents/cashWithdrawRecord']);
          }, 500);
        } else {
          loading.dismiss();
          this.toastPresent(res.msg, 'danger');
        }
      });
    }
  }

  inputVal(obj: 'bankAccount' | 'wechat', type: string, event) {
    this[obj][type] = (event.target.value).toString();
  }

  private toastPresent(message: string, color: 'dark' | 'danger' = 'dark') {
    this.toastController.create({
      message,
      color,
      duration: 1500
    }).then(toast => {
      toast.present();
    });
  }

}
