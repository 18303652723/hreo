import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-interaction-detail',
  templateUrl: './interaction-detail.component.html',
  styleUrls: ['./interaction-detail.component.scss'],
})
export class InteractionDetailComponent implements OnInit {

  constructor(
    private active: ActivatedRoute
  ) { }

  public title: string;

  ngOnInit() {
    this.active.queryParamMap.subscribe(queryMap => {
      this.title = queryMap.get('type');
    });
  }

}
