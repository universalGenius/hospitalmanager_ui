import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { InfoAppVersionsEditComponent } from '../app-versions-edit/app-versions-edit.component';

@Component({
  selector: 'app-info-app-versions',
  templateUrl: './app-versions.component.html',
})
export class InfoAppVersionsComponent implements OnInit {
  url = `/admin_version_control/get`;
  addUrl = '/admin_version_control/save';
  editUrl = '/admin_version_control/set';
  deleteUrl = '/admin_version_control/del';
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
      version: {
        type: 'string',
        title: '版本名称'
      },
      versionDoc: {
        type: 'string',
        title: '更新文案'
      }
    }
  };
  @ViewChild('st') st: STComponent;
  @ViewChild('sf') sf: SFComponent;
  columns: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '版本名称', index: 'version' },
    { title: '更新文案', index: 'versionDoc' },
    { title: '强制更新', index: 'forceUpdate',format:item=>item.forceUpdate==0?'不需要强制更新':'强制更新' },
    { title: '创建时间', index: 'createTime',type:'date' },
    { title: '版本号', index: 'versionNum' },
    {
      title: '操作',
      buttons: [
        { text: '修改',click: (item)=>{this.edit(item)}},
        { text: '删除',click: (item)=>{this.delete(item)}}
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService,) { }

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
    this.modal.createStatic(InfoAppVersionsEditComponent,{i:item,saveUrl:this.editUrl}).subscribe(() => {this.st.reload();});
  }
  delete(item){
    console.log({id:item.id});
    this.http.get(this.deleteUrl,{id:item.id}).subscribe((res: any) => {
      console.log(res);
      if(res.code==12000){
        this.msgSrv.success('删除成功');
        this.st.reload();
      }
    })
  }
  add() {
    this.modal.createStatic(InfoAppVersionsEditComponent,{saveUrl:this.addUrl}).subscribe(() => this.st.reload());
  }
}
