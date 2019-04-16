import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';

@Component({
  selector: 'app-users-brand-sort-edit',
  templateUrl: './brand-sort-edit.component.html',
})
export class UsersBrandSortEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl:any;
  // saveData:any;
  schema: SFSchema = {
    properties: {
      sort: { type: 'number', title: 'PC排序',minimum:0 },
      sortApp: { type: 'number', title: 'APP排序',minimum:0 },
    },
    required: [],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    console.log(this.i);
    // if (this.record.id > 0)
    // this.http.get(`/user/${this.record.id}`).subscribe(res => (this.i = res));
  }

  save(value: any) {
    console.log(value)
    console.log({
      id:value.id,
      sort:value.sort,
      sortApp:value.sortApp
    });
    // if(!value.sort&&!value.sortApp){
    //   this.msgSrv.error('这两个排序至少得有一个');
    //   return
    // }
    this.http.post(this.saveUrl,{
      id:value.id,
      sort:value.sort,
      sortApp:value.sortApp
    }).subscribe((res:any)=> {
      if(res.code==12000){
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      }
    });
  }

  close() {
    this.modal.destroy();
  }
}
