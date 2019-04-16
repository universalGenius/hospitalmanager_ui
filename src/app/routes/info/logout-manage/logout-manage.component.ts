import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { InfoLogoutEditComponent } from '../logout-edit/logout-edit.component';

@Component({
  selector: 'app-info-logout-manage',
  templateUrl: './logout-manage.component.html',
})
export class InfoLogoutManageComponent implements OnInit {
  url = `/account_manager/get_logout_user_list`;
  addUrl = '/account_manager/save_logout_user';
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
      names: {
        type: 'string',
        title: '姓名/公司名称'
      },
      phone: {
        type: 'string',
        title: '手机号'
      },
      type: {
        type: 'string',
        title: '用户类型',
        enum:[
          {value: '',label:'全部'},
          {value: 1,label:'企业'},
          {value: 2,label:'个人'}
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
    { title: '用户ID', index: 'userId' },
    { title: '用户名', index: 'userName' },
    { title: '姓名/公司名称', index: 'names' },
    { title: '身份', index: 'type',format:item=>{
      if(item.type==0){
        return '未完善信息'
      }else if(item.type==1){
        return '企业'
      }else if(item.type==2){
        return '个人'
      }else{
        return '去死'
      }
    } },
    { title: '手机号', index: 'phone' },
    { title: '注销状态', index: 'isDel', format:item=>{
      if(!item.isDel){
        return '正常'
      }else if(item.isDel){
        return '已注销'
      }
    }},
    { title: '注销操作人', index: 'operator' },
    { title: '注销原因', index: 'reason' },
    { title: '注销时间', index: 'createTime' },
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() {
    this.getpage()
  }

  getpage(){
    this.http.get(this.url,{pageNum:1}).subscribe((res: any) => {
      console.log(res);
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
      this.http.get(this.url, this.searchData).subscribe((res: any) => {
        console.log(res);
        this.pageData.data = res.data.list;
        this.pageData.total = res.data.total;
        console.log(this.pageData);
      })
    }
  }
  search(e) {
    this.st.load(1);
  }

  reset(e) {
    this.st.reset();
  }


  search1(e){

    console.log(e,1111111111111111111)
    this.http.get(this.url,e).subscribe((res: any) => {
      console.log(res);
      this.pageData.data = res.data.list;
      this.pageData.total = res.data.total;
    })
  }

  add() {
    this.modal.createStatic(InfoLogoutEditComponent,{saveUrl:this.addUrl}).subscribe(() => this.st.reload());
  }
}
