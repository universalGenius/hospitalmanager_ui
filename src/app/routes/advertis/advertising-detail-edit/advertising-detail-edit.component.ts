import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-advertis-advertising-detail-edit',
  templateUrl: './advertising-detail-edit.component.html',
})
export class AdvertisAdvertisingDetailEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  adSpaceList = [];
  saveUrl = '';
  saveData = {};
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: '广告详情id' },
      spaceId: { type: 'number', title: '广告位置',enum:[{}]},
      imgUrl: { type: 'string', title: '广告图片' },
      advertisers: { type: 'string', title: '广告主' },
      adUrl: { type: 'string', title: '跳转链接' },
      shelfTime: { type: 'string', title: '上架时间' },
      obtainedTime: { type: 'string', title: '下架时间' },
      sort: { type: 'number', title: '排序' },
      // device: {
      //   type: 'number',
      //   title: '选择展示类型',//pc热门搜索、热门标签、 APP热门关键词
      //   enum:[
      //     {value: '',label:'全部'},
      //     {value: 1,label:'pc热门搜索'},
      //     {value: 2,label:'热门标签'},
      //     {value: 3,label:'APP热门关键词'}
      //   ],
      // },
    },
    required: ['spaceId', 'imgUrl', 'advertisers', 'adUrl'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $id: {
      hidden:true
    },
    $spaceId: {
      widget: 'select',
      asyncData:()=>{
        return of(this.adSpaceList);
      },
    },
    $imgUrl: {
      widget: 'MyuploadWidget',
      grid: { span: 12 },
      config:{
        action: '/',
        fileName:'file',
        max:1
      }
    },
    $shelfTime: {
      widget: 'date',
    },
    $obtainedTime: {
      widget: 'date',
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    console.log(this.adSpaceList);
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    console.log(value,1111111111112);
    if(value.id){
      this.saveData={
        id:value.id,
        spaceId:value.spaceId,
        imgUrl:value.imgUrl,
        advertisers:value.advertisers,
        adUrl:value.adUrl,
        shelfTime:value.shelfTime,
        obtainedTime:value.obtainedTime,
        sort:value.sort,
      }
    }else{
      this.saveData={
        spaceId:value.spaceId,
        imgUrl:value.imgUrl,
        advertisers:value.advertisers,
        adUrl:value.adUrl,
        shelfTime:value.shelfTime,
        obtainedTime:value.obtainedTime,
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
