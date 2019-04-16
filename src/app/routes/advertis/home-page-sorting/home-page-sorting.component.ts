import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STPage, STChange, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { transFormData } from '@shared';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AdvertisHomePageSortingEditComponent } from '../home-page-sorting-edit/home-page-sorting-edit.component';
import { ViewImg } from '@core/view-img/view-img.service';

@Component({
  selector: 'app-advertis-home-page-sorting',
  templateUrl: './home-page-sorting.component.html',
})
export class AdvertisHomePageSortingComponent implements OnInit {
  url = `/home_sort/get_brand_list`;
  editUrl = '/home_sort/update_brand_sort';
  // addUrl = '/banner_app_manager/save_banner';
  pageData = {
    data: {},
    pi:5,
    total: 0
  };
  searchData:any = {};
  name = '';
  sfValue:any = {};
  capitalList = [];
  fatherFoodList = [];
  joinModeList = [];
  provinceList = [];
  sonFoodList = [{label:'全部',value:''}];
  cityList = [{label:'全部',value:''}];
  // defaultFatherFoodId=1;
  searchSchema: SFSchema = {
    properties: {
      pageNum: {
        type: 'number',
        default: 1,
        ui: {
          hidden: true
        }
      },
      name: {
        type: 'string',
        default: '',
        title: '公司名称/品牌名称'
      },
      capitalId: {
        type: 'string',
        title: '投资金额',
        default: '',
        enum: this.capitalList,
        ui: {
          widget: 'select',
          width: 200,
          hidden:true
        }
      },
      modeId: {
        type: 'string',
        title: '加盟模式',
        default: '',
        enum: this.joinModeList,
        ui: {
          widget: 'select',
          width: 200,
          hidden:true
        }
      },
      fatherFoodId: {
        type: 'string',
        title: '一级餐饮类型',
        default: '',
        enum: this.fatherFoodList,
        ui: {
          widget: 'select',
          // allowClear: true,
          width: 280,
          change: (value) => {
            this.http.get('/drop_down_box/get_son_food_list', { fatherFoodId: value }).subscribe((res: any) => {
              this.searchSchema.properties.sonFoodId.enum = res.data;
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
      sonFoodId: {
        type: 'string',
        title: '二级餐饮类型',
        enum: this.sonFoodList,
        // default: '',
        ui: {
          width: 280,
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
        default:'',
        enum: this.provinceList,
        ui: {
          hidden:true,
          width: 300,
          widget: 'select',
          change: (value) => {
            // this.searchSchema.properties.provinceId.default = value;
            this.http.get('/drop_down_box/get_city', { fatherId: value }).subscribe((res: any) => {
              this.searchSchema.properties.cityId.enum = res.data;
              this.sfValue=this.sf.value;
              this.sf.refreshSchema(this.searchSchema);
              // this.sf.getProperty(`/cityId`).setValue(res.data,true);
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
        enum: this.cityList,
        ui: {
          hidden:true,
          width: 300,
          widget: 'select',
          notFoundContent:'要选省',
          // change:(value)=>{
          //   this.http.get('/drop_down_box/get_son_food_list',{fatherFoodId:value}).subscribe((res:any)=>{
              // this.searchSchema.properties.cityId.default = value;
          //   })
          // },
          // asyncData:(aaa)=> this.getSelect('/drop_down_box/get_city',{fatherId:aaa})
        }
      },
      position: {
        type: 'string',
        title: '展示位置(有此搜索条件时其他搜索条件无效)',
        default: '',
        enum: [{}],
        ui: {
          widget: 'select',
          width: 460,
          asyncData:()=> this.http.get('/home_sort/get_sort_type_list').pipe(map((res:any)=>res.data))
        }
      },
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [//Id、公司名称、品牌名称、餐饮类型、投资金额、加盟模式、排序类型、排序
    { title: 'ID', index: 'id' },
    { title: '品牌Logo', render: 'logo', },
    { title: '公司名称', render: 'companyName', width:'200px' },
    { title: '品牌名称', render: 'name', width:'200px' },
    { title: '餐饮类型', index: 'fatherFoodName' },
    { title: '投资金额', index: 'capitalName' },
    { title: '加盟模式', index: 'joinModeName', width:'150px' },
    { title: '加盟区域', render: 'cityName', width:'200px'},
    { title: '发布/刷新时间', index: 'refreshTime', },
    // { title: '排序类型', index: 'modeIds', },
    { title: '排序', index: 'sort', },
    {
      title: '操作',
      buttons: [
        { text: '修改排序', click: (item) => { this.edit(item) } },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService,public viewImgService:ViewImg ) { }

  ngOnInit() {
    this.getpage();

  }
  ngAfterViewInit() {
    console.log(this.sf);
    this.sf.formChange.subscribe(res=>{
      // console.log(res)
      // this.sf.refreshSchema()
    })
  }
  getSelect(url, parameter) {
    return this.http.get(url, parameter).pipe(
      map((res: any) => {
        return res.data
      })
    )
  }
  getFatherFoodList() {
    this.http.get('/drop_down_box/get_father_food_list').subscribe((res: any) => {
      console.log(res);
      this.provinceList = res.data;
      this.searchSchema.properties.fatherFoodId.enum = this.fatherFoodList;
    })
  }
  getProvinceList() {
    this.http.get('/drop_down_box/get_province').subscribe((res: any) => {
      console.log(res);
      this.fatherFoodList = res.data;
      this.searchSchema.properties.provinceId.enum = res.data;
    })
  }
  reply(id) {
    this.http.get('/admin_brand_advisory/set_status', { id: id }).subscribe((res) => {
      this.st.reload();
    });
  }
  getpage() {
    this.http.post(this.url, { pageNum: 1 }).subscribe((res: any) => {
      console.log(res);
      this.pageData.data = res.data.pageInfo.list;
      this.pageData.total = res.data.pageInfo.total;
      this.capitalList = res.data.capitalList;
      this.joinModeList = res.data.joinModeList;
      this.fatherFoodList = res.data.fatherFoodList;
      this.provinceList = res.data.provinceList;
      this.searchSchema.properties.capitalId.enum = res.data.capitalList;
      this.searchSchema.properties.modeId.enum = res.data.joinModeList;
      this.searchSchema.properties.fatherFoodId.enum = res.data.fatherFoodList;
      this.searchSchema.properties.provinceId.enum = res.data.provinceList;
      this.sf.refreshSchema();
    })
  }
  change(event) {
    if(event.type == 'pi'){
      this.searchData = this.sf.value;
      this.searchData.pageNum=event.pi;
      console.log(this.searchData);
      this.http.post(this.url, this.searchData).subscribe((res: any) => {
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

  reset(e) {
    this.st.reset();
  }

  edit(item) {
    this.http.get('/home_sort/edit_brand_sort', {isFake:item.refreshTime?0:1,brandId:item.id}).subscribe((res: any) => {
      console.log(res);
      this.modal.createStatic(AdvertisHomePageSortingEditComponent, { i: res.data, saveUrl: this.editUrl }).subscribe(() => this.st.reload());
    })
  }
  refresh() {
    this.st.reload()
  }
}
