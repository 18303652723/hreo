import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastController: ToastController,
    private gethttp: GethttpdataService
  ) { }

  public uploadPicture = { type: 'uploadPicture', label: '发布图片（最多9张）', maxAmount: 8 };
  public selectedImgSrc = [];

  public forumData = {
    picUrls: [],
    content: '',
    shareType: ''
  };

  public classifyList = [];

  // 发布论坛
  forum_submit() {
    this.gethttp.forum_submit({ forumData: JSON.stringify(this.forumData) }).subscribe(res => {
      console.log(res);
      if(res) {
        this.toastPresent('发布论坛成功,请等待后台审核', 'dark');
        setTimeout(() => {
          this.router.navigate(['/home/forum']);
        }, 400);
      }else{
        this.toastPresent('发布论坛失败', 'danger');
      }
    })
  }

  // 论坛分类列表
  forum_share_classify() {
    this.gethttp.forum_share_classify().subscribe(res => {
      this.classifyList = res
      console.log('论坛分类列表:',this.classifyList);
    })
  }

  ngOnInit() {
    this.forum_share_classify();
  }

  uploadImg(event: any) { 
    if(this.forumData.picUrls.length > this.uploadPicture.maxAmount) {
      this.toastPresent('发布最多9张', 'danger');
      return;
    }
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
        console.log(ev.body);
        if (ev.body) {
          this.forumData.picUrls.push(ev.body.url);
          console.log(this.forumData);
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

  toastPresent(message, color: 'danger' | 'dark') {
    this.toastController.create({
      message,
      color,
      duration: 1500
    }).then(toast => {
      toast.present();
    });
  }

  makeSure() {
    if(this.forumData.picUrls.length == 0 && !this.forumData.content) {
      this.toastPresent('内容或者图片至少填写一样','danger');
      return;
    }
    console.log(this.forumData)
    this.forum_submit();
  }
}
