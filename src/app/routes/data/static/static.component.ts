import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { transFormData } from '@shared';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { DataStaticEditComponent } from '../static-edit/static-edit.component';

@Component({
  selector: 'app-data-static',
  templateUrl: './static.component.html',
})
export class DataStaticComponent implements OnInit {
  url = `/admin_sys_static_info/get`;
  editUrl = '/admin_sys_static_info/set';
  addUrl = '/admin_sys_static_info/save';
  pageData = {
    data: {},
    total: 0,
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
      type:{//资源类型1.首页banner8个icon 2.首页列表模块 3.列表筛选标题 4.综合排序 5.反馈类型
        type:'number',
        title:'资源类型',
        enum:[
          {value:1,label:'首页banner8个icon'},
          {value:2,label:'首页列表模块'},
          {value:3,label:'列表筛选标题'},
          {value:4,label:'综合排序'},
          {value:5,label:'反馈类型'}
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
    { title: '标题', index: 'title' },
    { title: '图标', index: 'icon',type: 'img' },
    { title: '描述', index: 'describe' },
    {
      title: '类型',
      index: 'type',
      format:item=>{
        switch (item.type) {
          case 1: return '首页banner8个icon'
          break;
          case 2: return '首页列表模块'
          break;
          case 3: return '列表筛选标题'
          break;
          case 4: return '综合排序'
          break;
          case 5: return '反馈类型'
          break;
          default: return 'GG'
          break;
        }
      }
    },
    {
      title: '跳转类型',
      index: 'skipType',
      format:item=>{//跳转类型 跳转类型 0.只做展示 1.分类跳转 2.跳转列表并筛选 3.首页模块筛选
        switch (item.skipType) {
          case 0: return '只做展示'
          break;
          case 1: return '分类跳转'
          break;
          case 2: return '跳转列表并筛选'
          break;
          case 3: return '首页模块筛选'
          break;
          default: return 'GG'
          break;
        }
      }
    },
    {
      title: '操作',
      buttons: [
        { text: '修改',  click: (item)=>{this.edit(item)} },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper,private msgSrv: NzMessageService,) { }

  ngOnInit() {
    this.http.get(this.url,{pageNum:1}).subscribe((res: any) => {
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

  // reset() {
  //   this.st.reset();
  // }

  edit(item){
    this.modal.createStatic(DataStaticEditComponent,{i:item,saveUrl:this.editUrl}).subscribe(() => this.st.reload());
    console.log(item);
  };
  add(item){
    this.modal.createStatic(DataStaticEditComponent,{saveUrl:this.addUrl}).subscribe(() => this.st.reload());
    console.log(item);
  };
}
