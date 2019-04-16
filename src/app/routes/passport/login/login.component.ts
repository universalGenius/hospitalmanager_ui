import { SettingsService, _HttpClient } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  SocialService,
  SocialOpenType,
  ITokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { environment } from '@env/environment';
import { StartupService } from '@core';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  form: FormGroup;
  error = '';
  type = 0;

  constructor(
    fb: FormBuilder,
    modalSrv: NzModalService,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
  ) {
    this.form = fb.group({
      userName: [null, [Validators.required, Validators.minLength(4)]],
      password: [null, Validators.required],
    });
    modalSrv.closeAll();
  }

  // #region fields

  get userName() {
    return this.form.controls.userName;
  }
  get password() {
    return this.form.controls.password;
  }
  switch(ret: any) {
    this.type = ret.index;
  }
  submit() {
    // this.error = '';
    // if (this.type === 0) {
    //   this.userName.markAsDirty();
    //   this.userName.updateValueAndValidity();
    //   this.password.markAsDirty();
    //   this.password.updateValueAndValidity();
    //   if (this.userName.invalid || this.password.invalid) return;
    // }
    // this.http
    //   .post('/login',{account:this.userName.value,password:this.password.value})
    //   .subscribe((res: any) => {
    //     if(res.code===12000){
    //       this.tokenService.set({
    //         token: res.data.token,
    //         name: this.userName.value,
    //         id: res.data.userInfo.id,
    //         time: res.data.time,
    //       });
    //       this.settingsService.setUser({
    //         name: this.userName.value,
    //         id: res.data.userInfo.id,
    //         avatar:'https://www.gravatar.com/avatar/2080c9637857d4a316ae98563c0829ab?s=72&d=identicon'
    //       });
    //       this.startupSrv.load().then(() => {
    //         this.router.navigate(['/'])
    //       });
    //     }
    //   });
    this.router.navigate(['/'])
  }
  ngOnDestroy(): void {
  }
}
