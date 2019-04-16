import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-advertis-advertising-space-edit',
  templateUrl: './advertising-space-edit.component.html',
})
export class AdvertisAdvertisingSpaceEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl = '';
  saveData = {};
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '广告位名称' },
      templateId: { type: 'string', title: '模板',enum:[{label:'rr',value:'123'}] },
    },
    required: ['name', 'templateId'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $templateId: {
      widget: 'select',
      asyncData:()=> this.getSelect('/admin_ad_space_template/get',{})
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    console.log(this.msgSrv);
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }
  getSelect(url,parameter){
    return this.http.get(url,parameter).pipe(
      map((res:any)=> {
        return res.data
      })
    )
  }

  save(value: any) {
    console.log(value);
    if(value.id){
      this.saveData={
        id:value.id,
        name:value.name,
        templateId:value.templateId
      }
    }else{
      this.saveData={
        name:value.name,
        templateId:value.templateId
      }
    }
    this.http.post(this.saveUrl, this.saveData).subscribe((res:any)=> {
      if(res.code==12000){
        console.log(res)
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
