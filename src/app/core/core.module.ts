import { NgModule, Optional, SkipSelf } from '@angular/core';
import { throwIfAlreadyLoaded } from './module-import-guard';
import { MessageService } from './message/message.service';
import { ViewImg } from './view-img/view-img.service';


@NgModule({
  providers: [
    MessageService,
    ViewImg
  ]
})
export class CoreModule {
  constructor( @Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
