import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-data-static-edit',
  templateUrl: './static-edit.component.html',
})
export class DataStaticEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl = '';
  saveData = {};
  schema: SFSchema = {
    properties: {
      icon: { type: 'string', title: '图标' },
      title: { type: 'string', title: '标题' },
      describe: { type: 'string', title: '描述' },
      type: {
        type: 'string',
        title: '类型',
        enum:[
          {value:1,label:'首页banner8个icon'},
          {value:2,label:'首页列表模块'},
          {value:3,label:'列表筛选标题'},
          {value:4,label:'综合排序'},
          {value:5,label:'反馈类型'}
        ],
      },
      skipType: {
        type: 'string',
        title: '跳转类型',
        enum:[
          {value:0,label:'只做展示'},
          {value:1,label:'分类跳转'},
          {value:2,label:'跳转列表并筛选'},
          {value:3,label:'首页模块筛选'}
        ],
       },
      sort: { type: 'string', title: '排序' },
    },
    required: ['icon', 'title', 'describe', 'type'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $id: {
      hidden:true
    },
    $icon: {
      widget: 'MyuploadWidget',
      grid: { span: 12 },
      config:{
        action: '/',
        fileName:'file',
        max:1
      }
    },
    $type: {
      widget: 'select',
    },
    $skipType: {
      widget: 'select',
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {

  }

  save(value: any) {
    console.log(value,1111111111112);
    if(value.id){
      this.saveData={
        id:value.id,
        icon:value.icon,
        title:value.title,
        describe:value.describe,
        type:value.type,
        skipType:value.skipType,
        sort:value.sort,
      }
    }else{
      this.saveData={
        icon:value.icon,
        title:value.title,
        describe:value.describe,
        type:value.type,
        skipType:value.skipType,
        sort:value.sort,
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
