import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { transFormData } from '@shared';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AdvertisHotSearchEditComponent } from '../hot-search-edit/hot-search-edit.component';

@Component({
  selector: 'app-advertis-hot-search',
  templateUrl: './hot-search.component.html',
})
export class AdvertisHotSearchComponent implements OnInit {
  url = `/admin_hot_search/get`;
  editUrl = '/admin_hot_search/set';
  addUrl = '/admin_hot_search/save';
  pageData = {
    data: {},
    total: 0
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
      type: {
        type: 'string',
        title: '展示类型',
        enum:[
          {value: '',label:'全部'},
          {value: 0,label:'pc热门搜索'},
          {value: 1,label:'app热门搜索'},
          {value: 2,label:'热门标签'}
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
  columns: STColumn[] = [//ID、展示类型、关键词、跳转链接、排序、创建时间
    { title: 'ID', index: 'id' },//类型（0.pc热门搜索，1.app热门搜索 2.热门标签)
    { title: '展示类型', index: 'type',format: (item)=>{
      if (item.type==0) {
        return 'pc热门搜索'
      } else if(item.type==1){
        return 'app热门搜索'
      }else if(item.type==2){
        return '热门标签'
      }
    } },
    { title: '关键词', index: 'name' },
    { title: '跳转链接',index: 'url',},
    { title: '创建时间',index: 'createTime',type: 'date',},
    { title: '排序',index: 'sort'},
    {
      title: '操作',
      buttons: [
        { text: '修改', click: (item)=>{this.edit(item)}},
        { text: '删除',  click: (item)=>{this.delete(item)}},
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService,) { }

  ngOnInit() {
    this.getpage()
  }
  ngAfterViewInit(){

  }
  reply(id){
    this.http.get('/admin_brand_advisory/set_status',{id:id}).subscribe((res)=>{
      this.st.reload();
    });
  };
  getpage(){
    this.http.get(this.url,{pageNum:1}).subscribe((res: any) => {
      console.log(res);
      this.pageData.data = res.data.list;
      this.pageData.total = res.data.total;
      console.log(this.pageData)
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
      console.log(item);
      item.device=item.type;
      this.modal.createStatic(AdvertisHotSearchEditComponent,{i:item,saveUrl:this.editUrl}).subscribe(() => {this.st.reload()});
  }
  delete(item){
    this.http.get('/admin_hot_search/del',{
      id:item.id,
      device:item.type
    }).subscribe((res: any) => {
      if(res.code==12000){
        this.msgSrv.success('删除成功');
        this.st.reload();
      }
    })
  }
  add(){
    this.modal.createStatic(AdvertisHotSearchEditComponent,{saveUrl:this.addUrl}).subscribe(() => {this.st.reload()});
  }

}
