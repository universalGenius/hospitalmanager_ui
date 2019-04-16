import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';

@Component({
  selector: 'app-info-login-message',
  templateUrl: './login-message.component.html',
})
export class InfoLoginMessageComponent implements OnInit {
  url = `/account_manager/get_login_record_list`;
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
        title: '公司名称/姓名'
      },
      phone: {
        type: 'string',
        title: '手机号'
      }
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [//id、用户id、用户名、姓名/公司名称、身份、手机号、登录IP、登录时间、登录类型、登录方式
    { title: 'ID', index: 'id' },
    { title: '用户ID', index: 'userId' },
    { title: '用户名', index: 'userName' },
    { title: '姓名/公司名称', render: 'names',width:'200px' },
    { title: '身份', index: 'type',format:item=>{
      if(item.type==1){
        return '企业'
      } else if(item.type==2){
        return '个人'
      }else{
        return '管理员'
      }
    } },
    { title: '手机号', index: 'phone' },
    // { title: '登录界面', index: 'featuresType',format:(item)=>item.featuresType==0?'前台':'后台管理' },
    { title: '登录IP', index: 'ip' },
    { title: '登录时间', index: 'loginTime' },
    { title: '登录方式', index: 'loginType',format:item=>{
      switch (item.loginType) {//1.账号密码，2.短信，3.QQ，4.微信 5.快捷登录 6.注册自动登录
        case 1: return '账号密码'
          break;
        case 2: return '短信'
          break;
        case 3: return 'QQ'
          break;
        case 4: return '微信'
          break;
        case 5: return '快捷登录'
          break;
        case 6: return '注册自动登录'
          break;
        default: return ''
          break;
      }
    } },
    { title: '登录类型', index: 'device',format:item=>{
      if(item.device==0){
        return 'PC'
      }else if(item.device==1){
        return '安卓'
      }else if(item.device==2){
        return 'IOS'
      }else{
        return '其他设备'
      }
    } }
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
}
