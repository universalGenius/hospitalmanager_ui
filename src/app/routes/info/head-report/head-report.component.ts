import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { InfoHeadReportEditComponent } from '../head-report-edit/head-report-edit.component';
import { ViewImg } from '@core/view-img/view-img.service';

@Component({
  selector: 'app-info-head-report',
  templateUrl: './head-report.component.html',
})
export class InfoHeadReportComponent implements OnInit {
  url = `/admin_head_newspaper/get`;
  addUrl = '/admin_head_newspaper/save';
  editUrl = '/admin_head_newspaper/set';
  deleteUrl = '/admin_head_newspaper/del';
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
      title: {
        type: 'string',
        title: '标题'
      },
      isShow: {
        type: 'string',
        title: '是否展示',
        enum:[
          {value: '',label:'全部'},
          {value: 0,label:'展示'},
          {value: 1,label:'不展示'}
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
    { title: '文章封面图', render: 'banner', },
    { title: '文章标题', render: 'title',width:'250px' },
    { title: '来源', index: 'source',width:'250px' },
    { title: '文章内容', render: 'content',width:'300px' },
    { title: '是否展示', index: 'isShow',format: item=> item.isShow==0?'展示':'不展示' },
    { title: '发布时间', index: 'createTime',type:'date' },
    { title: '排序', index: 'sort' },
    {
      title: '操作',
      buttons: [
        { text: '删除',click: (item)=>{this.delete(item)}},
        { text: '修改',click: (item)=>{this.edit(item)}}
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
    this.modal.createStatic(InfoHeadReportEditComponent,{i:item,saveUrl:this.editUrl}).subscribe(() => {this.st.reload();});
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
    this.modal.createStatic(InfoHeadReportEditComponent,{saveUrl:this.addUrl}).subscribe(() => this.st.reload());
  }
}
