import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-info-head-report-edit',
  templateUrl: './head-report-edit.component.html',
})
export class InfoHeadReportEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl: any;
  saveData = {};
  schema: SFSchema = {
    properties: {
      banner: { type: 'string', title: '文章封面图' },
      title: { type: 'string', title: '文章标题' },
      source: { type: 'string', title: '来源' },
      isShow: {
        type: 'string',
        title: '是否展示',
        enum:[
          { label: '展示', value: 0 },
          { label: '不展示', value: 1 }
        ]
      },
      sort: { type: 'string', title: '排序' },
      detailsType: {
        type: 'string',
        title: '选择类型',
        enum:[
          { label: '富文本', value: 0 },
          { label: '秀米链接', value: 1 }
        ]
      },
      xmUrl: { type: 'string', title: '秀米链接'},
      content: { type: 'string', title: '文章内容',},
    },
    required: ['banner', 'title', 'source', 'content'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $banner: {
      widget: 'MyuploadWidget',
      grid: { span: 12 },
      config:{
        action: '/',
        fileName:'file',
        max:1
      }
    },
    $isShow:{
      widget: 'select',
      grid: { span: 12 },
    },
    $sort:{
      grid: { span: 12 },
    },
    $content:{
      widget: 'ueditor',
      visibleIf: { detailsType: [0]}
    },
    $xmUrl:{
      visibleIf: { detailsType: [1]}
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
    if(this.i.id){
      this.saveData={
        id:value.id,
        banner:value.banner,
        title:value.title,
        content:value.content,
        source:value.source,
        isShow:value.isShow,
        detailsType:value.detailsType,
        xmUrl:value.xmUrl,
        sort:value.sort
      }
    }else{
      this.saveData={
        banner:value.banner,
        title:value.title,
        content:value.content,
        source:value.source,
        isShow:value.isShow,
        detailsType:value.detailsType,
        xmUrl:value.xmUrl,
        sort:value.sort
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
