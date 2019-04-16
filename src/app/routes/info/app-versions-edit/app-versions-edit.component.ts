import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-info-app-versions-edit',
  templateUrl: './app-versions-edit.component.html',
})
export class InfoAppVersionsEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl: any;
  saveData = {};
//   version	是	int	版本名称
// versionDoc	是	string	更新文案
// forceUpdate	是	int	0 表示不需要强制更新 1 表示强制更新
// versionNum	是	int	版本号
// id
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: 'ID' },
      version: { type: 'string', title: '版本名称' },
      versionDoc: { type: 'string', title: '更新文案' },
      forceUpdate: {
        type: 'string',
        title: '强制更新',
        enum: [
          { label: '不需要强制更新', value: 0 },
          { label: '强制更新', value: 1 },
        ],
        ui:{
          widget: 'radio',
          styleType: 'button',
        }
      },
      versionNum: { type: 'string', title: '版本号' },
    },
    required: ['version','versionDoc','forceUpdate','versionNum'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $id:{
      hidden:true
    }
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
    if(this.i.id){
      this.saveData={
        id:value.id,
        version:value.version,
        versionDoc:value.versionDoc,
        forceUpdate:value.forceUpdate,
        versionNum:value.versionNum,
      }
    }else{
      this.saveData={
        version:value.version,
        versionDoc:value.versionDoc,
        forceUpdate:value.forceUpdate,
        versionNum:value.versionNum,
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
