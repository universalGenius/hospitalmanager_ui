import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-users-users-photo-edit',
  templateUrl: './users-photo-edit.component.html',
})
export class UsersUsersPhotoEditComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      avatar: { type: 'string', title: '头像' },
    },
    required: [],
  };
  ui: SFUISchema = {
    $avatar:{
      widget:'MyuploadWidget',
      config:{
        action: '/',
        fileName:'file',
        max:1
      }
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    console.log(this.i);
  }

  save(value: any) {
    console.log({
      avatar:value.avatar,
      id:value.id
    })
    this.http.post(`/admin_user/set_avatar`, {
      avatar:value.avatar,
      id:value.id
    }).subscribe((res:any) => {
      if(res.code===12000){
        this.msgSrv.success('修改成功');
        this.modal.close(true);
      }

    });
  }

  close() {
    this.modal.destroy();
  }
}
