import { Component, OnInit, ChangeDetectorRef, Injector } from '@angular/core';
import { ControlWidget, SFItemComponent, SFComponent } from '@delon/form';
import { NzMessageService, UploadFile, UploadXHRArgs } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import * as $ from 'jquery';
import { Subscription, Observable, of } from 'rxjs';
// nzAction="http://ossmeng.oss-cn-hangzhou.aliyuncs.com"
// [nzData]= "getData"
// [nzRemove]="rmoveImg"
@Component({
  selector: 'my-upload',
  template: `<sf-item-wrap [id]="id" [schema]="schema" [ui]="ui" [showError]="showError" [error]="error" [showTitle]="schema.title">
    <!-- 开始自定义控件区域 -->
    <nz-upload class="avatar-uploader"
      [nzMultiple]="config.max>1"
      [nzLimit]="config.max-currentFilesLength"
      [nzBeforeUpload]="beforeUpload"
      [nzShowButton]="fileList.length < config.max"
      nzListType="picture-card"
      [(nzFileList)]="fileList"
      [nzPreview]="handlePreview"
      [nzRemove]="rmoveImg"
      [nzCustomRequest]="customReq"
      (nzChange)="handleChange($event)">
        <i class="anticon anticon-plus"></i>
        <div class="ant-upload-text">Upload</div>
    </nz-upload>
    <nz-modal [nzVisible]="previewVisible" [nzContent]="modalContent" [nzFooter]="null" (nzOnCancel)="previewVisible=false">
      <ng-template #modalContent>
        <img [src]="previewImage" [ngStyle]="{ 'width': '100%' }" />
      </ng-template>
    </nz-modal>
    <!-- 结束自定义控件区域 -->
  </sf-item-wrap>`,
  //
  styles: [
    `
    :host ::ng-deep .avatar-uploader > .ant-upload {
      width: 104px;
      height: 104px;
    }
    :host ::ng-deep .ant-upload-select-picture-card i {
      font-size: 32px;
      color: #999;
    }
    :host ::ng-deep .ant-upload-select-picture-card .ant-upload-text {
      margin-top: 8px;
      color: #666;
    }
    :host ::ng-deep .ant-upload-select-picture-card .avatar {
      width:100%;
    }
  `
  ]
})
export class MyuploadWidget extends ControlWidget implements OnInit {
  /* 用于注册小部件 KEY 值 */
  static readonly KEY = 'MyuploadWidget';
  previewImage = '';
  previewVisible = false;
  // 组件所需要的参数，建议使用 `ngOnInit` 获取
  config: any;
  currentFilesLength=0;
  fileList = [
    // {
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    // }
  ];
  imgName = {

  };
  urlLists=[]

  ngOnInit(): void {
    this.config = this.ui.config || {};
    if(this.formProperty.formData){
      let arr;
      if(Array.isArray(this.formProperty.formData)){
        arr = this.formProperty.formData;
      }else{
        arr = (this.formProperty.formData as any).split(",");
      }
      this.urlLists=arr;
      this.fileList = arr.map((item)=>{
        return {
          url:item
        }
      });
      this.currentFilesLength=arr.length;
    }else{
      this.fileList = [];
    }
  }

  customReq = (item: UploadXHRArgs) => {
    return this.getSign((e)=>{
      let sign = e;
      const fd = new FormData();
      this.imgName[item.file.uid] = this.randomString(25);
      var object_name = 'mengmeng/huery/' + this.imgName[item.file.uid];
      fd.append('OSSAccessKeyId', sign['accessid']);
      fd.append('policy', sign['policy']);
      fd.append('Signature', sign['signature']);
      fd.append('key', object_name);
      fd.append('success_action_status', '200');
      fd.append('file', item.file as any);
      const injector: Injector =
      Injector.create({providers: [{provide: HttpClient, deps: []}]});
      const http = this.injector.get(HttpClient);
      const req = new HttpRequest('POST', sign['host'], fd,{
        reportProgress : true,
        withCredentials: false
      });
      return http.request(req).subscribe((event:HttpEvent<{}>)=>{
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total > 0) {
            (event as any).percent = event.loaded / event.total * 100;
          }
          item.onProgress(event, item.file);
        } else if (event instanceof HttpResponse) {
          item.onSuccess(event, item.file, event);
        }
      }, (err) => {
        item.onError(err, item.file);
      })
    })
  }
  getSign = (callback) =>{
    let xhrSign = new XMLHttpRequest();
    // 47.97.168.112
    xhrSign.open("get","https://oss.ilashou.com/oss/authorization?name=mm",false);
    let sign;
    xhrSign.addEventListener('load', (e:any)=> {
      sign = JSON.parse(JSON.parse(e.target.response).data);
      callback(sign)
    });
    xhrSign.send();
  };




  // reset 可以更好的解决表单重置过程中所需要的新数据问题
  // reset(value: string) {

  // }

  change(value: string) {
    if (this.ui.change) this.ui.change(value);
    this.setValue(value);
  }
  rmoveImg = (e)=>{
    if(this.config.max == 1){
      this.fileList = [];
      this.setValue('');
    }
    else{
      // let fileStrArr = this.fileList.map((item:any)=>{
      //   if(item.url){
      //     return item.url
      //   }else{
      //     return item.response.data
      //   }
      // });
      // console.log(this.fileList)
      // console.log(fileStrArr)
      // let url;
      // if(e.response){
      //   url = e.response.data
      // }else{
      //   url = e.url;
      // }
      // let index = fileStrArr.indexOf(url);
      // console.log(e,url,index)
      // if (index > -1) {
      //   this.fileList.splice(index, 1);
      //   fileStrArr.splice(index, 1);
      // }
      // // this.setValue(fileStrArr.join(','));
      // this.setValue(fileStrArr);
      // this.currentFilesLength=fileStrArr.length;
      let index,onlySign=e.url||e.uid;
      let fileStrArr = this.fileList.map((item:any)=>{
        if(item.url){
          return item.url
        }else{
          return item.uid
        }
      });
      index=fileStrArr.indexOf(onlySign);
      if (index > -1) {
        this.fileList.splice(index, 1);
        this.urlLists.splice(index, 1);
      }
      this.setValue(this.urlLists);
      this.currentFilesLength=this.fileList.length;
    }
  }
  beforeUpload = (file: File) => {
    const isJPG = /image\/.+/.test(file.type);

    if (!isJPG) {
      this.error = '请上传图片!'
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      this.error = '图片上传不能大于5M'
    }
    return isJPG && isLt5M;
  }
  handleChange(info: { file: UploadFile }): void {
    if (info.file.status === 'done') {
      let val = this.fileList.map((item:any)=>{
        console.log(item)
        if(item.url){
          return item.url
        }else{
          return 'https://ossmeng.oss-cn-hangzhou.aliyuncs.com/mengmeng/huery/'+this.imgName[item.uid];
        }
      })
      this.urlLists=val;
      this.currentFilesLength=val.length;
      if(val.length === 1){
        this.setValue(val.join(','));
      }else{
        this.setValue(val);
      }

    }
  }
  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }
  ngOnDestroy(){

  }


  randomString (len) {
    len = len || 32;
    let chars = 'ABCDEFGHIJKLMNOPRSTUYZabcdefghijklmnoprstuyz';
    let maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
      pwd += chars.charAt(~~(Math.random() * maxPos));
    }
    return pwd;
  }




}
