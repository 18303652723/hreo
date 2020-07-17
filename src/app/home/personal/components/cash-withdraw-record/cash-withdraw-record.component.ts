import { Component, OnInit } from '@angular/core';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-cash-withdraw-record',
  templateUrl: './cash-withdraw-record.component.html',
  styleUrls: ['./cash-withdraw-record.component.scss'],
})
export class CashWithdrawRecordComponent implements OnInit {

  constructor(
    private gethttpdataService: GethttpdataService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) { }

  public data = [];

  ngOnInit() {}

  async ionViewDidEnter() {
    const loading = await this.loadingController.create();
    loading.present();
    this.getData().then(() => {
      loading.dismiss();
    });
  }

  refresh(event) {
    this.getData().then(() => {
      event.target.complete();
    });
  }

  getData() {
    return new Promise((reslove, resject) => {
      this.gethttpdataService.getCashWithdrawRecord().subscribe((res: any) => {
        reslove(res);
        if (res.status === 1) {
          this.data = res.data;
        } else {
          this.toastController.create({
            message: res.msg,
            color: 'danger',
            duration: 1500
          }).then(toast => {
            toast.present();
          });
        }
      });
    });
  }

}
