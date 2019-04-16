import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-info-logout-edit',
  templateUrl: './logout-edit.component.html',
})
export class InfoLogoutEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl: any;
  schema: SFSchema = {
    properties: {
      phone: { type: 'string', title: '注销手机号' },
      reason: { type: 'string', title: '注销原因' }
    },
    required: ['phone', 'reason'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $reason:{
      widget: 'textarea',
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    console.log(this.i);
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    console.log({
      phone:value.phone,
      reason:value.reason
    })
    this.http.post(this.saveUrl, {
      phone:value.phone,
      reason:value.reason,
    }).subscribe((res:any)=> {
      if(res.code==12000){
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
