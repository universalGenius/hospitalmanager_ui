import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-users-users-setphone',
  templateUrl: './users-setphone.component.html',
})
export class UsersUsersSetphoneComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      phone: { type: 'string', title: '老手机' },
      newPhone: { type: 'string', title: '新手机'},
    },
    required: ['newPhone'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $phone: {
      widget: 'text'
    },
    $newPhone: {
      widget: 'string',
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    console.log(this.i)
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    console.log({
      id:value.id,
      phone:value.newPhone
    });
    this.http.post(`/admin_user/set_phone`, {
      id:value.id,
      phone:value.newPhone
    }).subscribe((res:any) => {
      if(res.code===12000){
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      }else{
        this.msgSrv.success(res.msg);
      }

    });
  }

  close() {
    this.modal.destroy();
  }
}
