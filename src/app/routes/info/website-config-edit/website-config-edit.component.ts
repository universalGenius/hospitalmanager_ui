import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-info-website-config-edit',
  templateUrl: './website-config-edit.component.html',
})
export class InfoWebsiteConfigEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl: any;
  saveData = {};
  schema: SFSchema = {
    properties: {
      key: { type: 'string', title: 'key' },
      link: { type: 'string', title: '跳转连接' },
      isShow: {
        type: 'number',
        title: '是否展示',
        enum:[
          { label: '展示', value: 0 },
          { label: '不展示', value: 1 }
        ]
      },
      sort: { type: 'number', title: '排序' },
      value: { type: 'string', title: 'value' },
      explain: { type: 'string', title: '说明' },
    },
    required: [],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $isShow:{
      widget: 'select',
    },
    $value:{
      grid: { span: 24 },
    },
    $explain:{
      widget: 'textarea',
      grid: { span: 24 },
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
    delete value._values;
    this.http.post(this.saveUrl, value).subscribe((res:any)=> {
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
