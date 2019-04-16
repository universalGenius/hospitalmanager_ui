import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService, CascaderOption } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, CascaderWidget } from '@delon/form';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users-company-edit',
  templateUrl: './company-edit.component.html',
})
export class UsersCompanyEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl = '';
  schema: SFSchema = {
    properties: {
      userName: { type: 'string', title: '用户名', },
      logo: { type: 'string', title: 'logo' },
      name: { type: 'string', title: '公司姓名' },
      id: { type: 'string', title: '编号', },
      website: { type: 'string', title: '公司网址' },
      introduction: { type: 'string', title: '公司简介' },
      cityList: { title: '公司地址', type: 'number', },//enum: [{}]
      region: { type: 'string', title: '手动区' },
      address: { type: 'string', title: '详细地址' },
    },
    // required: ['logo','name','userName'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 12 },
    },
    $id:{
      hidden:true
    },
    $userName:{
      visibleIf: { id: (value: any) => value == undefined }
    },
    $region:{
      visibleIf: { cityList: (value: any) => value&&(value.length < 3) }
    },
    $logo:{
      widget:'MyuploadWidget',
      config:{
        action: '/',
        fileName:'file',
        max:1
      }
    },
    $introduction: {
      widget: 'textarea',
      grid: { span: 24 },
    },
    $cityList: {
      widget: 'cascader',
      // asyncData: () => {
      //   return this.treeSelect();
      // },
      asyncData: ((
        node: CascaderOption,
        index: number,
        me: CascaderWidget,) => {
        return new Promise(resolve => {
          (node as any).children = this.i.cityListEnum.filter((w: any) => {
            // w.isLeaf = index === 0;
            return w.parent === (node.value || 1 );
          });
          resolve();
          me.detectChanges(true);
        });
      }) as any,
      // asyncData: (() => {
      //   return Promise.resolve(this.i.cityListEnum);
      // }) as any
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) {}

  ngOnInit(): void {
    console.log(this.i.id===undefined);
    console.log(this.i);
  }
  saveData :any = {}
  save(value: any) {
    this.saveData={
      name:value.name,
      logo:value.logo,
      userName:value.userName,
      introduction:value.introduction,
      website:value.website,
      provinceId:value.cityList?value.cityList[0]:0,
      cityId:value.cityList?value.cityList[1]:0,
      districtId:value.cityList&&value.cityList[2]?value.cityList[2]:0,
      region:value.region,
      address:value.address
    }
   if(value.id){
    this.saveData.id=value.id;
    delete this.saveData.userName;
   }
    this.http.post(this.saveUrl,this.saveData).subscribe((res:any) => {
      console.log(res);
      if(res.code === 12000){
        this.msgSrv.success('保存成功');
        this.modal.close(true);
      }
    });
  }


  close() {
    this.modal.destroy();
  }
}
