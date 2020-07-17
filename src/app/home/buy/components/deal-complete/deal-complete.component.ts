import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-deal-complete',
  templateUrl: './deal-complete.component.html',
  styleUrls: ['./deal-complete.component.scss'],
})
export class DealCompleteComponent implements OnInit {

  constructor(
    public nav: NavController
  ) { }

  

  ngOnInit() {}

  back() {
    this.nav.navigateBack('/home/buy');
  }
}
