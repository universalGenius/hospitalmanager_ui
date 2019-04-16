import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema ,SFComponent } from '@delon/form';


@Component({
  selector: 'app-info-forbidden-account-edit',
  templateUrl: './forbidden-account-edit.component.html',
})
export class InfoForbiddenAccountEditComponent implements OnInit, AfterViewInit {
  record: any = {};
  i: any = {};
  saveUrl: any;
  saveData = {};
  typeString = '';
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: '' },
      phone: { type: 'string', title: `${this.typeString}手机号` },
      reason: { type: 'string', title:  `${this.typeString}原因`},
      endTime: { type: 'string', title: '封号结束时间',default:new Date() }
    },
    required: ['phone', 'reason'],
  };
  @ViewChild('sf') sf: SFComponent;
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $id:{
      hidden: true,
    },
    $reason:{
      widget: 'textarea',
    },
    $endTime:{
      widget: 'date',
      visibleIf: { id: (value: any) => value == undefined }
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

  ngAfterViewInit():void {
    console.log(this.sf);
    this.schema.properties.phone.title = `${this.typeString}手机号`;
    this.schema.properties.reason.title = `${this.typeString}原因`;
    this.sf.refreshSchema();
  }

  save(value: any) {
    if(this.i.id){
      this.saveData={
        id:value.id,
        reason:value.reason,
        operator:JSON.parse(localStorage.user).name
      }
    }else{
      this.saveData={//Date.parse(date)
        phone:value.phone,
        reason:value.reason,
        endTime:Date.parse(value.endTime),
        operator:JSON.parse(localStorage.user).name
      }
    }
    console.log(this.saveData);
    this.http.post(this.saveUrl, this.saveData).subscribe((res:any)=> {
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
