import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { transFormData } from '@shared';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AdvertisHotShopsSortingEditComponent } from '../hot-shops-sorting-edit/hot-shops-sorting-edit.component';

@Component({
  selector: 'app-advertis-hot-shops-sorting',
  templateUrl: './hot-shops-sorting.component.html',
})
export class AdvertisHotShopsSortingComponent implements OnInit {
  url = `/shop_sort/get_brand_list`;
  editUrl = '/shop_sort/update_shop_sort';
  // addUrl = '/banner_app_manager/save_banner';
  pageData = {
    data: {},
    page: 1,
    total: 0,
    size: 10
  };
  data:any;
  sfValue = {};
  capitalList = [];
  fatherFoodList = [];
  joinModeList = [];
  provinceList = [];
  sonFoodList = [];
  cityList = [];
  searchSchema: SFSchema = {
    properties: {
      pageNum: {
        type: 'number',
        default:1,
        ui:{
          hidden:true
        }
      },
      companyName:{
        default: '',
        type: 'string',
        title: '公司名称',
      },
      brandName:{
        type: 'string',
        default: '',
        title: '品牌名称'
      },
      capitalId: {
        type: 'string',
        title: '投资金额',
        default: '',
        enum: this.capitalList,
        ui: {
          widget: 'select',
          width: 300
        }
      },
      modeId: {
        type: 'string',
        title: '加盟模式',
        default: '',
        enum: this.joinModeList,
        ui: {
          widget: 'select',
          width: 300
        }
      },
      foodFatherId: {
        type: 'string',
        title: '一级餐饮类型',
        // default: '',
        enum: this.fatherFoodList,
        ui: {
          widget: 'select',
          // allowClear: true,
          width: 300,
          change: (value) => {
            this.http.get('/drop_down_box/get_son_food_list', { fatherFoodId: value }).subscribe((res: any) => {
              this.searchSchema.properties.foodId.enum = res.data;
              this.sfValue=this.sf.value;
              this.sf.refreshSchema(this.searchSchema);
              for (const key in this.sfValue) {
                if (this.sfValue.hasOwnProperty(key)) {
                  this.sf.setValue(`/${key}`,this.sfValue[key]);
                }
              }
            })
          },
          // asyncData: () => this.getSelect('/drop_down_box/get_father_food_list', {})
        }
      },
      foodId: {
        type: 'string',
        title: '二级餐饮类型',
        enum: [{label:'全部',value:''}],
        // default: '',
        ui: {
          width: 300,
          widget: 'select',
          notFoundContent:'去选择一级餐饮类型',
          // change:(value)=>{
          //   this.http.get('/drop_down_box/get_son_food_list',{fatherFoodId:value}).subscribe((res:any)=>{
              // this.searchSchema.properties.sonFoodId.default = value;
          //   })
          // },
          // asyncData:()=> this.getSelect('/drop_down_box/get_son_food_list',{fatherFoodId:1})
        }
      },
      provinceId: {
        type: 'string',
        title: '省',
        // default:'',
        enum: this.provinceList,
        ui: {
          width: 300,
          widget: 'select',
          change: (value) => {
            // this.searchSchema.properties.provinceId.default = value;
            this.http.get('/drop_down_box/get_city', { fatherId: value }).subscribe((res: any) => {
              this.searchSchema.properties.cityId.enum = res.data;
              this.sfValue=this.sf.value;
              this.sf.refreshSchema();
              for (const key in this.sfValue) {
                if (this.sfValue.hasOwnProperty(key)) {
                  this.sf.setValue(`/${key}`,this.sfValue[key]);
                }
              }
            })
          },
          // asyncData: () => this.getSelect('/drop_down_box/get_province', {})
        }
      },
      cityId: {
        type: 'string',
        title: '市',
        // default: '',
        enum: [{label:'全部',value:''}],
        ui: {
          width: 300,
          widget: 'select',
          notFoundContent:'要选省',
          // change:(value)=>{
          //   this.http.get('/drop_down_box/get_son_food_list',{fatherFoodId:value}).subscribe((res:any)=>{
              // this.searchSchema.properties.cityId.default = value;
          //   })
          // },
          // asyncData:()=> this.getSelect('/drop_down_box/get_city',{fatherId:14})
        }
      },
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [//Id、公司名称、品牌名称、餐饮类型、投资金额、加盟模式、排序类型、排序
    { title: 'ID', index: 'brandId' },//Id、公司名称、品牌名称、餐饮类型、投资金额、加盟模式、排序
    // { title: '品牌Logo', index: 'logo',type:'img' },
    { title: '公司名称', render: 'companyName', width:'250px'},
    { title: '品牌名称', render: 'brandName', width:'250px' },
    { title: '餐饮类型', index: 'fatherFoodName' },
    { title: '投资金额', index: 'capitalName' },
    { title: '加盟模式',index: 'joinModeName',},
    // { title: '加盟区域',index: 'cityName',},
    // { title: '发布/刷新时间',index: 'refreshTime',},
    // { title: '排序类型',index: 'modeIds',},
    { title: 'PC-APP',index: 'sort',format:(item)=>{
      if(item.sort===null&&item.appSort===null){
        return '未设置排序'
      }else {
        return item.sort+','+item.appSort
      }
    }  },
    {
      title: '操作',
      buttons: [
        { text: '修改排序', click: (item)=>{this.edit(item)}},
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService,) { }

  ngOnInit() {
    this.getpage();
  }
  ngAfterViewInit(){

  }
  getSelect(url,parameter){
    return this.http.get(url,parameter).pipe(
      map((res:any)=> {
        return res.data
      })
    )
  }
  reply(id){
    this.http.get('/admin_brand_advisory/set_status',{id:id}).subscribe((res)=>{
      this.st.reload();
    });
  };
  getpage(){
    this.http.post(this.url,{pageNum:1}).subscribe((res: any) => {
      console.log(res);
      this.pageData.data = res.data.pageInfo.list;
      this.pageData.total = res.data.pageInfo.total;

      this.capitalList = res.data.capitalList;
      this.joinModeList = res.data.joinModeList;
      this.fatherFoodList = res.data.fatherFoodList;
      this.provinceList = res.data.provinceList;
      this.searchSchema.properties.capitalId.enum = res.data.capitalList;
      this.searchSchema.properties.modeId.enum = res.data.joinModeList;
      this.searchSchema.properties.foodFatherId.enum = res.data.fatherFoodList;
      this.searchSchema.properties.provinceId.enum = res.data.provinceList;
      this.sf.refreshSchema();
    })
  }
  // getPage(event,data = this.sf.value) {
  //   let e = {pageNum:event.pi}
  //   if(event.type == 'pi'){
  //     data.pageNum = event.pi
  //     Object.assign(e,data);
  //     this.http.get(this.url,e).subscribe((res: any) => {
  //       this.pageData.data = res.data.list;
  //       this.pageData.total = res.data.total;
  //     })
  //   }
  // }
  searchData:any = {};
  change(event) {
    if(event.type == 'pi'){
      this.searchData={
        capitalId:this.sf.value.capitalId,
        modeId:this.sf.value.modeId,
        foodFatherId:this.sf.value.foodFatherId,
        foodId:this.sf.value.foodId,
        cityId:this.sf.value.cityId?this.sf.value.cityId:this.sf.value.provinceId
      }
      console.log(this.searchData);//pageNum:event.pi
      console.log(Object.assign({pageNum:event.pi},this.searchData));
      this.http.post(this.url,Object.assign({pageNum:event.pi},this.searchData)).subscribe((res: any) => {
        console.log(res);
        this.pageData.data = res.data.pageInfo.list;
        this.pageData.total = res.data.pageInfo.total;
      })
    }
  }
  search(e) {
    //调用load()触发了change事件
    this.st.load(1);
  }

  reset() {
    this.st.reset();
  }

  edit(item){
      this.modal.createStatic(AdvertisHotShopsSortingEditComponent,{i:item,saveUrl:this.editUrl,saveData:this.searchData}).subscribe(() => this.st.reset());
  }
}
