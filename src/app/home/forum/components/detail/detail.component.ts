import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {

  constructor(
    private gethttp: GethttpdataService,
    private toastController: ToastController,
    private active: ActivatedRoute
  ) { }

  public forum_id = '';

  public forum_info: any = {};

  public content = '';

  public comment_data = [];

  public is_have_comment: Boolean = false;

  public slidesConfig = {
    show: false,
    initialSlide: 0,
    speed: 400,
    pagination: {
      clickable: false
    },
  };

  public goodsImg = [
  ];

  // 论坛详情
  forum_detail() {
    this.gethttp.forum_detail({ forum_id: this.forum_id }).subscribe(res => {
      // console.log(res);
      res.forum_url = JSON.parse(res.forum_url);
      this.forum_info = res;
    })
  }

  // 论坛评论列表
  forum_comment_list() {
    this.gethttp.forum_comment_list({ forum_id: this.forum_id }).subscribe(res => {
      console.log(res)
      this.comment_data = res;
      if (res.length != 0) {
        this.is_have_comment = true;
      } else {
        this.is_have_comment = false;
      }
    });
  }

  // 论坛评论
  forum_comment_submit() {
    this.gethttp.forum_comment_submit({ content: this.content, forum_id: this.forum_id }).subscribe(res => {
      // console.log(res);
      if (res) {
        this.forum_comment_list();
        this.toastPresent('发布论坛成功,待后台审核发布', 'dark');
        this.content = '';
      } else {
        this.toastPresent('发布论坛失败', 'danger');
      }
    })
  }

  // 论坛点赞
  forum_thumb_up() {
    this.gethttp.forum_thumb_up({ forum_id: this.forum_id }).subscribe(res => {
      // console.log(res)
      if(res.status == 0) {
        this.toastPresent('点赞取消 -1','danger');
      }else{
        this.toastPresent('点赞成功 +1','dark');
      }
    })
  }

  ngOnInit() {
    this.active.queryParams.subscribe(params => {
      this.forum_id = params.id;
      this.forum_detail();
      this.forum_comment_list();
    })
  }

  send() {
    console.log(this.content);
    if (!this.content) {
      this, this.toastPresent('未输入评论内容', 'danger');
      return;
    }
    this.forum_comment_submit();
  }

  thumbUp() {
    this.forum_thumb_up();
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
  
  slideshowbtn() {
    this.slidesConfig.show = true;
    this.goodsImg = this.forum_info.forum_url
  }
}
