import { Component, OnInit } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-users-brand-detail',
  templateUrl: './brand-detail.component.html',
})
export class UsersBrandDetailComponent implements OnInit {
  record: any = {};
  i: any;
  data:any;
  constructor(
    private modal: NzModalRef,
    public msgSrv: NzMessageService,
    public http: _HttpClient
  ) { }

  ngOnInit(): void {
    console.log(this.i,666);
    this.data = this.i;
  }

  close() {
    this.modal.destroy();
  }
}
