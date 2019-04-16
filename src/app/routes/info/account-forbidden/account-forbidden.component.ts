import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { InfoForbiddenAccountEditComponent } from '../forbidden-account-edit/forbidden-account-edit.component';

@Component({
  selector: 'app-info-account-forbidden',
  templateUrl: './account-forbidden.component.html',
})
export class InfoAccountForbiddenComponent implements OnInit {
  url = `/account_manager/get_freeze_user_list`;
  addUrl = '/account_manager/save_freeze_user';
  relieveUrl = '/account_manager/un_freeze_user';
  pageData = {
    data: {},
    total: 0,
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
        title: '用户名/公司名称/姓名'
      },
      phone: {
        type: 'string',
        title: '手机号'
      },
      status: {
        type: 'string',
        title: '账号状态',
        enum:[
          {value: '',label:'全部'},
          {value: 0,label:'正常'},
          {value: 1,label:'封号'}
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
    { title: '身份', index: 'type',format:item=>item.type==1?'企业':'个人' },//用户类型:1.企业，2.个人
    { title: '手机号', index: 'phone' },
    { title: '封号状态', index: 'status',format:item=>{
      if(item.status==0){
        return '正常'
      }else if(item.status==1){
        return '封号'
      }
    } },
    { title: '封号结束时间', index: 'endTime' },
    { title: '封号原因', index: 'reason' },
    { title: '封号操作人', index: 'operator' },
    { title: '创建时间', index: 'createTime' },
    {
      title: '操作',
      buttons: [
        // { text: '编辑', type: 'static', component: FormEditComponent, click: 'reload' },
        // { text: '刷新'},
        { text: '解除封号',click: (item)=>{this.relieve(item)}},
      ]
    }
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

  relieve(item){
    this.modal.createStatic(InfoForbiddenAccountEditComponent,{i:item,saveUrl:this.relieveUrl,typeString:'解封'}).subscribe(() => this.st.reload());
  }
  add() {
    this.modal.createStatic(InfoForbiddenAccountEditComponent,{saveUrl:this.addUrl,typeString:'封号'}).subscribe(() => this.st.reload());
  }

}
