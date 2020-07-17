import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-interaction',
  templateUrl: './interaction.component.html',
  styleUrls: ['./interaction.component.scss'],
})
export class InteractionComponent implements OnInit {

  constructor() { }

  public data = [
    {
      id: '000151',
      avatar: 'http://img4.imgtn.bdimg.com/it/u=1224179288,4154333226&fm=26&gp=0.jpg',
      nickname: '啊哈呵发',
      time: '昨天 19:30',
      type: '评论'
    }, {
      id: '000156',
      avatar: 'http://img1.imgtn.bdimg.com/it/u=3767853615,1812532226&fm=26&gp=0.jpg',
      nickname: '我那个的发',
      time: '昨天 19:30',
      type: '赞'
    },
  ];

  ngOnInit() {}

}
