import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { InfoWebsiteConfigEditComponent } from '../website-config-edit/website-config-edit.component';
import { NzMessageService } from 'ng-zorro-antd';
import { ViewImg } from '@core/view-img/view-img.service';

@Component({
  selector: 'app-info-website-config',
  templateUrl: './website-config.component.html',
})
export class InfoWebsiteConfigComponent implements OnInit {
  url = `/admin_option/get`;
  addUrl = '/admin_option/save';
  editUrl = '/admin_option/set';
  pageData = {
    data: {},
    total: 0,
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
      value: {
        type: 'string',
        title: '配置信息(此搜索暂不能用)'
      },
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'key', index: 'key' },
    { title: 'value', render: 'value',width:'300px' },
    { title: '说明', render: 'explain',width:'400px' },
    { title: '图片链接', index: 'link',width:'400px' },
    { title: '是否展示', index: 'isShow',format: item=> item.isShow==0?'展示':'不展示' },
    { title: '排序', index: 'sort' },
    {
      title: '操作',
      buttons: [
        { text: '修改',click: (item)=>{this.edit(item)}}
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService,public viewImgService:ViewImg) { }

  ngOnInit() {
    this.getpage()
  }

  getpage(){
    this.http.get(this.url,{pageNum:1}).subscribe((res: any) => {
      console.log(res);
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
        console.log(this.pageData);
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
    this.modal.createStatic(InfoWebsiteConfigEditComponent,{i:item,saveUrl:this.editUrl}).subscribe(() => {this.st.reload();});
  }
  add() {
    this.modal.createStatic(InfoWebsiteConfigEditComponent,{saveUrl:this.addUrl}).subscribe(() => this.st.reload());
  }
}
