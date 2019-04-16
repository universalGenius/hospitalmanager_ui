import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema } from '@delon/form';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-users-brand-fake-edit',
  templateUrl: './brand-fake-edit.component.html',
})
export class UsersBrandFakeEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  saveUrl: any;
  saveData = {};
  schema: SFSchema = {
    // id: 1
    // isDel: false
    // logo: "https://ossmeng.oss-cn-hangzhou.aliyuncs.com/mengmeng/huery/CjgNbgmJKJikmfmrzCszKFYfJ"
    // name: "红铺"
    // slogan: "麻辣香锅上红铺"
    properties: {
      logo: { type: 'string', title: 'logo' },
      name: { type: 'string', title: '品牌名称' },
      slogan: { type: 'string', title: '宣传标语' },
      // sysStaticId: {
      //   type: 'string',
      //   title: '静态资源类型',
      //   enum: [{}],
      //   ui: {
      //     widget: 'select',
      //     width: 460,
      //     asyncData:()=> this.http.get('/admin_sys_static_info/get',{type:2}).pipe(map((res:any)=>{
      //       this.titleList=[];
      //       res.data.list.forEach(item => {
      //         this.titleList.push({
      //           label:item.title,
      //           value:item.id
      //         })
      //       });
      //       return this.titleList
      //     }))
      //   }
      // },
    },
    required: [],
  };
  titleList=[]
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 24 },
    },
    $logo: {
      widget: 'MyuploadWidget',
      grid: { span: 12 },
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
    if(this.i.id){
      this.saveData={
        id:value.id,
        logo:value.logo,
        name:value.name,
        slogan:value.slogan,
        // sysStaticId:value.sysStaticId
      }
    }else{
      this.saveData={
        logo:value.logo,
        name:value.name,
        slogan:value.slogan,
        // sysStaticId:value.sysStaticId
      }
    }
    console.log(this.saveData);
    this.http.post(this.saveUrl, this.saveData).subscribe((res:any)=> {
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
