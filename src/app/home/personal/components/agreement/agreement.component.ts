import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { DealSecurityComponent } from '@app/terms/deal-security/deal-security.component';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss'],
})
export class AgreementComponent implements OnInit {


  constructor(
    private activeRouter: ActivatedRoute,
    private gethttp: GethttpdataService,
    private modalController: ModalController,
  ) { }

  public agreementList = [];

  public title = '协议流程';

  get_agreement_list(type) {
    const params = { type: type };
    this.gethttp.agreement_list(params).subscribe(res => {
      console.log(res);
      this.agreementList = res;
    })
  }

  ngOnInit() {
    this.activeRouter.queryParams.subscribe(params => {
      console.log(params);
      var type = '';
      if(params && params.type) {
        type = params.type
        this.title = '官方公告'
      }
      this.get_agreement_list(type);
    })
  }

  checkDealSecurity(item) {
    this.modalController.create({
      component: DealSecurityComponent,
      componentProps: {
        'data': JSON.stringify(item),
        'title': item.title,
      }
    }).then(popover => {
      popover.present();
    });
  }

}
