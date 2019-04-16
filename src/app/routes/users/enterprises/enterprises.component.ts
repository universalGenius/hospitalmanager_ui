import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema,SFComponent } from '@delon/form';
import { environment } from '@env/environment';

@Component({
  selector: 'app-users-enterprises',
  templateUrl: './enterprises.component.html',
})
export class UsersEnterprisesComponent implements OnInit {
  url = `/enterprises_enter/get_list`;
  pageData = {
    data: {},
    total: 0
  };

  searchSchema: SFSchema = {
    properties: {
      companyBrandName:{
        type: 'string',
        title: '公司/品牌名称'
      },
      name:{
        type: 'string',
        title: '用户名'
      },
      phone:{
        type:'string',
        title:'手机号码'
      }
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '品牌名称', index: 'brandName' },
    { title: '公司名称', index: 'companyName' },
    { title: '姓名', index: 'name' },
    { title: '手机号', index: 'phone' },
    { title: '创建时间', index: 'createTime',type:'date' },
    { title: '省', index: 'provinceName' },
    { title: '市', index: 'cityName' }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() {
    this.http.post(this.url, { pageNum: 1}).subscribe((res: any) => {
      this.pageData.data = res.data.list;
      this.pageData.total = res.data.total;
    })
  }
  exportPara='';
  goDownload() {
    this.exportPara='';
    for (const key in this.sf.value) {
      if (this.sf.value.hasOwnProperty(key)&&key!='pageNum') {
        this.exportPara+=key+'='+this.sf.value[key]+'&';
      }
    }
    console.log(this.exportPara.substring(0,this.exportPara.length-1))
    window.location.href = environment.SERVER_URL + `/enterprises_enter/export?`+this.exportPara.substring(0,this.exportPara.length-1);
  }

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
      console.log(event.pi);
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
  // checkDetail(item){
  //   this.http.get('/admin_user/get_user',{id:item.id}).subscribe((res: any) => {
  //     console.log(res,88888888888);
  //     this.modal.createStatic(UsersUsersDetailComponent,{i:res}).subscribe(() => {});
  //   })
  // }
  // editPhoto(item){
  //   this.modal.createStatic(UsersUsersPhotoEditComponent,{i:item}).subscribe(() => this.st.reload());
  // }
  // setPhone(item){
  //   this.modal.createStatic(UsersUsersSetphoneComponent,{i:item}).subscribe(() => this.st.reload());
  // }
  // sendMessage(item){
  //   this.modal.createStatic(UsersUsersSendmessageComponent,{i:item}).subscribe(() => this.st.reload());
  // }

}
