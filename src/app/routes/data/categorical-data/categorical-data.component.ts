import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { STColumn, STComponent } from '@delon/abc';
import { SFSchema, SFComponent } from '@delon/form';
import { transFormData } from '@shared';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { DataCategoricalDataEditComponent } from '../categorical-data-edit/categorical-data-edit.component';

@Component({
  selector: 'app-data-categorical-data',
  templateUrl: './categorical-data.component.html',
})
export class DataCategoricalDataComponent implements OnInit {
  leftUrl = `/admin_food_type/get_left`;
  rightUrl = `/admin_food_type/get_right`;

  editUrl = '/admin_food_type/set';
  addUrl = '/admin_food_type/save';

  leftdata=[];
  leftTotal=0;
  rightdata=[];
  rightTotal=0;

  fatherList=[];
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '关键字(只对二级进行搜索)'
      }
    }
  };
  @ViewChild('stl') stl: STComponent;
  @ViewChild('str') str: STComponent;
  columnsl: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '分类名称', index: 'name' },
    { title: '分类图片', type: 'img', width: '50px', index: 'logo' },
    {
      title: '操作',
      buttons: [
        // { text: '新增', click: (item: any) => {this.add()} },
        { text: '修改', click: (item: any) => {this.edit(item)} },
        { text: '删除', click: (item: any) => {this.delete(item)} },
      ]
    }
  ];
  columnsr: STColumn[] = [
    { title: 'ID', index: 'id' },
    { title: '二级分类名称', index: 'name' },
    { title: '二级分类图片', type: 'img', width: '50px', index: 'logo' },
    {
      title: '操作',
      buttons: [
        // { text: '新增', click: (item: any) => {this.add()} },
        { text: '修改', click: (item: any) => {this.edit(item)} },
        { text: '删除', click: (item: any) => {this.delete(item)} },
      ]
    }
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper,private msgSrv: NzMessageService) { }

  ngOnInit() {
    this.getLeftData();
    this.getRightData();
    console.log(this.leftdata,111111111)
  }
  currentId=''
  getLeftData(){
    this.http.get(this.leftUrl).subscribe((res: any) => {
      console.log(res);
      this.leftdata = res.data;
      this.leftTotal = res.data.length;
      this.currentId = res.data[0].id;
      res.data.forEach(item => {
        this.fatherList.push({
          label:item.name,
          value:item.id
        })
      });
      console.log(this.fatherList)
    })
  }
  getRightData(data={}){
    console.log(data);
    this.http.get(this.rightUrl,data).subscribe((res: any) => {
      console.log(res);
      this.rightdata = res.data;
      this.rightTotal = res.data.length;
    })
  }

  //展示对应二级
  showDetail(e){
    console.log(e)
    this.currentId = e.click.item.id;
    this.getRightData({fahterId:e.click.item.id})
  }

  //搜索二级数据
  search(data){
    this.getRightData(data);
  }

  edit(item){
    this.modal.createStatic(DataCategoricalDataEditComponent,{
      i:item,
      custom:{
        isShow:item.fahterId?true:false,
        saveUrl:this.editUrl,
        fatherList:this.fatherList
      },
    }).subscribe((res) => {
      console.log();
      this.getLeftData();
      this.getRightData({fahterId:this.currentId});
    });
  }
  delete(item){
    this.http.get('/admin_food_type/del',{id:item.id}).subscribe((res: any) => {
      if(res.code==12000){
        this.msgSrv.success('删除成功');
        this.getLeftData();
        this.getRightData({fahterId:this.currentId});
      }
    })
  }
  add(isShow){
    this.modal.createStatic(DataCategoricalDataEditComponent,{
      custom:{
        isShow:isShow,
        saveUrl:this.addUrl,
        fatherList:this.fatherList,
      }
    }).subscribe(() => {
      this.getLeftData();
      this.getRightData({fahterId:this.currentId});
    });
  }
  reset(){
    this.getRightData()
  }

}
