import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, AlertController } from '@ionic/angular';
import { GetCurrentUser } from '@app/services/getCurrentUser.service';
import { GethttpdataService } from '@app/services/gethttpdata.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/_services';


@Component({
	selector: 'app-personal-infomation',
	templateUrl: './personal-infomation.component.html',
	styleUrls: ['./personal-infomation.component.scss'],
})
export class PersonalInfomationComponent implements OnInit {

	constructor(
		private toastController: ToastController,
		private loadingController: LoadingController,
		private alertController: AlertController,
		private GetCurrentUser: GetCurrentUser,
		private GethttpdataService: GethttpdataService,
		private router: Router,
		private authenticationService: AuthenticationService,
		private http: HttpClient,
	) { }

	public showEditFrame = false;
	public editFrameTitle: string;

	public personalInfomation = {
		avatar: '',
		title: '',
		explain: ''
	};
	public textareaVal: string;

	public id: string;

	ngOnInit() {
		this.id = this.GetCurrentUser.getCurrentUserId()
		let params = this.GethttpdataService.getParams({
			id: this.id
		})
		this.GethttpdataService.personalInfo(params).subscribe(response => {
			this.personalInfomation['avatar'] = response[0]['img_url']
			this.personalInfomation['title'] = response[0]['user_title']
			this.personalInfomation['explain'] = response[0]['remark']
		})
	}

	openEditFrame(title: string) {
		this.editFrameTitle = title;
		this.showEditFrame = !this.showEditFrame;
		if (title === '昵称') {
			this.textareaVal = this.personalInfomation.title;
		} else if (title === '个性签名') {
			this.textareaVal = this.personalInfomation.explain;
		}
	}

	async editInputConfirm() {
		const loading = (await this.loadingPresent());
		loading.present();
		if (this.editFrameTitle === '昵称') {

			let params = this.GethttpdataService.getParams({
				id: this.id,
				updateWhich: this.editFrameTitle,
				update: this.textareaVal
			})
			this.GethttpdataService.updatePersonalInfo(params).subscribe(response => {
				console.log(response)
				if(response['status'] == -1){
					this.toastPresent(response['msg'], 'dark');
				}else{
					this.toastPresent(`${this.editFrameTitle}修改成功`, 'dark');
					this.personalInfomation.title = this.textareaVal;
				}
			})
			
		} else if (this.editFrameTitle === '个性签名') {
			
			let params = this.GethttpdataService.getParams({
				id: this.id,
				updateWhich: this.editFrameTitle,
				update: this.textareaVal
			})
			this.GethttpdataService.updatePersonalInfo(params).subscribe(response => {
				console.log(response)
				if(response['status'] == -1){
					this.toastPresent(response['msg'], 'dark');
				}else{
					this.toastPresent(`${this.editFrameTitle}修改成功`, 'dark');
					this.personalInfomation.explain = this.textareaVal;
				}
			})
		}
		this.showEditFrame = false;
		loading.dismiss();
	}

	// 登出账户/注销账户
	logout() {
		const that = this;
		this.alertController.create({
			header: '提示',
			message: '您确认登出该账号吗？',
			buttons: [
				{ text: '取消', role: 'cancel' },
				{
					text: '确定', handler: (async () => {
						// 用户点击了确定
						// 可以用 this  不用   let that= this 了
						const loading = (await that.loadingPresent());
						loading.present();
						that.GethttpdataService.logout().subscribe((res: any ) => {
							loading.dismiss();
							that.toastPresent('账号已安全登出', 'dark');
							that.authenticationService.logout();
							setTimeout(() => {
								that.router.navigate(['/login']);
							}, 1500);
						})
					}).bind(this)
				}
			]
		}).then(alert => {
			alert.present();
		});
	}

	async uploadFile(event) {
		// 获取头像
		const loading = (await this.loadingPresent());
		loading.present();
		const file: File = event.target.files[0];
		if (!file) {
			return;
		}
		// 判断用户选择头像类型
		if (['jpeg', 'jpg', 'png'].indexOf(file.type.split('/')[1]) < 0) {
			this.toastPresent('请选择.jpeg .jpg .png格式的图片', 'danger');
			return;
		}
		// 收集头像信息
		const formData = new FormData();
		formData.set('file', file);
		// 开始上传
		this.http.post('uploadPicture', formData)
			.subscribe((res: any) => {
				loading.dismiss();
				// console.log(res);
				// 上传状态反馈
				if (res.status === 1) {
					this.toastPresent('头像上传成功', 'dark');
					this.personalInfomation.avatar = res.url;
					console.log(this.personalInfomation.avatar)
					// 更新头像信息
					this.update(this.personalInfomation.avatar)
					return;
				}
				this.toastPresent(res.info, 'danger');
			});
	}

	update(avatar){
		let params = this.GethttpdataService.getParams({
			id: this.id,
			updateWhich: '头像',
			update: avatar
		})
		this.GethttpdataService.updatePersonalInfo(params).subscribe(response => {
			console.log(response)
		})
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
		const loading = await this.loadingController.create({
			message: '请稍后...'
		});
		return loading;
	}

}
