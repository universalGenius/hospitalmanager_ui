import { Component, OnInit, ViewChild } from '@angular/core';
import { NzModalRef, NzMessageService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, SFComponent } from '@delon/form';
import { transFormData } from '@shared';

@Component({
  selector: 'app-draw-delivery-modal',
  templateUrl: './delivery-modal.component.html',
})
export class DrawDeliveryModalComponent implements OnInit {
  url = '/express/save_award_express';
  queryUrl = '/express/look_express'; //查询发货
  editUrl = '/express/edit_express' //编辑发货

  courierParams: any;
  defaultData: any;

  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      list: {
        type: 'array',
        title: '物流及单号',
        maxItems: 4,
        minItems: 1,
        default: [{ courierCompany: '', courierNumber: '' }],
        items: {
          type: 'object',
          properties: {
            courierCompany: {
              type: 'string',
              title: '物流'
            },
            courierNumber: {
              type: 'string',
              title: '单号',
            }
          },
          required: ['courierCompany', 'courierNumber']
        },
        ui: { grid: { arraySpan: 24 }, }
      },
    },
    required: ['courierCompany', 'courierNumber'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 20 },
    },
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    console.log(this.courierParams);
    // 查询物流
    this.http.post(this.queryUrl, { orderId: this.courierParams.orderId || this.courierParams.id, type: this.courierParams.orderType }).subscribe((res: any) => {
      if (this.courierParams.send !== 0) {
        this.sf.setValue('/list', res.data);
      }
    })
  }

  save(value: any) {
    console.log(value);
    value.list.forEach(item => {
      item.orderId = this.courierParams.orderId ? this.courierParams.orderId : this.courierParams.id;
      if (this.courierParams.awardIs !== undefined) {
        item.type = 1 // 抽奖发货
      } else {
        item.type = 0
      }
    });

    if (this.courierParams.send === 1) {
      this.http.post(this.editUrl, value.list).subscribe(res => {
        // this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    } else {
      this.http.post(this.url, value.list).subscribe(res => {
        // this.msgSrv.success('保存成功');
        this.modal.close(true);
      });
    }
  }

  close() {
    this.modal.destroy();
  }
}
