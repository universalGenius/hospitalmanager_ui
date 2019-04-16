import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { environment } from '@env/environment';
import { transFormData } from '@shared';

@Component({
  selector: 'app-users-message',
  templateUrl: './message.component.html',
})
export class UsersMessageComponent implements OnInit,AfterViewInit {
  url = `/admin_brand_advisory/get`;
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
      name: {
        type: 'string',
        title: '姓名',
      },
      brandName: {
        type: 'string',
        title: '品牌名称'
      },
      userName: {
        type: 'string',
        title: '用户名称'
      },
      phone: {
        type: 'string',
        title: '手机号码'
      },
      status: {
        type: 'number',
        title: '回复状态',
        enum:[{value: 0,label:'待查看'},{value: 1,label:'已回复'}],
        ui:{
          width:200,
          widget:'select'
        }
      },
      beginTime: {
        type: 'string',
        format: 'date',
        title: '开始时间'
      },
      endTime: {
        type: 'string',
        format: 'date',
        title: '结束时间'
      },
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '用户名', index: 'userName' },
    { title: '姓名', index: 'name' },
    { title: '手机号码', index: 'phone' },
    { title: '微信', index: 'wx' },
    { title: '品牌名称',render: 'brandName',width:'300px',className:'break-all' },
    { title: '留言内容',render: 'message',width:'300px',className:'break-all' },
    { title: '城市',index: 'city',format:item=>(!!item.province?item.province:'')+((!!item.province&&!!item.city)?'-':'')+(!!item.city?item.city:'') },
    { title: '状态',index: 'status', format:(item:any)=>{
      return item.status == 0 ? '待查看':'已回复'
    }},
    { title: '账号状态',index: 'userStatus', format: (item) => {
      if (item.userIsDel === 1) {//zzzzzzzz
        return '已注销'
      } else {
        if (item.userStatus === 0) {
          return '正常'
        } else if(item.userStatus===1){
          return '封号'
        }else{
          return ''
        }
      }
    } },
    { title: '留言时间', type: 'date', index: 'createTime' },
    { title: '操作',buttons:[
      { text: '回复', type: 'static', iif: (item: any)=> item.status === 0, click: (item: any) => this.reply(item.id) },
    ] },
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() {
    this.http.post(this.url,{pageNum:1}).subscribe((res: any) => {
      this.pageData.data = res.data.list;
      this.pageData.total = res.data.total;
      console.log(res)
    })
  }
  ngAfterViewInit(){

  }
  reply(id){
    this.http.post('/admin_brand_advisory/set_status',{id:id}).subscribe((res)=>{
      this.st.reload();
    });
  };
  getPage(event,data = this.sf.value) {
    let e = {pageNum:event.pi}
    if(event.type == 'pi'){
      data.pageNum = event.pi
      Object.assign(e,data);
      this.http.post(this.url,e).subscribe((res: any) => {
        this.pageData.data = res.data.list;
        this.pageData.total = res.data.total;
      })
    }
  }

  exportPara='';
  goDownload0() {
    return
    this.exportPara='';
    for (const key in this.sf.value) {
      if (this.sf.value.hasOwnProperty(key)&&key!='pageNum') {
        this.exportPara+=key+'='+this.sf.value[key]+'&';
      }
    }
    console.log(this.exportPara.substring(0,this.exportPara.length-1))
    window.location.href = environment.SERVER_URL + `/admin_brand_advisory/download?`+this.exportPara.substring(0,this.exportPara.length-1);
  }
  goDownload() {
    delete this.sf.value.pageNum;
    window.location.href = environment.SERVER_URL + `/admin_brand_advisory/download?key=`+encodeURIComponent(JSON.stringify(this.sf.value));
  }

}
