import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-info-brand-news-check-fail',
  templateUrl: './brand-news-check-fail.component.html',
})
export class InfoBrandNewsCheckFailComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl = '';
  id='';
  schema: SFSchema = {
    properties: {
      content: { type: 'string', title: '失败原因', maxLength: 140 },
    },
    required: ['description'],
  };
  ui: SFUISchema = {
    $content: {
      widget: 'textarea',
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    console.log({
      id:this.id,
      content:value.content
    },this.saveUrl,value);
    this.http.post(this.saveUrl, {
      id:this.id,
      content:value.content
    }).subscribe((res:any) => {
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
