import { Injectable } from '@angular/core';
import { ServicesModule } from './services.module';

@Injectable({
    providedIn:ServicesModule
})
export class GetCurrentUser {

    /**
     * 获取当前用户的id
     */
    getCurrentUserId(){
        var currentUser = localStorage.getItem('currentUser')
        currentUser = JSON.parse(currentUser)
        if(currentUser){
            return currentUser['data']['id']
        }else{
            return '';
        }
        
    }

    /**
     * 获取当前用户的用户名
     */
    getCurrentUserTitle(){
        var currentUser = localStorage.getItem('currentUser')
		currentUser = JSON.parse(currentUser)
        return currentUser['data']['user_title']
    }

    /**
     * 获取当前用户的手机号
     */
    getCurrentUserPhone(){
        var currentUser = localStorage.getItem('currentUser')
		currentUser = JSON.parse(currentUser)
        return currentUser['data']['user_phone']
    }
}