import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { ViewImg } from '@core/view-img/view-img.service';

@Component({
  selector: 'app-info-certificate-check',
  templateUrl: './certificate-check.component.html',
})
export class InfoCertificateCheckComponent implements OnInit {
  leftUrl = `/certificate_check/get_company_list`;
  rightUrl = `/certificate_check/get_certificate_list`;

  editUrl = '/admin_food_type/set';
  addUrl = '/admin_food_type/save';

  leftdata=[];
  lefttotal=0;
  rightdata=[];
  righttotal=0;

  fatherList=[];
  searchSchema: SFSchema = {
    properties: {
      pageNum: {
        type: 'string',
        title: '',
        ui:{
          hidden:true
        }
      },
      keywords: {
        type: 'string',
        title: '关键字（公司/品牌名称）'
      },
      status: {
        type: 'string',
        title: '	证书审核状态',
        enum:[
          {value: '',label:'全部'},
          {value: 0,label:'审核中'},
          {value: 1,label:'审核成功'},
          {value: 2,label:'审核失败'}
        ],
        ui:{
          width:200,
          widget:'select'
        }
      },
    }
  };
  @ViewChild('stl') stl: STComponent;
  @ViewChild('str') str: STComponent;
  @ViewChild('sf') sf: SFComponent;
//   a)	Id
// b)	用户id
// c)	公司名称
// d)	手机号
// e)	上传时间
  columnsl: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '用户ID', index: 'userId' },
    { title: '公司名称', render: 'name',width:'200px' },
    { title: '手机号', index: 'phone',format:(item)=>item.phone?item.phone:item.userPhone?item.userPhone:'' },
    { title: '上传时间', index: 'certificateUpdateTime' },
  ];
//   a)	Id
// b)	公司名称
// c)	品牌名称
// d)	证书名称
// e)	证书图片：点击可查看大图
// f)	认证状态（待审核/审核成功/审核失败）
// g)	是否删除

  columnsr: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '公司名称', render: 'companyName',width:'200px' },
    { title: '品牌名称', render: 'brandName',width:'200px' },
    { title: '证书名称', index: 'name' },
    { title: '认证图片', render: 'imgUrl',type:'img' },
    { title: '证书状态', index: 'status',format:(item)=>{
      if(item.status==0){
        return '审核中'
      }else if(item.status==1){
        return '审核成功'
      }else if(item.status=2){
        return '审核失败'
      }else if(item.status==3){
        return '已修改'
      }
    } },
    { title: '是否删除', index: 'isDel',format:(item)=>item.isDel?'是':'否' },
    // { title: '二级分类图片', type: 'img', width: '50px', index: 'logo' },
    {
      title: '操作',
      buttons: [
        { text: '审核通过',iif:item=>item.status!==1, click: (item: any) => {this.check(item,1)} },
        { text: '审核失败',iif:item=>item.status!==2, click: (item: any) => {this.check(item,2)} },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper,private msgSrv: NzMessageService,public viewImgService:ViewImg) { }

  ngOnInit() {
    this.getLeftData();
    console.log(this.leftdata,111111111);
    console.log(this.msgSrv);
    console.log(this.modal);
  }

  getLeftData(data={}){
    console.log(data);
    this.http.get(this.leftUrl,data).subscribe((res: any) => {
      console.log(res,'lllllllllllllll');
      this.leftdata = res.data.companyList.list;
      this.lefttotal = res.data.companyList.total;

      this.companyId=res.data.companyList.list.length>0?res.data.companyList.list[0].id:'';
      this.righttotal = res.data.certificateList.length;
      this.rightdata = res.data.certificateList;
      this.rightdata==null?this.rightdata=[]:'';
      console.log(this.rightdata);
    })
  }

  getRightData(data={}){
    console.log(data);
    this.http.get(this.rightUrl,data).subscribe((res: any) => {
      console.log(res,'rrrrrrrrrrr');
      this.rightdata = res.data;
      this.righttotal = res.data.length;
    })
  }
  companyId = ''
  searchData:any = {}
  change(event) {
    if(event.type == 'pi'){
      this.searchData = this.sf.value;
      this.searchData.pageNum=event.pi;
      console.log(this.searchData);
      this.http.get(this.leftUrl, this.searchData).subscribe((res: any) => {
        console.log(res);
        this.leftdata = res.data.companyList.list;
        this.lefttotal = res.data.companyList.total;

        this.companyId=res.data.companyList.list.length>0?res.data.companyList.list[0].id:'';
        this.rightdata = res.data.certificateList;
        this.rightdata==null?this.rightdata=[]:'';
      })
    }else if(event.type == 'click'){
      this.companyId=event.click.item.id;
      this.getRightData({companyId:event.click.item.id})
    }
  }
  search(e) {
    this.stl.load(1);
  }

  reset() {
    this.stl.reset();
  }

  edit(item){
    // this.modal.createStatic(DataCategoricalDataEditComponent,{
    //   i:item,
    //   custom:{
    //     isShow:item.fahterId?true:false,
    //     saveUrl:this.editUrl,
    //     fatherList:this.fatherList
    //   },
    // }).subscribe(() => {});
  }
  check(item,status){
    console.log({
      certificateId:item.id,
      status:status
    });
    this.http.post('/certificate_check/check_certificate',{
      id:item.id,
      status:status
    }).subscribe((res: any) => {
      console.log(res);
      if(res.code==12000){
        this.msgSrv.success('操作成功');
        this.getRightData({companyId:this.companyId})
      }
    })
  }
  add(isShow){
    // this.modal.createStatic(DataCategoricalDataEditComponent,{
    //   custom:{
    //     isShow:isShow,
    //     saveUrl:this.addUrl,
    //     fatherList:this.fatherList,
    //   }
    // }).subscribe(() => {});
  }

}
