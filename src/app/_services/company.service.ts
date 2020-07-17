import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor() { }

  proccessCartData(data: any[]){
    if (data.length === 0) {
      return false;
    }
    const cartArray = [];
    data.forEach(item => {
      const tmp = [];
      tmp.push(item.goods_id);
      tmp.push(item.goods_number);
      if (item.option_id) {
        tmp.push(item.option_id);
      }
      cartArray.push(tmp.join('|'));
    });
    return cartArray.join(',');
  }
}
