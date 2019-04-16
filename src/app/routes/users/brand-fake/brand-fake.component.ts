import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { UsersBrandFakeEditComponent } from '../brand-fake-edit/brand-fake-edit.component';
import { ViewImg } from '@core/view-img/view-img.service';

@Component({
  selector: 'app-users-brand-fake',
  templateUrl: './brand-fake.component.html',
})
export class UsersBrandFakeComponent implements OnInit {
  url = `/admin_index_ifeame_brand/get`;
  addUrl = '/admin_index_ifeame_brand/save';
  editUrl = '/admin_index_ifeame_brand/set';
  deleteUrl = '/admin_index_ifeame_brand/del';
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
      name: {
        type: 'string',
        title: '品牌名称'
      }
    }
  };
  // pageNum	否	int	页数，默认为1
  // name	否	string	假品牌名称
  // id	number	id
  // name	string	假品牌名称
  // logo	string	logo
  // slogan	number	宣传标语
  // isDel	boolean	是否删除0否1是
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '品牌名称', index: 'name' },
    { title: 'logo', render: 'logo' },
    { title: '宣传标语', render: 'slogan' },
    // { title: '静态资源类型', index: 'sysStaticInfoTitle', },
    { title: '是否删除', index: 'isDel',format:item=>item.isDel?'是':'否' },
    {
      title: '操作',
      buttons: [
        { text: '修改', click: (item)=>{this.edit(item)}},
        { text: '删除',iif: item => !item.isDel , click: (item)=>{this.delete(item)}}
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService,public viewImgService:ViewImg) { }

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

  edit(item){
    this.modal.createStatic(UsersBrandFakeEditComponent,{i:item,saveUrl:this.editUrl}).subscribe(() => {this.st.reload();});
  }
  delete(item){
    console.log({id:item.id});
    this.http.get(this.deleteUrl,{id:item.id}).subscribe((res: any) => {
      console.log(res);
      if(res.code==12000){
        this.msgSrv.success('删除成功');
        this.st.reload();
      }
    })
  }
  add() {
    this.modal.createStatic(UsersBrandFakeEditComponent,{saveUrl:this.addUrl}).subscribe(() => this.st.reload());
  }

}
