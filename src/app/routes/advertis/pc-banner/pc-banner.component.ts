import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { transFormData } from '@shared';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AdvertisPcBannerEditComponent } from '../pc-banner-edit/pc-banner-edit.component';
import { ViewImg } from '@core/view-img/view-img.service';

@Component({
  selector: 'app-advertis-pc-banner',
  templateUrl: './pc-banner.component.html',
})
export class AdvertisPcBannerComponent implements OnInit {
  url = `/banner_pc_manager/get_banner_list`;
  editUrl = '/banner_pc_manager/update_banner';
  addUrl = '/banner_pc_manager/save_banner';
  pageData = {
    data: {},
    page: 1,
    total: 0,
    size: 10
  };
  searchSchema: SFSchema = {
    properties: {
      pageNum: {
        type: 'number',
        default:1,
        ui:{
          hidden:true
        }
      },
      isShow: {
        type: 'string',
        title: '是否展示',
        enum:[{value: '',label:'全部'},{value: true,label:'展示'},{value: false,label:'不展示'}],
        ui:{
          width:300,
          widget:'select'
        }
      },
      type: {
        type: 'string',
        title: 'Banner类型',//1、首页；2、盟盟红铺；3、头报，4、商铺首页默认 5.登录banner 6.引导页
        enum:[
          {value: '',label:'全部'},
          {value: 1,label:'首页'},
          {value: 2,label:'盟盟红铺'},
          {value: 3,label:'头报'},
          {value: 4,label:'商铺首页默认'},
          {value: 5,label:'登录banner'}
        ],
        ui:{
          width:300,
          widget:'select'
        }
      }
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '图片', render: 'imgUrl', },
    {
      title: 'Banner类型',
      index: 'type',
      format: (item) => {
        switch (item.type) {
          case 1:return '首页';
          case 2:return '盟盟红铺';
          case 3:return '头报';
          case 4:return '商铺首页默认';
          case 5:return '登录banner';
          break;
          default:return ''
          break;
        }
      }
    },
    {
      title: '跳转类型',
      index: 'skipType',
      format: (item) => {
        switch (item.skipType) {//1.未设置跳转链接 2.普通链接 3.头报文章链接 4.品牌详情
          case 1:return '未设置跳转链接';
          case 2:return '普通链接';
          case 3:return '头报文章链接';
          case 4:return '品牌详情';
          break;
          default:return ''
          break;
        }
      }
    },
    { title: '跳转链接',index: 'url',},
    { title: '创建时间',index: 'createTime',},
    { title: '展示时间',index: 'showTime',},//unShelveTime
    { title: '下架时间',index: 'unShelveTime',format: (item) => item.unShelveTime?item.unShelveTime:'永久' },
    {
      title: '是否展示',
      index: 'isShow',
      format: item =>  item.isShow?'展示':'不展示'
    },
    { title: '排序',index: 'sort'},
    {
      title: '操作',
      buttons: [
        // { text: '刷新', click: (item)=>{this.search(this)} },
        // { text: '发送短信', click: (item)=>{this.sendMessage(item)}},
        // { text: '新增', },
        { text: '修改', click: (item)=>{this.edit(item)}},
        { text: '删除',  click: (item)=>{this.delete(item)}},
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService,public viewImgService:ViewImg) { }

  ngOnInit() {
    this.http.get(this.url,{pageNum:1}).subscribe((res: any) => {
      console.log(res);
      this.pageData.data = res.data.list;
      this.pageData.total = res.data.total;
    })
  }
  ngAfterViewInit(){

  }
  searchData:any = {}
  change(event) {
    if(event.type == 'pi'){
      this.searchData = this.sf.value;
      this.searchData.pageNum=event.pi;
      console.log(this.searchData);
      this.http.get(this.url, this.searchData).subscribe((res: any) => {
        console.log(res);
        this.pageData.data = res.data.list;
       this.pageData.total = res.data.total;
      })
    }
  }
  search(e) {
    this.st.load(1);
  }

  reset() {
    this.st.reset();
  }

  edit(item){
    this.http.get('/banner_pc_manager/edit_banner',{bannerId:item.id}).subscribe((res: any) => {
      console.log(res);
      this.modal.createStatic(AdvertisPcBannerEditComponent,{i:res.data,saveUrl:this.editUrl}).subscribe(() => this.st.reload());
    })
  }
  delete(item){
    this.http.get('/banner_pc_manager/delete_banner',{bannerId:item.id}).subscribe((res: any) => {
      if(res.code==12000){
        this.msgSrv.success('删除成功');
        this.st.reload()
      }
    })
  }
  add(){
    this.modal.createStatic(AdvertisPcBannerEditComponent,{saveUrl:this.addUrl}).subscribe(() => this.st.reload());
  }
}
