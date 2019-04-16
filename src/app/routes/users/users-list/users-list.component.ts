import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { UsersUsersDetailComponent } from '../users-detail/users-detail.component';
import { UsersUsersPhotoEditComponent } from '../users-photo-edit/users-photo-edit.component';
import { UsersUsersSetphoneComponent } from '../users-setphone/users-setphone.component';
import { UsersUsersSendmessageComponent } from '../users-sendmessage/users-sendmessage.component';

import { environment } from '@env/environment';
import { ViewImg } from '@core/view-img/view-img.service';

@Component({
  selector: 'app-users-users-list',
  templateUrl: './users-list.component.html',
})
export class UsersUsersListComponent implements OnInit {
  url = `/admin_user/get`;
  pageData = {
    data: {},
    total: 0
  };

  searchSchema: SFSchema = {
    properties: {
      name:{
        type: 'string',
        title: '姓名/公司名称'
      },
      userName:{
        type: 'string',
        title: '用户名'
      },
      phone:{
        type:'string',
        title:'手机号码'
      },
      status:{
        type:'number',
        title:'封号',
        enum:[{value:0,label:'正常'},{value:1,label:'封号'},{value:2,label:'已注销'}],
        ui:{
          width:200,
          widget:'select'
        }
      },
      type:{
        type:'number',
        title:'身份',
        enum:[{value:1,label:'企业'},{value:2,label:'个人'}],
        ui:{
          width:200,
          widget:'select'
        }
      }
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: 'avatar', type: 'img', render: 'avatar' },
    { title: '用户名', index: 'userName' },
    { title: '姓名/公司姓名', render: 'name', width:'200px' },
    { title: '手机号', index: 'phone' },
    { title: '身份', index: 'type',format: (item) => {
      if (item.type === 1) {
        return '企业'
      } else if(item.type === 2) {
        return '个人';
      }else{
        return '未选择';
      }
    } },
    { title: '微信openid', index: 'weChatOpenid',format: item => item.weChatOpenid?item.weChatOpenid:'未填写' },
    { title: 'QQopenid', index: 'qqOpenid',format: item => item.qqOpenid?item.qqOpenid:'未填写' },
    { title: '账号状态', index: 'status',format: (item) => {
      if (item.isDel === 1) {
        return '已注销'
      } else {
        if (item.status === 0) {
          return '正常'
        } else if(item.status === 1) {
          return '封号'
        }else{
          return ''
        }
      }
    } },
    { title: '注册时间', index: 'createTime', type:'date' },
    { title: '更新时间', index: 'updateTime',type:'date' },
    {
      title: '操作',
      buttons: [
        { text: '发送短信', iif:(item)=>false, click: (item)=>{this.sendMessage(item)}},
        { text: '换绑手机', click: (item)=>{this.setPhone(item)} },
        { text: '详情', click: (item)=>{this.checkDetail(item)}},
        { text: '修改头像',iif:(item)=>item.type === 2, click: (item)=>{this.editPhoto(item)} },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper,public viewImgService:ViewImg) { }

  ngOnInit() {
    this.http.post(this.url, { pageNum: 1}).subscribe((res: any) => {
      this.pageData.data = res.data.list;
      this.pageData.total = res.data.total;
    })
  }

  // goDownload() {
  //   // window.location.href = environment.SERVER_URL;
  // }

  getPage(event) {
    console.log(222)
    this.http.post(this.url).subscribe((res: any) => {
      this.pageData.data = res.data.list;
      this.pageData.total = res.data.total;
    })
  }

  searchData:any = {}
  change(event) {
    if(event.type == 'pi'){
      this.searchData = this.sf.value;
      this.searchData.pageNum=event.pi;
      console.log(this.searchData);
      this.http.post(this.url, this.searchData).subscribe((res: any) => {
        console.log(res);
        this.pageData.data = res.data.list;
       this.pageData.total = res.data.total;
      })
    }
  }
  search(e) {
    this.st.load(1);
  }

  reset(e) {
    this.st.reset();
  }
  checkDetail(item){
    this.http.get('/admin_user/get_user',{id:item.id}).subscribe((res: any) => {
      console.log(res,88888888888);
      this.modal.createStatic(UsersUsersDetailComponent,{i:res.data}).subscribe(() => {});
    })
  }
  editPhoto(item){
    this.modal.createStatic(UsersUsersPhotoEditComponent,{i:item}).subscribe(() => this.st.reload());
  }
  setPhone(item){
    this.modal.createStatic(UsersUsersSetphoneComponent,{i:item}).subscribe(() => this.st.reload());
  }
  sendMessage(item){
    this.modal.createStatic(UsersUsersSendmessageComponent,{i:item}).subscribe(() => this.st.reload());
  }

}
