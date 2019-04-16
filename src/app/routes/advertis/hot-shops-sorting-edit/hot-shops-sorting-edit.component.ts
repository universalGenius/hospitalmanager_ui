import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-advertis-hot-shops-sorting-edit',
  templateUrl: './hot-shops-sorting-edit.component.html',
})
export class AdvertisHotShopsSortingEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl:any;
  saveData:any;
  schema: SFSchema = {
    properties: {
      sort: { type: 'number', title: 'PC排序' },
      appSort: { type: 'number', title: 'APP排序' },
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
    console.log(this.saveData);
    console.log(Object.assign({//saveData
      brandId:value.brandId,
      sort:value.sort?value.sort:0,
      appSort:value.appSort?value.appSort:0
    },this.saveData));
    this.http.post(this.saveUrl, Object.assign({//saveData
      brandId:value.brandId,
      sort:value.sort?value.sort:0,
      appSort:value.appSort?value.appSort:0
    },this.saveData)).subscribe((res:any)=> {
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
