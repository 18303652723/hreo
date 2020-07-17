import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { GethttpdataService } from '@app/services/gethttpdata.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit {

  constructor(
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private gethttp: GethttpdataService
  ) { }

  public newmsgdata = [];

  public historymsgdata = [];

  public history_msg_show: Boolean = false;


  new_msg_list() {
    this.gethttp.new_msg_list().subscribe(res => {
      console.log(res)
      if (res) {
        if(res.new_msg.length == 0){
          this.history_msg_show = true
        }
        this.newmsgdata = res.new_msg;
        this.historymsgdata = res.history_msg;
        this.gethttp.msg_isread().subscribe(res => { });
      }
    })
  }

  msg_list_reply(id,reply,title) {
    this.gethttp.msg_list_reply({ id: id, reply: reply}).subscribe(res => {
      console.log(res);
      if(res) {
        var msg = '已回复' + title;
        this.toastMsg(msg, 'dark');
      }
    })
  }

  ngOnInit() {
    this.toastPresent();

    this.new_msg_list();
  }

  reply(id: string, title: string) {
    this.alertController.create({
      message: `回复 <b>${title}</b>`,
      inputs: [
        { name: 'reply', type: 'text', placeholder: '回复...' },
      ],
      buttons: [
        { text: '取消', role: 'cancel' },
        { text: '确认', handler: (({reply}) => {
          console.log('id:' + id, reply);
          this.msg_list_reply(id,reply,title);
        }).bind(this) }
      ]
    }).then(alert => {
      alert.present();
    });
  }

  async toastPresent() {
    const toast = await this.loadingController.create({
      message: '正在加载数据...'
    });
    toast.present();
    setTimeout(() => {
      toast.dismiss();
    }, 500);
  }

  toastMsg(message, color: 'danger' | 'dark') {
    this.toastController.create({
      message,
      color,
      duration: 1500
    }).then(toast => {
      toast.present();
    });
  }
}
