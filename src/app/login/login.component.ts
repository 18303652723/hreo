import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    const userInfo: any = this.authenticationService.currentUserValue;
		if (userInfo && userInfo.token && userInfo.data) {
			this.router.navigate(['/home/index'])
		}
   }

  ngOnInit() {
    
  }

}
