import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AdvertisAdvertisingSpaceEditComponent } from '../advertising-space-edit/advertising-space-edit.component';


@Component({
  selector: 'app-advertis-advertising-space',
  templateUrl: './advertising-space.component.html',
})
export class AdvertisAdvertisingSpaceComponent implements OnInit {
  url = `/admin_ad_space/get`;
  editUrl = '/admin_ad_space/set';
  addUrl = '/admin_ad_space/save';
  pageData = {
    data: {},
    total: 0,
  };
  searchSchema: SFSchema = {
    properties: {
      // pageNum: {
      //   type: 'number',
      //   default:1,
      //   ui:{
      //     hidden:true
      //   }
      // },
      // spaceId: {
      //   type: 'string',
      //   title: '广告位置',
      // },
      // advertisers: {
      //   type: 'string',
      //   title: '广告主',
      // }
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },//id: 1, name: "首页", fatherId: 0, templateId: 0
    { title: '广告位名称', index: 'name' },
    { title: 'fatherId', index: 'fatherId' },
    { title: 'templateId', index: 'templateId' },
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
    this.http.get(this.url).subscribe((res: any) => {
      console.log(res);
      this.pageData.data = res.data;
      this.pageData.total = res.data.length;
    })
  }

  reset(){
    this.getpage()
  }

  edit(item){
      this.modal.createStatic(AdvertisAdvertisingSpaceEditComponent,{i:item,saveUrl:this.editUrl}).subscribe(() => {this.getpage()});
  }
  delete(item){
    this.http.get('/admin_ad_space/del',{id:item.id}).subscribe((res: any) => {
      if(res.code==12000){
        this.msgSrv.success('删除成功');
        this.getpage();
      }
    })
  }
  add(){
    this.modal.createStatic(AdvertisAdvertisingSpaceEditComponent,{saveUrl:this.addUrl}).subscribe(() => {this.getpage()});
  }
}
