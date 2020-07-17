import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-deal-security',
  templateUrl: './deal-security.component.html',
  styleUrls: ['./deal-security.component.scss'],
})
export class DealSecurityComponent implements OnInit {
  @Input() data: string;
  @Input() title: string;

  List: any;
  HeaderTitle = '';
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.List = JSON.parse(this.data),
    this.HeaderTitle = this.title;
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
