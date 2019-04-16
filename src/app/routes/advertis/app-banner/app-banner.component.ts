import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { transFormData } from '@shared';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AdvertisAppBannerEditComponent } from '../app-banner-edit/app-banner-edit.component';
import { ViewImg } from '@core/view-img/view-img.service';

@Component({
  selector: 'app-advertis-app-banner',
  templateUrl: './app-banner.component.html',
})
export class AdvertisAppBannerComponent implements OnInit {
  url = `/banner_app_manager/get_banner_list`;
  editUrl = '/banner_app_manager/update_banner';
  addUrl = '/banner_app_manager/save_banner';
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
        title: 'Banner类型',
        enum:[//7、首页banner 8、头报banner 9、广告页
          {value: '',label:'全部'},
          {value: 7,label:'首页banner'},
          {value: 8,label:'头报banner'},
          {value: 9,label:'广告页'},
          {value: 10,label:'登录'}
        ],
        ui:{
          width:300,
          widget:'select'
        }
      },
      mobilePhoneType: {//1.全部、2.ios、3.安卓、4.iPhoneX
        type: 'string',
        title: '手机类型',
        enum:[
          {value: '',label:'全部'},
          {value: 2,label:'ios'},
          {value: 3,label:'安卓'},
          {value: 4,label:'iPhoneX'}
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
      format: (item) => {////7、首页banner 8、头报banner 9、广告页
        switch (item.type) {
          case 7:return '首页banner';
          case 8:return '头报banner';
          case 9:return '广告页';
          case 10:return '登录';
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
    {
      title: '手机类型',
      index: 'mobilePhoneType',
      format: (item) => {//(1.全部、2.ios、3.安卓、4.iPhoneX)
        switch (item.mobilePhoneType) {
          case 1:return '全部';
          case 2:return 'ios';
          case 3:return '安卓';
          case 4:return 'iPhoneX';
          break;
          default:return ''
          break;
        }
      }
    },
    { title: '跳转链接',index: 'url',},
    { title: '创建时间',index: 'createTime',},
    { title: '展示时间',index: 'showTime',},
    { title: '下架时间',index: 'unShelveTime',format: (item) => item.unShelveTime?item.unShelveTime:'永久' },
    {
      title: '是否展示',
      index: 'isShow',
      format: (item) => item.isShow?'展示':'不展示'
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
    this.http.get('/banner_app_manager/edit_banner',{bannerId:item.id}).subscribe((res: any) => {
      console.log(res);
      this.modal.createStatic(AdvertisAppBannerEditComponent,{i:res.data,saveUrl:this.editUrl}).subscribe(() => this.st.reload());
    })
  }
  delete(item){
    this.http.get('/banner_app_manager/delete_banner',{bannerId:item.id}).subscribe((res: any) => {
      if(res.code==12000){
        this.msgSrv.success('删除成功');
        this.st.reload()
      }
    })
  }
  add(){
    this.modal.createStatic(AdvertisAppBannerEditComponent,{saveUrl:this.addUrl}).subscribe(() => this.st.reload());
  }
}
