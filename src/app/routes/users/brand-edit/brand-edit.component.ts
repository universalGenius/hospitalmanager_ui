import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {
  NzModalRef,
  NzMessageService,
  CascaderOption,
  NzFormatEmitEvent,
  UploadFile,
} from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import { SFSchema, SFUISchema, CascaderWidget, SFComponent, FormProperty, PropertyGroup } from '@delon/form';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users-brand-edit',
  templateUrl: './brand-edit.component.html',
})
export class UsersBrandEditComponent implements OnInit {
  record: any = {};
  i: any = {};
  trainContentIdList = [];
  @ViewChild('sf') sf: SFComponent;
  schema: SFSchema = {
    properties: {
      brandBasicInfo: {
        type: 'object',
        properties: {
          id: { type: 'number', title: 'id' },
          name: { type: 'string', title: '品牌名称' },
          slogan: { type: 'string', title: '品牌slogan' },
          foodTypeArray: { title: '餐饮类型', type: 'number' },
          capitalId: { type: 'number', title: '投资金额' },
          directStoreNum: { type: 'string', title: '直营店数量', maxLength: 8 },
          joinStoreNum: { type: 'string', title: '加盟店数量', maxLength: 8, },
          status: {
            type: 'number',
            title: '审核状态',
            enum: [
              { label: '审核中', value: 0 },
              { label: '发布成功', value: 1 },
              { label: '审核失败', value: 2 },
            ],
          },
          isStand: { type: 'boolean', title: '品牌是否下架' },
          chatType: { type: 'string', title: '聊天类型', enum:[{label:'公司',value:0},{label:'客服',value:1}] },
          belongId: {
            type: 'number',
            title: '品牌所属',
            enum: [
              { label: '自有品牌', value: 1 },
              { label: '代理品牌', value: 2 },
            ],
          },
          ownImg: {
            type: 'string',
            title: '注册商标证书'
          },
          agentImg: {
            type: 'string',
            title: '代理授权证书'
          },


          certificateType: {
            type: 'number',
            title: '证书类型',
            enum: [
              { label: '营业执照', value: 1 },
              { label: '组织机构代码证', value: 2 },
              { label: '税务登记证', value: 3 },
              { label: '三证合一', value: 4 },
            ],
          },
          certificateImg1: {
            type: 'string',
            title: '营业执照',

          },
          certificateImg2: {
            type: 'string',
            title: '组织机构代码证'
          },
          certificateImg3: {
            type: 'string',
            title: '税务登记证'
          },
          certificateImg4: {
            type: 'string',
            title: '三证合一'
          },
          brandCertificateId: { type: 'string', title: '品牌证书', ui: { hidden: true } },
          logo: { type: 'string', title: '品牌logo' },
        },
        required: [],
      },
      brandInvestment: {
        type: 'object',
        properties: {
          brandId: { type: 'number', title: '品牌id', ui: { hidden: true } },
          regionWarrant: {
            type: 'number', title: '区域授权', enum: [
              { value: 0, label: '否' },
              { value: 1, label: "是" },
            ]
          },
          modeIdList: { type: 'number', title: '加盟模式' },
          provinceCityArray: { title: '招商区域', type: 'number', enum: [{}] },
          crowdIdList: {
            type: 'number', title: '适合人群', enum: [
              { value: 1, label: "白手起家" },
              { value: 2, label: "自由创业" },
              { value: 3, label: "白领创业" },
              { value: 4, label: "现有公司增项" },
              { value: 5, label: "大学生创业" },
              { value: 6, label: "其他" }
            ]
          },
          franchiseTime: { type: 'string', title: '特许时间' },
          trainingPeriod: { type: 'string', title: '培训期限' },
          contractTerm: { type: 'string', title: '合同期限' },
          locationId: { type: 'number', title: '店面选址' },
          decorationId: { type: 'number', title: '设计装修' },
          trainingMethodId: { type: 'number', title: '培训方式' },
          trainContentIdList: { type: 'number', title: '培训内容', },

          operateSupportIdList: { type: 'number', title: '经营支持', },
          operationalSupervisionIdList: { type: 'number', title: '经营指导', },
          video: { type: 'string', title: '宣传视频' },
        },
      },
      brandInitialFee: {
        type: 'object',
        properties: {
          brandId: { type: 'number', title: '品牌id', ui: { hidden: true } },
          joinGold: { type: 'string', title: '加盟费', maxLength: 9 },
          margin: { type: 'string', title: '保证金', maxLength: 9 },
          equipmentFee: { type: 'string', title: '设备费', maxLength: 9 },
          otherExpenses: { type: 'string', title: '其他费用', maxLength: 9 },
        },
        required:[]
      },
      video: {
        type: 'string',
        title: '品牌视频',
      },
      pictures: { type: 'string', title: '效果图' },
      brandIntroduction: {
        type: 'object',
        properties: {
          brandId: { type: 'number', title: '品牌id', ui: { hidden: true } },
          introduction: { type: 'string', title: '品牌介绍' },
          advantage: { type: 'string', title: '加盟优势' },
          conditions: { type: 'string', title: '加盟条件' },
          process: { type: 'string', title: '加盟流程' },
        },
      },
    },
  };
  ui: SFUISchema = {
    $brandBasicInfo: {
      grid: { span: 12 },
      type: 'object',
      $id: {
        hidden: true,
      },
      $directStoreNum: {
        validator:value=>(Number.isInteger(Number(value))&&!/\./.test(value))?[]:[{ keyword: 'required', message: '必须是整数'}]
      },
      $joinStoreNum: {
        validator:value=>(Number.isInteger(Number(value))&&!/\./.test(value))?[]:[{ keyword: 'required', message: '必须是整数'}]
      },
      '*': {
        spanLabelFixed: 140,
        grid: { span: 12 },
      },
      $foodTypeArray: {
        widget: 'cascader',
        asyncData: (
          node: CascaderOption,
          index: number,
          me: CascaderWidget,
        ) => {
          return this.getFoodId(node, index, me);
        },
      },
      $capitalId: {
        widget: 'select',
        asyncData: () => { return this.getCapital() },
      },
      $status: { widget: 'select' },
      $belongId: { widget: 'select' },
      $ownImg: {
        widget: 'MyuploadWidget',
        config: {
          max: 1,
        },
        visibleIf: {
          belongId: [1]
        }
      },
      $agentImg: {
        widget: 'MyuploadWidget',
        config: {
          max: 1,
        },
        visibleIf: {
          belongId: [2]
        }
      },
      $certificateImg1: {
        widget: 'MyuploadWidget',
        config: {
          max: 1,
        },
        visibleIf: {
          certificateType: [1]
        }
      },
      $certificateImg2: {
        widget: 'MyuploadWidget',
        config: {
          max: 1,
        },
        visibleIf: {
          certificateType: [2]
        }
      },
      $certificateImg3: {
        widget: 'MyuploadWidget',
        config: {
          max: 1,
        },
        visibleIf: {
          certificateType: [3]
        }
      },
      $certificateImg4: {
        widget: 'MyuploadWidget',
        config: {
          max: 1,
        },
        visibleIf: {
          certificateType: [4]
        }
      },
      $certificateType: {
        widget: 'select'
      },
      $logo: {
        widget: 'MyuploadWidget',
        config: {
          max: 1,
        },
      },
    },
    $brandInvestment: {
      grid: { span: 12 },
      type: 'object',
      '*': {
        spanLabelFixed: 140,
        grid: { span: 12 },
      },
      $regionWarrant: {
        widget: 'radio'
      },
      $provinceCityArray: {
        widget: 'tree-select',
        checkable: true,
        // asyncData: () => {
        //   return this.treeSelect();
        // },
        asyncData: () => {
          return of([this.i.brandDto.brandInvestment.country]);
        }
      },
      $modeIdList: {
        widget: 'checkbox',
        asyncData: () => {
          return this.getModeIds();
        },
      },
      $crowdIdList: {
        widget: 'checkbox',
      },
      $locationId: {
        widget: 'radio', asyncData: () => this.getAffiliate(1)
      },
      $decorationId: {
        widget: 'radio', asyncData: () => this.getAffiliate(2)
      },
      $trainingMethodId: {
        widget: 'radio', asyncData: () => this.getAffiliate(3)
      },
      $trainContentIdList: {
        widget: 'checkbox',
        asyncData: () => this.getAffiliate(4),
        change:()=>this.numberOfValidation()
      },
      $operateSupportIdList: {
        widget: 'checkbox', asyncData: () => this.getAffiliate(5),
        change:()=>this.numberOfValidation()
      },
      $operationalSupervisionIdList: {
        widget: 'checkbox', asyncData: () => this.getAffiliate(6),
        change:()=>this.numberOfValidation()
      },
      $video: {
        spanLabelFixed: 140,
        grid: { span: 12 },
        widget: 'upload',
        action: 'https://oss.ilashou.com/oss/start',
        data: { directory: 'test', uploadType: 1, name: 'mm' },
        resReName: 'data.0',
        accept: 'video/*',
      },
    },
    $brandIntroduction: {
      spanLabelFixed: 90,
      type: 'object',
      '*': {
        spanLabelFixed: 90,
        grid: { span: 12 },
      },
      $brandId: {
        hidden: true,
      },
      $introduction: {
        widget: 'ueditor',
        config:{
          autoHeightEnabled:false,
          initialFrameHeight:'400'
        }
      },
      $advantage: {
        widget: 'ueditor',
        config:{
          autoHeightEnabled:false,
          initialFrameHeight:'400'
        }
      },
      $conditions: {
        widget: 'ueditor',
        config:{
          autoHeightEnabled:false,
          initialFrameHeight:'400'
        }
      },
      $process: {
        widget: 'ueditor',
        config:{
          autoHeightEnabled:false,
          initialFrameHeight:'400'
        },
      },

    },
    $pictures: {
      spanLabelFixed: 90,
      grid: { span: 24 },
      widget: 'MyuploadWidget',
      config: {
        max: 5
      }
    },
    $brandInitialFee: {
      grid: { span: 12 },
      '*': {//joinGold
        spanLabelFixed: 140,
        grid: { span: 12 },
      },
      $joinGold: {//margin equipmentFee  otherExpenses
       validator:value=>(!isNaN(value) && Number(Number(value).toFixed(2))==Number(value))?[]:[{ keyword: 'required', message: '必须是整数或两位小数'}]
      },
      $margin: {
        validator:value=>(!isNaN(value) && Number(Number(value).toFixed(2))==Number(value))?[]:[{ keyword: 'required', message: '必须是整数或两位小数'}]
      },
      $equipmentFee: {
        validator:value=>(!isNaN(value) && Number(Number(value).toFixed(2))==Number(value))?[]:[{ keyword: 'required', message: '必须是整数或两位小数'}]
      },
      $otherExpenses: {
        validator:value=>(!isNaN(value) && Number(Number(value).toFixed(2))==Number(value))?[]:[{ keyword: 'required', message: '必须是整数或两位小数'}]
      },
    },
    $video: {
      spanLabelFixed: 90,
      grid: { span: 12 },
      widget: 'MyuploadVideoWidget',
      action: 'https://oss.ilashou.com/oss/start',
      data: { directory: 'test', uploadType: 1, name: 'mm' },
      resReName: 'data.0',
      accept: 'video/*',

    },
  };
  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient,
  ) { }

  ngOnInit(): void {
    console.log(this.i,'iiiiiiiii')
    this.i.certificateList.forEach((element:any) => {
      this.i.brandDto.brandBasicInfo["certificateImg" + element.typeId] = element.imgUrl
    });
  };

  save(value: any) {
    console.log(value);
    let certificateType = value.brandBasicInfo.certificateType;
    value.brandBasicInfo.certificateImg = value.brandBasicInfo['certificateImg' + certificateType];
    delete value.brandBasicInfo['certificateImg' + certificateType];
    let data = {
      brandDto: value
    }
    typeof data.brandDto.pictures == 'string' ? data.brandDto.pictures = [data.brandDto.pictures] : ''
    if([
      value.brandInvestment.trainingMethodId,
      value.brandInvestment.decorationId,
      value.brandInvestment.locationId,
      ...value.brandInvestment.trainContentIdList,
      ...value.brandInvestment.operationalSupervisionIdList,
      ...value.brandInvestment.operateSupportIdList
    ].length>9){
      this.msgSrv.error('加盟支持(店面选址,设计装修,培训方式,培训内容,经营支持,经营指导)最多可选9个');
      return
    }
    this.http
      .post(`/brand_manager/update_brand`, data)
      .subscribe((res: any) => {
        console.log(res);
        if (res.code === 12000) {
          this.msgSrv.success('保存成功');
          this.modal.close(true);
        }
      });
  }
  getFoodId(node, index, me) {
    return new Promise(resolve => {
      this.http
        .get(`/drop_down_box/get_food_type_list`)
        .subscribe((res: any) => {
          (node as any).children = res.data.filter((w: any) => {
            w.isLeaf = index === 0;
            return w.parent === (node.value || 0);
          });
          resolve();
          me.detectChanges(true);
        });
    });
  }
  getCapital() {
    return this.http.get(`/drop_down_box/get_capital_list`).pipe(
      map((res: any) => {
        return [...res.data,{label:'面议',value:0}];
      }),
    );
  }
  getJoin() {
    return this.http.get(`/drop_down_box/get_join_mode_list`).pipe(
      map((res: any) => {
        return res.data;
      }),
    );
  }
  getAffiliate1(type) {
    return this.http.get(`/drop_down_box/get_affiliate_support_list`).pipe(
      map((res: any) => {
        console.log(res)
        return res.data.filter((w) => {
          return w.type === type;
        });
      }),
    );
  }
  getAffiliate(type) {
    return of(this.i.affiliateSupportList.filter(w => w.type === type))
  }
  getModeIds() {
    return this.http.get(`/drop_down_box/get_join_mode_list`).pipe(
      map((res: any) => {
        return res.data;
      }),
    );
  }

  citys = [];
  treeSelect() {//此接口暂时没有用到,省市列表是上个页面带过来的
    return this.http.get(`/drop_down_box/get_province_city_all`).pipe(
      map((res: any) => {
        console.log(res);
        let nodes = [];
        res.data.map(element => {
          if (element.parent == 1) {
            nodes.push({
              title: element.label,
              key: element.value,
              value: element.value,
              children: [],
            });
          } else {
            nodes.forEach(item => {
              if (item.value === element.parent) {
                item.children.push({
                  title: element.label,
                  key: element.value,
                  value: element.value,
                  isLeaf: true,
                });
              }
            });
          }
        });
        console.log([{
          title: '全国',
          key: 1,
          value: 1,
          children: nodes
        }])
        return [{
          title: '全国',
          key: 1,
          value: 1,
          children: nodes
        }]
      }),
    );
  }

  close() {
    this.modal.destroy();
  }
  numberOfValidation(){//trainingMethodId decorationId locationId
    let list=[
      this.sf.value.brandInvestment.trainingMethodId,
      this.sf.value.brandInvestment.decorationId,
      this.sf.value.brandInvestment.locationId,
      ...this.sf.value.brandInvestment.trainContentIdList,
      ...this.sf.value.brandInvestment.operationalSupervisionIdList,
      ...this.sf.value.brandInvestment.operateSupportIdList
    ]
    if(list.length>9){
      this.msgSrv.error('加盟支持(店面选址,设计装修,培训方式,培训内容,经营支持,经营指导)最多可选9个');
    }
  }
}
