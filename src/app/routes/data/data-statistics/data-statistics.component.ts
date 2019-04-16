import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema,SFComponent } from '@delon/form';
import { environment } from '@env/environment';


@Component({
  selector: 'app-data-data-statistics',
  templateUrl: './data-statistics.component.html',
})
export class DataDataStatisticsComponent implements OnInit {
  url = `/data_statistics/get_data_count`;
  searchSchema: SFSchema = {
    properties: {
      beginTime: {
        type: 'string',
        title: '开始时间',
        ui:{
          widget:'date',
          format:'YYYY-MM-DD',
        }
      },
      endTime: {
        type: 'string',
        title: '结束时间',
        ui:{
          widget:'date',
          format:'YYYY-MM-DD',
        }
      }
    }
  };

  // brandDataList: any[] = new Array(12).fill({}).map((i, idx) => ({
  //   x: `${idx + 1}月`,
  //   y: Math.floor(Math.random() * 1000) + 200,
  // }));
  brandDataList=[];
  userDataList=[];
  companyDataList=[];
  personalDataList=[];
  constructor(private http: _HttpClient, private modal: ModalHelper) { }

  ngOnInit() {
    this.getData({});
  }
  @ViewChild('sf') sf: SFComponent;
  getData(data,callBack?){
    return this.http.get(this.url,data).subscribe((res: any) => {
      console.log(res.data);
      callBack&&callBack();
      for (const key in res.data) {
        if (res.data.hasOwnProperty(key)) {
          this[key]=[];
          res.data[key].forEach(item => {
            this[key].push({
              x: item.dataTime,
              y: item.dataCount
            })
          });
        }
      }
    })
  }
  getData1111(data){
    this.http.get(this.url,data).subscribe((res: any) => {
      console.log(res.data);
      for (const key in res.data) {
        if (res.data.hasOwnProperty(key)) {
          this[key]=[];
          res.data[key].forEach(item => {
            this[key].push({
              x: item.dataTime,
              y1: item.dataCount
            })
          });
        }
      }
    })
  }

  search(data){
    console.log('search');
    this.getData(data)
  }
  reset(){
    console.log('reset');
    this.getData({},()=>this.sf.reset());
  }
  exportPara='';
  goDownload() {
    this.exportPara='';
    for (const key in this.sf.value) {
      if (this.sf.value.hasOwnProperty(key)) {
        this.exportPara+=key+'='+this.sf.value[key]+'&';
      }
    }
    console.log(this.exportPara.substring(0,this.exportPara.length-1))
    window.location.href = environment.SERVER_URL + `/data_statistics/download?`+this.exportPara.substring(0,this.exportPara.length-1);
  }
}
