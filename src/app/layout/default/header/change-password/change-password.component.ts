import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';

@Component({
  selector: 'change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePassword implements OnInit {
  i: any = {};
  schema: SFSchema = {
    properties: {
      oldPwd: { type: 'string', title: '老密码' },
      newPwd: { type: 'string', title: '新密码' },
      confirmNewPwd: { type: 'string', title: '确认密码',
      ui:{
        validator:value=>{
          console.log(value);
          if(this.sf){
            console.log(this.sf&&this.sf.value.newPwd==value);
          }
          return (this.sf&&value==this.sf.value.newPwd)?[]:[{ keyword: 'required', message: '密码不一致'}]
        }
      }
    },
    },
    required: [],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    }
  };
  @ViewChild('sf') sf: SFComponent;
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {}

  ngOnInit(): void {}

  save(value: any) {
    value.uid=JSON.parse(localStorage.user).id;
    this.http.post(`/account_manager/do_update_pwd`,value)
    .subscribe((res:any)=> {
      if(res.code==12000){
        this.msgSrv.success('修改成功');
        this.modal.close(true);
        this.tokenService.clear();
        this.router.navigateByUrl(this.tokenService.login_url);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
