import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

interface ModalData {
  type: string;
  data: {
    id: string;
    title: string;
  }[];
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  constructor(
    private modalController: ModalController
  ) { }

  @Input() public title: string;
  @Input() public data: ModalData;
  public tempData;

  ngOnInit() {
    this.tempData = [...this.data.data];
    console.log(this.tempData)
  }

  modalDismiss(key?: string) {
    this.modalController.dismiss(Boolean(key) && {
      type: this.data.type,
      data: this.data.data.find(item => item.title === key)
    });
    console.log(this.tempData)
  }

  search({ detail }) {
    const key = detail.value;
    if (key) {
      this.tempData = this.data.data.filter(item => item.title.indexOf(key) > -1);
    } else {
      this.tempData = [...this.data.data];
    }
  }

}
