import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFComponent, SFUISchema } from '@delon/form';
import { of } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-advertis-home-page-sorting-edit',
  templateUrl: './home-page-sorting-edit.component.html',
})
export class AdvertisHomePageSortingEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl = '/home_sort/update_brand_sort';
  schema: SFSchema = {
    properties: {
      pcImg: { type: 'string', title: 'PC图片' },
      appImg: { type: 'string', title: 'APP图片' },
      homeSortTypeDtoList: {
        type: 'array',
        title: '修改排序',
        ui: {
          grid: { arraySpan: 6,span:24,},
          removable:false,
        },
        items: {
          type: 'object',
          properties: {
              name: {
                  type: 'string',
                  title: '名称',
                  ui: { spanLabelFixed: 46, widget: 'text'}
              },
              id: {
                  type: 'number',
                  title: 'ID',
                  ui:{
                    hidden:true
                  }
              },
              sort: {
                  type: 'number',
                  title: '排序',
                  ui: { spanLabelFixed: 48,span:2}
              }
          }
        },
      }
    }
  };
  @ViewChild('sf') sf: SFComponent;
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 80,
      grid: { span: 12 },
    },
    $pcImg: {
      widget: 'MyuploadWidget',
      config:{
        action: '/',
        fileName:'file',
        max:1
      }
    },
    $appImg: {
      widget: 'MyuploadWidget',
      config:{
        action: '/',
        fileName:'file',
        max:1
      }
    },
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
    console.log(value);
    this.http.post(this.saveUrl, value).subscribe((res:any)=> {
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
