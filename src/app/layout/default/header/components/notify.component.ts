import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
import { NzMessageService } from 'ng-zorro-antd';
import { NoticeItem, NoticeIconList } from '@delon/abc';
import { _HttpClient } from '@delon/theme';
import { Router } from '@angular/router';
import { MessageService } from '@core';
/**
 * 菜单通知
 */
@Component({
  selector: 'header-notify',
  template: `
  <notice-icon [count]="count"
  btnClass="alain-default__nav-item"
  btnIconClass="alain-default__nav-item-icon"
  (click)="goToIndex()"></notice-icon>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNotifyComponent implements  OnInit{
  count:number = 0;
  constructor(
    public messCount:MessageService,
    public cdr: ChangeDetectorRef,
    public router: Router
    ) {}
  ngOnInit(){
    this.getCount();
  }
  getCount(){
    this.messCount.getMessageCount();
    this.messCount.messCount.subscribe((res:any)=>{
      this.count = res;
      this.cdr.detectChanges();
    })
  }
  goToIndex(){
    this.router.navigateByUrl("/dashboard");
  };
}
