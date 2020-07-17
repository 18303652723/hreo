import { Component, OnInit } from '@angular/core';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss'],
})
export class ForumComponent implements OnInit {

  constructor(
    private gethttp: GethttpdataService,
    private router: Router
  ) {

  }

  public searchKey: string = '';

  public currentTab = 0;

  public forum_data: any = [];

  public notice_label: Boolean = false;

  public classifyList = [];

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
  
  // 新消息提醒
  new_msg_list() {
    this.gethttp.new_msg_list().subscribe(res => {
      console.log(res)
      if (res.new_msg.length != 0) {
        this.notice_label = true;
      } else {
        this.notice_label = false;
      }
    })
  }
  // 论坛列表
  forum_list() {
    this.gethttp.forum_list({ type: this.currentTab, searchKey: this.searchKey }).subscribe(res => {
      console.log(res)
      res.forEach(item => {
        if (item.forum_url) {
          item.forum_urls = JSON.parse(item.forum_url);
        }
      });
      this.forum_data = res;
    })
  }
  // 论坛点赞
  forum_thumb_up(forum_id) {
    this.gethttp.forum_thumb_up({ forum_id: forum_id }).subscribe(res => {
      // console.log(res)
      if (res.status == 0) {
        this.forum_data.forEach(item => {
          if (item.id == forum_id) {
            item.thumb_up_count -= 1
          }
        });
      } else {
        this.forum_data.forEach(item => {
          if (item.id == forum_id) {
            item.thumb_up_count += 1
          }
        });
      }
    })
  }
  // 论坛分类列表
  forum_share_classify() {
    this.gethttp.forum_share_classify().subscribe(res => {
      console.log('论坛分类列表:',res);
      this.classifyList = res
    })
  }

  ngOnInit() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.forum_list();
        this.new_msg_list();
        this.forum_share_classify();
      })
  }

  currentTabBtn(type) {
    this.currentTab = type;
    this.forum_list();
  }

  thumb_up_opt(id) {
    this.forum_thumb_up(id);
  }

  searchBtn() {
    this.forum_list();
  }
  
  slideshowbtn(imgs) {
    this.slidesConfig.show = true;
    this.goodsImg = imgs
  }
}
