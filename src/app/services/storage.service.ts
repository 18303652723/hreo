import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  // 获取收藏信息进行解码转化为对象/数组返回
  getStorage(key) {
    const collect = localStorage.getItem(key)
    return collect ? JSON.parse(unescape(collect)) : ''
  }

  // 将收藏信息（对象）转换为字符串存储在本地存储中
  setStorage(key,value) {
    value = value instanceof String ? value : JSON.stringify(value)
    localStorage.setItem(key, escape(value))
  }

  // 清空收藏信息
  clearStorage(key) {
    localStorage.setItem(key, '')
  }

  // 操作收藏信息
  optStorage(key,obj) {
    var collect_info = this.getStorage(key) || [];
    const index = collect_info.findIndex(item => {
      return item.id == obj.id
    })
    if(index != -1) {
      collect_info.splice(index, 1)
    }else{
      collect_info.unshift(obj)
    }
    this.setStorage(key,collect_info)
  }

}
