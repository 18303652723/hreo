import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';
import { first } from 'rxjs/operators';
import { GethttpdataService } from 'src/app/services/gethttpdata.service';
import { Company_Config } from '@app/services/services.module';
import { Inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@app/_models';
import { DealSecurityComponent } from '@app/terms/deal-security/deal-security.component';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
	private currentUserSubject: BehaviorSubject<User>;
	public currentUser: Observable<User>;

	constructor(
		private toastController: ToastController,
		private router: Router,
		private modalController: ModalController,
		private authenticationService: AuthenticationService,
		private GethttpdataService: GethttpdataService,
		private loadingController: LoadingController,
		@Inject(Company_Config) private company_config: object
	) {
				this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
	 }

	public countDown = 0;
	public mobile = '';
	public code = '';
	private data = {
		mobile: '',
		code: ''
	};

	// 图形验证码数字
	public imgCode;
	// 图形验证码图片
	public codeImg;
	public inputImgCode;
	// private code: string;
	// private mobile: string;

	ngOnInit() { 
		this.getImgCode()
		const userInfo: any = this.authenticationService.currentUserValue;
		if (userInfo && userInfo.token && userInfo.data) {
			this.router.navigate(['/home/index'])
		}
			// const userInfo = JSON.parse(localStorage.getItem('currentUser'));
			// if (userInfo.token && userInfo.data) {}

	}

	// 获取图形验证码
	getImgCode(){
		this.GethttpdataService.getCaptcha().subscribe(response => {
			console.log(response)
			this.imgCode = response['capWord']
			this.codeImg = response['capImg']
		})
	}

	// 获取验证码
	getCode() {
		console.log(this.inputImgCode)
		const test = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/;
		if (!this.mobile) {
			this.toastPresent('请输入手机号码', 'danger');
			return;
		} else if (!(test.test(this.mobile))) {
			this.toastPresent('请输入正确的手机号码', 'danger');
			return;
		} else if (!this.inputImgCode){
			this.toastPresent('请输入图形验证码', 'danger');
			return;
		} else if (this.inputImgCode != this.imgCode){
			this.toastPresent('图形验证码输入错误', 'danger');
			return;
		}
		this.GethttpdataService.generateSmsCode({phone: this.mobile, 'token': 'ODyFmm4faqV9CwCmGh0sNu7ZxpcSyjmV'}).subscribe(code => {
			console.log(code);
			if (code) {
				this.toastPresent('验证码已发送', 'dark');
				this.data.code = code;
				alert(code);
				this.data.mobile = (this.mobile).toString();
				this.countDown = 60;
				const countDown = setInterval(() => {
					this.countDown -= 1;
					if (this.countDown !== 0) { return; }
					clearInterval(countDown);
				}, 1000);
			}else{
				this.toastPresent('验证码发送失败', 'danger');
			}
		})
		// this.toastPresent('验证码已发送', 'dark');
		// this.countDown = 60;
		// const countDown = setInterval(() => {
		// 	this.countDown -= 1;
		// 	if (this.countDown !== 0) { return; }
		// 	clearInterval(countDown);
		// }, 1000);

		// // 随机生成六位数验证码
		// const code = [];
		// for (let i = 0; i < 6; i++) {
		// 	code.push(Math.floor(Math.random() * 9));
		// }
		// // 存储 验证码和手机号
		// this.data.code = code.join('');
		// this.data.mobile = (this.mobile).toString();
		// alert(this.data.code);
		// console.log(this.data.code);
	}

	async login() {
		let that = this;
		console.log(this.code);
		if (!this.code) {
			this.toastPresent('请输入验证码', 'danger');
			return;
		} else if ((this.code).toString() !== this.data.code || !this.code) {
			this.toastPresent('验证码不正确', 'danger');
			return;
		}
		// this.toastPresent('登录成功', 'dark');
		// timer(1500).subscribe(() => {
		//   this.router.navigate(['/login/serverSelection']);
		//   this.router.ngOnDestroy();
		// });
		// 拿到手机号与验证码信息
		const loading = await this.loadingPresent();
		loading.present();
		// this.GethttpdataService.loginLatest({mobile: this.data.mobile, company_id: this.company_config}).subscribe(res => {
		// 	loading.dismiss();
		// 	console.log(res);
		// 	if (res) {
		// 		// store user details and jwt token in local storage to keep user logged in between page refreshes
		// 		localStorage.setItem('currentUser', JSON.stringify(res));
		// 		this.currentUserSubject.next(res);
		// 		console.log(this.currentUserSubject.value);
		// 		that.toastPresent('登录成功', 'dark');
		// 		setTimeout(() => {
		// 			that.router.navigate(['/login/serverSelection']);
		// 			that.router.ngOnDestroy();
		// 		}, 2000);
		// 	} else {
		// 		that.toastPresent('登录失败', 'danger');
		// 	}
		// })
		// return;
		this.authenticationService.login(this.data.mobile, this.company_config)
			.pipe(first()).subscribe(data => {
				loading.dismiss();
				console.log(data);
				if (data.status == 1) {
					that.toastPresent('登录成功', 'dark');
					setTimeout(() => {
						that.router.navigate(['/login/serverSelection']);
						that.router.ngOnDestroy();
					}, 2000);
				} else {
					that.toastPresent(data.info, 'danger');
				}
				return;
			});
	}

	private toastPresent(message: string, color: 'dark' | 'danger') {
		this.toastController.create({
			message,
			color,
			duration: 1000
		}).then(toast => {
			toast.present();
		});
	}

	private async loadingPresent() {
		return await this.loadingController.create({
			message: '请稍候...'
		});
	}

	scrollToTop() {
		window.scrollTo(0, 0);
	}

	checkDealSecurity(id,title) {
		this.GethttpdataService.loginAgreementList({id: id}).subscribe(res => {
			console.log(res);
			this.modalController.create({
				component: DealSecurityComponent,
				componentProps: {
					'data': JSON.stringify(res[0]),
					'title': title
				}
			}).then(popover => {
				popover.present();
			});
		})
	}
}
