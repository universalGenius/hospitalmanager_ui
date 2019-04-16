import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { map } from 'rxjs/operators';
import { transFormData, dateFtt } from '@shared';
import { Router } from '@angular/router';
import { MessageService } from '@core';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles:[
    `:host /deep/ .ant-fullcalendar-header {
      padding: 16px 16px 17px 0;
    }`
  ]
})
export class DashboardComponent implements OnInit {
  tips = [];
  pageData = {
    list:[],
    total:0
  }
  constructor(
    private http: _HttpClient,
    private router: Router,
    private messCount: MessageService
  ) { }
  ngOnInit() {
  }
}
