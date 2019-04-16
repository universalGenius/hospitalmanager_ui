import { Component, OnInit} from '@angular/core';
import { ControlWidget } from '@delon/form';
import { UploadFile } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
@Component({
  selector: 'my-upload-video',
  template: `<sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <nz-upload
      nzAction="https://oss.ilashou.com/oss/start"
      [nzData]="{directory:'test',uploadType:1,name:'mm'}"
      [nzFileList]="fileList"
      [nzName]="'file'"
      (nzChange)="handleChange($event)"
      >
      <button nz-button>
        <i nz-icon type="upload"></i><span>点击上传视频</span>
      </button>
    </nz-upload>
  </sf-item-wrap>`,
  //
  styles: [
    `
  `
  ]
})
export class MyuploadVideoWidget extends ControlWidget implements OnInit {
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'MyuploadVideoWidget';
  // 组件所需要的参数，建议使用 `ngOnInit` 获取
  config: any;
  fileList = [
  ];
  ngOnInit(): void {
    this.config = this.ui.config || {};
    if(this.formProperty.formData){
      let arr;
      if(Array.isArray(this.formProperty.formData)){
        arr = this.formProperty.formData;
      }else{
        arr = (this.formProperty.formData as any).split(",");
      }
      this.fileList = arr.map((item)=>{
        return {
          url:item
        }
      });
    }else{
      this.fileList = [];
    }
  }
  change(value: string) {
    if (this.ui.change) this.ui.change(value);
    this.setValue(value);
  }
  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'done') {
      let val = this.fileList.map((item:any)=>{
        if(item.url){
          return item.url
        }else{
          return 'http://ossmeng.oss-cn-hangzhou.aliyuncs.com/mengmeng/huery/'+item.name
        }
      })
      if(val.length === 1){
        this.setValue(val.join(','));
      }else{
        this.setValue(val);
      }
    }
  }
  handlePreview = (file: UploadFile) => {
  }
  ngOnDestroy(){

  }
}
