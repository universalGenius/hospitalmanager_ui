import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { AdvertisAdvertisingDetailEditComponent } from '../advertising-detail-edit/advertising-detail-edit.component';
import { ViewImg } from '@core/view-img/view-img.service';


@Component({
  selector: 'app-advertis-advertising-detail',
  templateUrl: './advertising-detail.component.html',
})
export class AdvertisAdvertisingDetailComponent implements OnInit {
  url = `/admin_ad_space_details/get`;
  editUrl = '/admin_ad_space_details/set';
  addUrl = '/admin_ad_space_details/save';
  pageData = {
    data: [],
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
      spaceId: {
        type: 'string',
        title: '广告位置',
      },
      advertisers: {
        type: 'string',
        title: '广告主',
      }
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '广告主', index: 'advertisers' },
    { title: '广告图片', render: 'imgUrl',type:'img' },
    { title: '跳转链接',index: 'adUrl',type:'link',click:()=>{}},
    {
      title: '广告位置',
      index: 'adSpaceName',
      ui:{

      }
    },
    // { title: '模板名称',index: 'adSpaceName',},
    { title: '上架时间',index: 'shelfTime',type: 'date'},
    { title: '下架时间',index: 'obtainedTime',type: 'date'},
    { title: '状态',index: 'isShow',format:item=>item.isShow==0?'上架':'下架'},
    { title: '排序',index: 'sort'},
    { title: '创建时间',index: 'createTime',type: 'date'},
    {
      title: '操作',
      buttons: [
        { text: '修改', click: (item)=>{this.edit(item)}},
        // { text: '删除',  click: (item)=>{this.delete(item)}},
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService,public viewImgService:ViewImg) { }

  ngOnInit() {
    this.getpage()
  }
  ngAfterViewInit(){

  }
  reply(id){// /admin_ad_space/get
    this.http.get('/admin_brand_advisory/set_status',{id:id}).subscribe((res)=>{
      this.st.reload();
    });
  };
  getAdSpaceList(){
   this.http.get('/admin_ad_space/get').subscribe((res: any) => {
    this.adSpaceList=res.data.map(item=>({label:item.name,value:item.id}));
    console.log(this.adSpaceList)
   })
  }
  getpage(){
    this.http.get(this.url,{pageNum:1}).subscribe((res: any) => {
      console.log(res);
      this.pageData.data = res.data.list;
      this.pageData.total = res.data.total;
    })
  }
  searchData:any = {}
  adSpaceList=[]
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
    this.http.get('/admin_ad_space/get').subscribe((res: any) => {
      this.modal.createStatic(AdvertisAdvertisingDetailEditComponent,{
        i:item,
        saveUrl:this.editUrl,
        adSpaceList:this.adSpaceList=res.data.map(item=>({label:item.name,value:item.id}))
      }).subscribe(() => {this.st.reload()});
    })
  }
  delete(item){
    this.http.get('',{bannerId:item.id}).subscribe((res: any) => {
      if(res.code==12000){
        this.msgSrv.success('删除成功');
        this.st.reload()
      }
    })
  }
  add(){
    this.adSpaceList.length==0?this.getAdSpaceList():'';
    this.modal.createStatic(AdvertisAdvertisingDetailEditComponent,{saveUrl:this.addUrl,adSpaceList:this.adSpaceList}).subscribe(() => {this.st.reload()});
  }
}
