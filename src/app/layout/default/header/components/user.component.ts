import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService, _HttpClient, ModalHelper } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd';
import { ChangePassword } from '../change-password/change-password.component';

@Component({
  selector: 'header-user',
  template: `
  <nz-dropdown nzPlacement="bottomRight">
    <div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown>
      <nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
      {{settings.user.name}}
    </div>
    <div nz-menu class="width-sm">
      <div nz-menu-item (click)="changePassword()">
        <i nz-icon type="edit" theme="twotone" class="mr-sm"></i>
        修改密码
      </div>
      <div nz-menu-item (click)="logout()">
        <i nz-icon type="logout" class="mr-sm"></i>
        退出登录
      </div>
    </div>
  </nz-dropdown>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderUserComponent {
  constructor(
    public settings: SettingsService,
    private router: Router,
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  logout() {
    this.tokenService.clear();
    this.router.navigateByUrl(this.tokenService.login_url);
  }

  changePassword(){
    this.modal.createStatic(ChangePassword,{}).subscribe(() => {});
  }
}
