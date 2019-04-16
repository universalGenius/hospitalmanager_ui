import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { UsersCompanyEditComponent } from '../company-edit/company-edit.component';
import { UsersCompanyDetailComponent } from '../company-detail/company-detail.component';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { ViewImg } from '@core/view-img/view-img.service';

@Component({
  selector: 'app-users-company',
  templateUrl: './company.component.html',
})
export class UsersCompanyComponent implements OnInit {
  url = `/corporate_user_manager/get_company_list`;
  editUrl = `/corporate_user_manager/update_company`;
  addUrl = `/corporate_user_manager/register`;
  pageData = {
    data: {},
    page: 1,
    total: 0,
    size: 10
  };
  searchSchema: SFSchema = {
    properties: {
      pageNum: {
        type:'number',
        default:1,
        ui:{
          hidden:true
        }
      },
      names:{
        type:'string',
        title:'公司名称/用户名',
      },
      phone:{
        type:'string',
        title:'注册手机号'
      },
      isStand:{
        type:'boolean',
        title:'是否下架',
        enum:[{label:'全部',value:''},{label:'未下架',value:false},{label:'已下架',value:true}],
        ui:{
          width:180,
          widget:'select'
        }
      }
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: 'logo', type: 'img', render: 'logo' },
    // { title: '公司名称', index: 'name', width:'200px',format:item=>item.name.length<34?item.name:item.name.substring(0,34)+'...' },
    // { title: '品牌名称', index: 'brandName', width:'200px',format:item=>item.brandName?item.brandName.length<34?item.brandName:item.brandName.substring(0,34)+'...':'木有写' },
    // { title: '地址', index: 'address', width:'200px',format:item=>item.address.length<34?item.address:item.address.substring(0,34)+'...' },
    { title: '公司名称',render: 'name', width:'200px' },
    { title: '品牌名称',render: 'brandName',width:'200px' },
    { title: '地址', render: 'address', width:'200px' },
    // { title: '是否下架',index: 'isStand',format:item=>item.isStand?'已下架':'未下架' },
    { title: '是否下架',index: 'isStand',type: 'badge', badge: {
      false: { text: '未下架', color: 'success' },
      true: { text: '已下架', color: 'error' },
    } },
    { title: '注册时间', index: 'createTime' },
    { title: '用户名', index: 'userName' },
    { title: '注册手机号', index: 'userPhone' },
    { title: '最后活跃时间', index: 'lastLoginTime' },
    {
      title: '操作',
      buttons: [
        // 刷新、修改企业信息、下架、上架、审核通过、审核失败、自定义排序
        { text: '详情', click: (item)=>{this.checkDetail(item)}},
        { text: '修改', click: (item)=>{this.edit(item)} },
        { text: '下架', click: (item)=>{this.standUpAndDown(item,true)},iif:(item)=>!item.isStand },
        { text: '上架', click: (item)=>{this.standUpAndDown(item,false)},iif:(item)=>item.isStand, }
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper,private msgSrv: NzMessageService,public viewImgService:ViewImg) { }

  ngOnInit() {
    this.http.get(this.url,{}).subscribe((res: any) => {
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
      })
    }
  }
  search(e) {
    this.st.load(1);
  }

  reset() {
    this.st.reset();
  }

  getPage(event,sf) {
    if(event.type == 'pi'){
      let data = sf.value
      data.pageNum = event.pi
      Object.assign(event,data);
      this.http.get(this.url,event).subscribe((res: any) => {
        this.pageData.data = res.data.list;
        this.pageData.total = res.data.total;
      })
    }
  }

  standUpAndDown(item,isStand){
    this.http.get('/corporate_user_manager/set_company_is_stand', {companyId:item.id,isStand:isStand}).subscribe((res: any) => {
      if(res.code===12000){
        this.msgSrv.success('保存成功');
        this.st.reload()
      }
    })
  }

  checkDetail(item){
    this.http.get('/corporate_user_manager/get_company',{companyId:item.id}).subscribe((res: any) => {
      console.log(res,88888888888);
      this.modal.createStatic(UsersCompanyDetailComponent,{i:res.data}).subscribe(() => {});
    })
  }

  edit(item){
      this.http.get(`/drop_down_box/get_province_city_all`)
      .subscribe((res:any) => {
        if(item.provinceId!=0){
          item.cityList=[item.provinceId];
          if(item.cityId!=0){
            item.cityList.push(item.cityId);
            if(item.districtId!=0){
              item.cityList.push(item.districtId);
            }
          }
        }
        item.cityListEnum=res.data;
        this.modal.createStatic(UsersCompanyEditComponent,{i:item,saveUrl:this.editUrl}).subscribe(() => this.st.reload());
      })
  }
  add(item){
    this.http.get(`/drop_down_box/get_province_city_all`)
      .subscribe((res:any) => {
        item.cityListEnum=res.data;
        this.modal.createStatic(UsersCompanyEditComponent,{i:item,saveUrl:this.addUrl}).subscribe(() => this.st.reload());
      })
  };

}
