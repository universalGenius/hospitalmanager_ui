import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';

import { DelonChartModule } from '@delon/chart';

// #region third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';


import { WordLimitPipe } from './pipes/pipes';
import { ShowDetailPipe } from './pipes/pipes';



import { DrawDeliveryModalComponent } from './modal/delivery-modal/delivery-modal.component';
import { NgxTinymceModule } from 'ngx-tinymce';
import { UEditorModule } from 'ngx-ueditor';
const THIRDMODULES = [
  NgZorroAntdModule,
  CountdownModule,
  NgxTinymceModule,
  UEditorModule
];
// #endregion


// #region your componets & directives
const COMPONENTS = [DrawDeliveryModalComponent];
const DIRECTIVES = [WordLimitPipe,ShowDetailPipe];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    DelonChartModule,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    DelonChartModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  entryComponents: [...COMPONENTS,]
})
export class SharedModule { }
