import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, LoadingController } from '@ionic/angular';
import { DealSecurityComponent } from 'src/app/terms/deal-security/deal-security.component';
import { Router, ActivatedRoute } from '@angular/router';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { ModalComponent } from '@app/modal/modal.component';
import { JsonPipe } from '@angular/common';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  constructor(
    private router: Router,
    private modalController: ModalController,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private activeRouter: ActivatedRoute,
    private gethttp: GethttpdataService,
    private http: HttpClient
  ) { }

  public selectedImgSrc = [];

  public formDataLayout = [
    {
      type: 'uploadPicture',
      label: '发布图片（最多9张）'
    }, {
      type: 'description',
      label: '填写商品描述',
      items: []
      // items: [
      //   {
      //     type: 'text',
      //     value: 'goods_name',
      //     label: '商品名称',
      //     required: true
      //   }, {
      //     type: 'number',
      //     value: 'goods_price',
      //     label: '商品价格',
      //     required: true
      //   }, {
      //     type: 'select',
      //     value: '服务器',
      //     label: '服务器',
      //     required: true,
      //     options: [
      //       { value: '赛雷步拉丝', label: '赛雷步拉丝' },
      //       { value: '诺克塞恩', label: '诺克塞恩' },
      //       { value: '雷德', label: '雷德' },
      //       { value: '娅尔罗', label: '娅尔罗' },
      //       { value: '阿什坎迪', label: '阿什坎迪' }
      //     ]
      //   }, {
      //     type: 'select',
      //     value: '阵营',
      //     label: '阵营',
      //     options: [
      //       { value: '部落', label: '部落' },
      //       { value: '兽人', label: '兽人' }
      //     ]
      //   }, {
      //     type: 'multiple',
      //     value: '账号绑定',
      //     label: '账号绑定',
      //     required: true,
      //     options: [
      //       { value: '密保手机', label: '密保手机' },
      //       { value: '密保邮箱', label: '密保邮箱' },
      //       { value: '密保问题', label: '密保问题' },
      //       { value: '密保QQ', label: '密保QQ' },
      //       { value: '身份证', label: '身份证' },
      //       { value: '无绑定', label: '无绑定' }
      //     ]
      //   }
      // ]
    }
  ];

  // public serviceGuarantee: any = [
  //   { value: '找回包赔', label: '找回包赔' },
  //   { value: '已上传截图', label: '已上传截图' },
  //   { value: '账号转移', label: '账号转移' },
  //   { value: '已投保', label: '已投保' },
  //   { value: '协议保障', label: '协议保障' },
  // ];

  public formData: any = {
    insurance: '60天保险',
    agreedTerm: false,
    cate_id: '',
    field_id: '',
    picUrls: [],
  };

  public moreInfo = false;

  public agreementList = { }
  public prompt = false;
  public order_finished = false;

  /**
   * 判断是否有代练单子未完成
   */
  uncompleted_list() {
    const params = {}
    this.gethttp.uncompleted_list(params).subscribe(res => {
      console.log(res);
      this.order_finished = res;
    })
  }

  goods_model_field() {
    const params = { cate_id: this.formData.field_id,f_cate_id: this.formData.f_cate_id };
    this.gethttp.goods_model_field(params).subscribe(res => {
      res.forEach(item => {
        if (!item.is_default) return;
        item.is_default = JSON.parse(item.is_default);
      });
      console.log(res);
      this.formDataLayout[1]['items'] = res;
    })
  }

  get_agreement_list() {
     this.gethttp.agreement_list().subscribe(res => {
       console.log(res);
       this.agreementList = res.find(item => item.agreement_title == '安全交易险')
       console.log(this.agreementList);
     })
  }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(params => {
      this.formData.cate_id = params.cate_id;
      this.formData.field_id = params.cate_id;
      this.formData.f_cate_id = params.f_cate_id;
      
      if(['账号','租号','代练'].indexOf(params.type_title) > -1 ) {
        console.log(123)
        this.moreInfo = true;
      }else{
        console.log(234)
        this.moreInfo = false;
      }
      this.goods_model_field();
      this.get_agreement_list();
      if(params.type_title == '代练') {
        this.uncompleted_list();
      }
    })
  }

  public async modalPresent({ description, title, options }) {
    const modal = this.modalController.create({
      component: ModalComponent,
      componentProps: {
        title: description,
        data: {
          type: title,
          data: options
        }
      }
    });
    (await modal).present();
    const { data } = await (await modal).onDidDismiss();
    console.log(data);
    if (data) {
      this.formData[data.type] = data.data;
      console.log(this.formData)
    }
  }

  uploadImg(event: any) {
    if(this.formData.picUrls.length > 8) {
      this.toastPresent('发布最多9张', 'danger');
      return;
    }
    console.log(this.formData.picUrls)
    const file: FileList = event.target.files;
    if (file.length <= 0) {
      console.log('用户取消选择文件');
      return;
    }
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < file.length; i++) {
      if (!(['jpeg', 'jpg', 'png'].indexOf(file[i].type.split('/')[1]) < 0)) {
        this.pushImgInArray(file[i]);
        continue;
      }
      this.toastPresent('请选择.jpeg .jpg格式的图片', 'danger');
      return;
    }
    const formData = new FormData();
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < file.length; i++) {
      formData.append('file', file[i]);
      this.http.post('uploadPicture', formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe((ev: any) => {
        // Via this API, you get access to the raw event stream.
        // Look for upload progress events.
        console.log(ev);
        if (ev.body) {
          this.formData.picUrls.push(ev.body.url);
          console.log(this.formData);
        }
        if (ev.type === HttpEventType.UploadProgress) {
          // This is an upload progress event. Compute and show the % done:
          const percentDone = Math.round(100 * ev.loaded / ev.total);
          console.log(`File is ${percentDone}% uploaded.`);
        } else if (ev instanceof HttpResponse) {
          console.log('File is completely uploaded!');
        }
      });
    }
  }

  private pushImgInArray(file: File) {
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (ev: any) => {
      this.selectedImgSrc.push({
        progress: 0,
        src: ev.target.result
      });
    };
  }

  checkDealSecurity() {
    this.modalController.create({
      component: DealSecurityComponent,
      componentProps: {
        'data': JSON.stringify(this.agreementList),
        'title': '安全交易险',
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

  next() {
    if(this.order_finished) {
      this.toastPresent('您有未完成的代练单子','danger');
      return;
    }
    // 上传图片判断
    if (this.formData.picUrls.length === 0) {
      this.toastPresent('至少上传一张图片', 'danger');
      return;
    }
    // 商品必填信息判断
    var data = this.formDataLayout[1]['items'].filter(item => item.required == 1 && !item.secret_bdma && item.secret_bdma != '1')
    var mandatory_info = true;
    data.forEach(item => {
      if (!this.formData[item.title]) {
        var remind = item.description + '未选择或填写';
        this.toastPresent(remind, 'danger');
        mandatory_info = false;
      }
    });
    if (!mandatory_info) return;
    // 认真阅读文件判断
    if (!this.formData.agreedTerm) {
      this.toastPresent('请认真阅读并同意《交易安全险》', 'danger');
      return;
    }
    console.log(this.formData);
    this.router.navigate(['/sellComponents/accountInfoPerfect'], { queryParams: { goods_data: JSON.stringify(this.formData) } });
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

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  submit() {
    if(this.order_finished) {
      this.toastPresent('您有未完成的代练单子或者有未确认的代练单子，请联系客服', 'danger');
      return;
    }
    console.log('提交总数据', this.formData);
    // return;
    const params = { data: JSON.stringify(this.formData) };


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
