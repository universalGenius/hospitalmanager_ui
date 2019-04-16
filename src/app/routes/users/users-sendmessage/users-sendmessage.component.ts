import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-users-users-sendmessage',
  templateUrl: './users-sendmessage.component.html',
})
export class UsersUsersSendmessageComponent implements OnInit {
  record: any = {};
  i: any;
  schema: SFSchema = {
    properties: {
      type: {
        type: 'string',
        title: '用户类型',
        // default: 0,
        // enum: ['选中用户', '所有用户', '群体用户']
        enum: [
          { label: '选中用户', value: 0 },
          { label: '所有用户', value: 1 },
          { label: '群体用户', value: 2 },
        ],
        ui:{
          widget: 'radio',
          styleType: 'button',
          // change:(value) => {
          //   if(value==2){

          //   }
          // }
        }
      },
      identity: {
        type: 'string',
        title: '群体身份',
        enum: [
          { label: '企业', value: '2' },
          { label: '个人', value: '3' }
        ],
        ui:{
          widget: 'radio',
          styleType: 'button',
          visibleIf: { type: [ 2 ] },
        }
      },
      content:{type: 'string',title: '短信内容',}
    },
    required: ['type','content'],
  };
  // ui: SFUISchema = {
  //   '*': {
  //     spanLabelFixed: 100,
  //     grid: { span: 24 },
  //   },

  //   $identity: {
  //     widget: 'radio',
  //     styleType: 'button',
  //     change:(value) => {
  //       console.log(value)
  //     }
  //   },
  //   $massage:{
  //     widget: 'textarea',
  //     autosize: { minRows: 6, maxRows: 12 }
  //   }
  // };

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
    console.log(value);
    console.log({
      ids:[value.type],
      content:value.content
    });
    this.http.post(`/admin_user/send`, {
      type:value.type,
      id:value.id,
      content:value.content
    }).subscribe((res:any) => {
      if(res.code===12000){
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
