import { Component, OnInit, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-data-categorical-data-edit',
  templateUrl: './categorical-data-edit.component.html',
})
export class DataCategoricalDataEditComponent implements OnInit,AfterViewInit {
  record: any = {};
  i: any = {};
  custom: any = {};
  schema: SFSchema = {
    properties: {
      id: { type: 'string', title: '分类ID' },
      logo: { type: 'string', title: '分类图片' },
      fahterId: { type: 'string', title: '父分类',enum:this.i.fatherList },
      name: { type: 'string', title: '分类' },
      sort: { type: 'string', title: '排序' },
    },
    required: ['name','logo','sort'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $id: {
      hidden:true
    },
    $fahterId: {
      hidden:this.i.isShow,
      widget: 'select',
    },
    $logo: {
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
    this.ui.$fahterId.hidden = !this.custom.isShow;
    this.schema.properties.fahterId.enum = this.custom.fatherList;
  }
  @ViewChild('sf') sf:SFComponent
  ngAfterViewInit(){
    // this.sf.refreshSchema();
  }

  save(value: any) {
    delete value._values
    this.http.post(this.custom.saveUrl, value).subscribe((res:any)=> {
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
