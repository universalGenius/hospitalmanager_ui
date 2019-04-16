import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';

@Component({
  selector: 'app-advertis-pc-banner-edit',
  templateUrl: './pc-banner-edit.component.html',
})
export class AdvertisPcBannerEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl = '';
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: 'id' },
      imgUrl: { type: 'string', title: '图片' },
      type: {
        type: 'string',
        title: 'Banner类型',
        enum:[
          {value: 1,label:'首页'},
          {value: 2,label:'盟盟红铺'},
          {value: 3,label:'头报'},
          {value: 4,label:'商铺首页默认'},
          {value: 5,label:'登录banner'},
        ],
      },
      skipType: {
        type: 'string',
        title: '跳转类型',
        enum:[//1.未设置跳转链接 2.普通链接 3.头报文章链接 4.品牌详情
          {value: 1,label:'未设置跳转链接'},
          {value: 2,label:'普通链接'},
          {value: 3,label:'头报文章链接'},
          {value: 4,label:'品牌详情'}
        ]
      },
      url: { type: 'string', title: '跳转链接', },
      showTime: { type: 'string', title: '开始展示时间'},
      unShelveTime: { type: 'string', title: '下架时间' },
      isShow: { type: 'boolean', title: '是否展示' },
      sort: { type: 'number', title: '排序',minimum: 0, maximum: 99999999 }
    },
    required: ['imgUrl', 'type'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $id: {
      hidden:true
    },
    $showTime:{
      widget: 'date',
    },
    $unShelveTime:{
      widget: 'date',
    },
    $imgUrl: {
      widget: 'MyuploadWidget',
      grid: { span: 24 },
      config:{
        action: '/',
        fileName:'file',
        max:1
      }
    },
    $projectType: {
      widget: 'select',
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}
  @ViewChild('sf') sf: SFComponent;
  ngOnInit(): void {
    console.log(this.saveUrl)
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }
  saveData={};
  save(value: any) {
    console.log(value);
    if(value.id){
      // id	是	int	banner id
      // imgUrl	是	string	banner图链接
      // type	是	int	banner类型
      // skipType	否	string	跳转类型
      // url	否	string	跳转链接
      // showTime	否	date	展示时间
      // unShelveTime	否	date	下架时间
      // isShow	否	boolean	是否展示
      // sort
      this.saveData={
        id:value.id,
        imgUrl:value.imgUrl,
        type:value.type,
        skipType:value.skipType,
        url:value.url,
        showTime:value.showTime,
        unShelveTime:value.unShelveTime,
        isShow:value.isShow,
        sort:value.sort,
        projectType:value.projectType
      }
    }else{
      this.saveData={
        imgUrl:value.imgUrl,
        type:value.type,
        skipType:value.skipType,
        url:value.url,
        showTime:value.showTime,
        unShelveTime:value.unShelveTime,
        isShow:value.isShow,
        sort:value.sort,
        projectType:value.projectType
      }
    }
    this.http.post(this.saveUrl, this.saveData).subscribe((res:any) => {
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
