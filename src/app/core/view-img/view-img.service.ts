import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class ViewImg {
  constructor(
    private http: _HttpClient,
    private modalSer:NzModalService
  ) { }

  checkImg(src){
    this.modalSer.create({
      nzTitle: '',
      nzContent: `<img class="view-img" src="${src}" />`,
      nzFooter:null,
      nzClassName: 'img-view-wrap'
    });
  };
}
