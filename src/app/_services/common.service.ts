import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { Dealer } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CommonService {
    private currentDealerSubject: BehaviorSubject<Dealer>;
    public currentDealer: Observable<Dealer>;

    private dealer: Dealer = {
      id: 1,
      title: 'test',
      company_id: 2,
      uid: 0,
      last_login_time: ''
    }

    constructor() {
        this.currentDealerSubject = new BehaviorSubject<Dealer>(this.dealer);
        this.currentDealer = this.currentDealerSubject.asObservable();
    }

    public get currentDealerValue(): Dealer {
        console.log('after set', this.currentDealerSubject.value);
        return this.currentDealerSubject.value;
    }

    public set currentDealerValue(value) {
      console.log(value);
      this.currentDealerSubject.next(value);
    }
}
