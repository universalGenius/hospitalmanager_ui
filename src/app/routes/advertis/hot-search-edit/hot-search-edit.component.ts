import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-advertis-hot-search-edit',
  templateUrl: './hot-search-edit.component.html',
})
export class AdvertisHotSearchEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl = '';
  saveData = {};
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: '展示类型' },
      name: { type: 'string', title: '关键词' },
      sort: { type: 'number', title: '排序' },
      starTime: { type: 'string', title: '开始时间' },
      endTime: { type: 'string', title: '结束时间' },
      // type: { type: 'number', title: '' },
      device: {
        type: 'number',
        title: '选择展示类型',//pc热门搜索、热门标签、 APP热门关键词
        enum:[
          {value: 0,label:'pc热门搜索'},
          {value: 1,label:'app热门搜索'},
          {value: 2,label:'热门标签'}
        ],
      },
    },
    required: ['name', 'sort', 'device'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $id: {
      hidden:true
    },
    $type: {
      hidden:true
    },
    $device: {
      widget: 'select',
    },
    $starTime: {
      widget: 'date',
      hidden:true
    },
    $endTime: {
      widget: 'date',
      hidden:true
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

  save(value: any) {
    console.log(value);
    if(value.id){
      this.saveData={
        id:value.id,
        type:value.type,
        name:value.name,
        sort:value.sort,
        device:value.device
      }
    }else{
      this.saveData={
        name:value.name,
        sort:value.sort,
        device:value.device,
        type:value.type,
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
