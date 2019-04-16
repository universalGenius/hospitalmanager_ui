import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { InfoBrandNewsCheckFailComponent } from '../brand-news-check-fail/brand-news-check-fail.component';
import { InfoBrandNewsContentComponent } from '../brand-news-content/brand-news-content.component';
import { ViewImg } from '@core/view-img/view-img.service';

@Component({
  selector: 'app-info-brand-news-check',
  templateUrl: './brand-news-check.component.html',
})
export class InfoBrandNewsCheckComponent implements OnInit {
  url = `/admin_banner_news/get`;
  checkPassUrl = '/admin_banner_news/set_status_pass';
  checkFailUrl = '/admin_banner_news/set_status_out';
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
      title: {
        type: 'string',
        title: '文章标题'
      },
      brandName: {
        type: 'string',
        title: '品牌名称'
      },
      status: {
        type: 'string',
        title: '审核状态',
        enum:[
          {value: '',label:'全部'},
          {value: 0,label:'待审核'},
          {value: 1,label:'审核成功'},
          {value: 2,label:'审核失败'},
          {value: 3,label:'已删除'}
        ],
        ui:{
          width:200,
          widget:'select'
        }
      }
    }
  };
//   ID、用户名、公司名称、所属品牌、手机号、文章封面图、文章标题、文章内容
// 4.	有操作，包括刷新、下架、上架、审核通过、审核失败

  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '用户名', index: 'userName' },
    { title: '公司名称', render: 'companyName', width:'200px' },
    { title: '所属品牌', render: 'brandName', width:'200px' },
    { title: '手机号', index: 'phone' },
    {
      title: '文章封面图',
      render:'cover'
      // index: 'cover',
      // type:'img',
      // buttons: [
      //   { text: '查看原图',click: (item)=>{console.log(item)}}
      // ]

    },
    {
      title: '审核状态',
      index: 'status',
      format: (item) => {
        if(item.isDel){
          return '已删除'
        }else{
          if(item.status==0){
            return '待审核'
          }else if(item.status==1){
            return '审核通过'
          }else if(item.status==2){
            return '审核失败'
          }else{
            return '未知'
          }
        }
      },
      type:'badge',
      badge:{
        '已删除':{ text: '已删除', color: 'error' },
        '待审核':{ text: '待审核', color: 'warning' },
        '审核通过':{ text: '审核通过', color: 'success' },
        '审核失败':{ text: '审核失败', color: 'error' },
        '未知':{ text: '未知', color: 'default' },
      }
    },
    { title: '文章标题', render: 'title', width:'200px' },
    {
      title: '文章内容',
      buttons: [
        { text: '查看文章内容',click: (item)=>{this.showContent(item)}}
      ]
    },
    {
      title: '操作',
      buttons: [
        { text: '审核通过',iif:(item) => !item.isDel&&item.status!=1,click: (item)=>{this.checkPass(item)}},
        { text: '审核失败',iif:(item) => !item.isDel&&item.status!=2,click: (item)=>{this.checkFail(item)}},
      ]
    }
  ];

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private msgSrv: NzMessageService,
    public viewImgService:ViewImg) {

  }

  ngOnInit() {
    this.getpage()
  }

  getpage(){
    this.http.post(this.url,{pageNum:1}).subscribe((res: any) => {
      console.log(res);
      this.pageData.data = res.data.list;
      this.pageData.total = res.data.total;
    })
  }
  searchData:any = {}
  change(event) {
    if(event.type == 'pi'){
      this.searchData = this.sf.value;
      console.log(this.sf.value,'sf');
      this.searchData.pageNum=event.pi;
      console.log(this.searchData);
      this.http.post(this.url, this.searchData).subscribe((res: any) => {
        console.log(res);
        this.pageData.data = res.data.list;
        this.pageData.total = res.data.total;
      })
    }
  }
  search(e) {
    console.log(e);
    this.st.load(1);
  }

  reset(e) {
    this.st.reset();
  }

  showContent(item){
    this.modal.createStatic(InfoBrandNewsContentComponent,{i:item.content}).subscribe(() => {});
  }

  checkPass(item){
    this.http.post(this.checkPassUrl,{id:item.id}).subscribe((res: any) => {
      console.log(res);
      if(res.code==12000){
        this.msgSrv.success('审核通过成功');
        this.st.reload();
      }
    })
  }
  checkFail(item){
    this.modal.createStatic(InfoBrandNewsCheckFailComponent,{saveUrl:this.checkFailUrl,id:item.id}).subscribe(() => this.st.reload());
  }
  add() {
    // this.modal
    //   .createStatic(FormEditComponent, { i: { id: 0 } })
    //   .subscribe(() => this.st.reload());
    // this.modal.createStatic(InfoHeadReportEditComponent,{saveUrl:this.addUrl}).subscribe(() => this.st.reload());
  }
}
