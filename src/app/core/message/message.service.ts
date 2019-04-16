import { Injectable, Injector, Inject, ChangeDetectorRef } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { BehaviorSubject, Subject } from 'rxjs';
@Injectable()
export class MessageService {
  messCount = new Subject();

  constructor(
    private http: _HttpClient
  ){

  }
  getMessageCount(){
    this.http.get(`/message/unread_message`).subscribe((res:any)=>{
      this.messCount.next(res.data);
    })
  };
}
