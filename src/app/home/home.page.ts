import { Component } from '@angular/core';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(
		private GetCurrentUser: GetCurrentUser,
		private GethttpdataService: GethttpdataService,
    private router: Router
  ) {}
  
  public newMsg = false;

  ngOnInit() {
		let params = this.GethttpdataService.getParams({
			id: this.GetCurrentUser.getCurrentUserId()
    })
    
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.GethttpdataService.personalInfo(params).subscribe(response => {	
        console.log('是否有新消息:',response[0]['have_news'])
        this.newMsg = response[0]['have_news'];
			})
    })
  }

}
