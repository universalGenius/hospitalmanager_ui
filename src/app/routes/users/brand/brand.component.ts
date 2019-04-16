import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { UsersBrandEditComponent } from '../brand-edit/brand-edit.component';
import { UsersBrandDetailComponent } from '../brand-detail/brand-detail.component';
import { ViewImg } from '@core/view-img/view-img.service';
import { map } from 'rxjs/operators';
import { UsersBrandSortEditComponent } from '../brand-sort-edit/brand-sort-edit.component';

@Component({
  selector: 'app-users-brand',
  templateUrl: './brand.component.html',
})
export class UsersBrandComponent implements OnInit {
  url = `/brand_manager/get_brand_list`;
  sortUrl = `/brand_manager/set_brand_sort`;
  pageData = {
    data: {},
    total: 0
  };
  searchSchema: SFSchema = {
    properties: {
      keywords: {
        type: 'string',
        title: '关键字'
      },
      isStand: {//状态 0未下架 1已下架 2未删除 3已删除

        type: 'number',
        title: '是否下架',
        enum:[
          { label: '全部', value: null },
          { label: '未下架', value: 0 },
          { label: '已下架', value: 1 },
          { label: '未删除', value: 2 },
          { label: '已删除', value: 3 },
        ],
        ui:{
          width:180,
          widget:'select'
        }
      },
      status: {//0.审核中，1.发布成功，2.审核失败
        type: 'number',
        title: '审核状态',
        enum:[
          { label: '全部', value: null },
          { label: '审核中', value: 0 },
          { label: '发布成功', value: 1 },
          { label: '审核失败', value: 2 }
        ],
        ui:{
          width:180,
          widget:'select'
        }
      },
      sortType: {//sortType 排序类型；1pc排序，2app排序，3pc和app都排序，4pc未排序，5app未排序，6pc和app都未排序
        type: 'number',
        title: '排序类型',
        enum:[
          { label: '全部', value: null },
          { label: 'pc排序', value: 1 },
          { label: 'app排序', value: 2 },
          { label: 'pc和app都排序', value: 3 },
          { label: 'pc未排序', value: 4 },
          { label: 'app未排序 ', value: 5 },
          { label: 'pc和app都未排序 ', value: 6 },
        ],
        ui:{
          width:210,
          widget:'select'
        }
      },
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'id', index: 'id' },
    { title: 'logo', render: 'logo', type: 'img', },
    { title: '公司名称',render: 'companyName', width:'200px' },
    { title: '品牌名称',render: 'name',width:'200px' },
    { title: '餐饮类型', index: 'fatherFoodName',format:item=>(item.fatherFoodName||'')+((item.fatherFoodName&&item.sonFoodName)?'-':'')+(item.sonFoodName||'') },
    { title: '品牌所属', index: 'belongId',format:item=>item.belongId==1?'自有品牌':item.belongId==2?'代理品牌':'未知' },//1.自有品牌 2.代理品牌
    { title: '投资金额', index: 'capitalName',format:item=>item.capitalName?item.capitalName:'面议' },
    { title: '加盟费', index: 'joinGold',format:item=>item.joinGold?item.joinGold+'万元':'面议' },
    { title: '浏览量', index: 'viewNum' },
    { title: '聊天类型', index: 'chatType',format:(item)=>item.chatType==0?'公司':'客服' },
    { title: 'PC-APP排序',index: 'sort',format:(item)=>{
      if(!item.sort&&!item.sortApp){
        return '未设置排序'
      }else {
        return item.sort+','+item.sortApp
      }
    }  },
    { title: '发布/刷新时间', index: 'refreshTime' },
    { title: '审核状态', index: 'status',format:item=>{
      switch (item.status) {//0.审核中，1.发布成功，2.审核失败
        case 0:return '审核中';
        case 1:return '发布成功';
        case 2:return '审核失败';
        default:return '';
      }
    } },
    { title: '是否下架', index: 'isStand',format:item=>{
        if(item.isDel){
          return '已删除'
        }else{
          if(item.isStand==0){
            return '未下架'
          }else if(item.isStand==1){
            return '已下架'
          }else{
            return ''
          }
        }
      }
    },
    {
      title: '操作',
      buttons: [
        { text: '详情', click: (item:any) => this.goToDetail(item)},
        { text: '修改', click: (item: any) => this.edit(item)},
        { text: '排序', click: (item: any) => this.sort(item)},
        { text: '审核成功', iif:(item)=>{ return item.status === 0 } ,click: (item: any) => this.checkBrand(item,1)},
        { text: '审核失败', iif:(item)=>{ return item.status === 0 } , click: (item: any) => this.checkBrand(item,2)},
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper,public viewImgService:ViewImg) { }

  ngOnInit() {
    this.http.get(this.url).subscribe((res: any) => {
      this.pageData.data = res.data.list;
      this.pageData.total = res.data.total;
    })
   }
   checkBrand(item,status){
    this.http.post(`/brand_manager/check_brand`,{brandId:item.id,status:status}).subscribe( res=> this.st.reset() )
   }

   goToDetail(item){
    this.http.get('/brand_manager/get_brand_detail',{brandId:item.id}).subscribe((res: any) => {
      this.modal
      .createStatic(UsersBrandDetailComponent,{i:res.data})
      .subscribe(() => {});
    })
   };

  edit(item){
    this.http.get('/brand_manager/edit_brand',{brandId:item.id}).subscribe((res: any) => {
      console.log(res);
      this.modal
      .createStatic(UsersBrandEditComponent,{i:res.data})
      .subscribe(() => this.st.reload());
    })
  }
  edit0(item){
    this.modal.createStatic(UsersBrandEditComponent,{brandId:item.id}).subscribe(() => this.st.reload());
  }

  sort(item){
    this.modal.createStatic(UsersBrandSortEditComponent,{i:item,saveUrl:this.sortUrl}).subscribe(() => this.st.reset());
  }

  search1(e){
    this.http.get('/brand_manager/get_brand_list',e).subscribe((res: any) => {
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

  treeSelect=[]
  getTreeSelect() {
    this.http.get(`/drop_down_box/get_province_city_all`)
    .subscribe((res:any) => {
      let nodes = [];
      res.data.map(element => {
        if (element.parent == 1) {
          nodes.push({
            title: element.label,
            key: element.value,
            value: element.value,
            children: [],
          });
        } else {
          nodes.forEach(item => {
            if (item.value === element.parent) {
              item.children.push({
                title: element.label,
                key: element.value,
                value: element.value,
                isLeaf: true,
              });
            }
          });
        }
      });
      this.treeSelect = [{
        title: '全国',
        key: 1,
        value:1,
        children: nodes
      }]
      console.log(this.treeSelect)
    })
  }

}
