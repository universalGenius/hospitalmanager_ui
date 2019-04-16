import { NgModule } from '@angular/core';
import { DelonFormModule, WidgetRegistry } from '@delon/form';
import { SharedModule } from '@shared';
import { MyuploadWidget } from '@shared/widgets/upload/upload.widget';

import { TinymceWidget } from '@shared/widgets/tinymce/tinymce.widget';
import { UEditorWidget } from '@shared/widgets/ueditor/ueditor.widget';
import { MyuploadVideoWidget } from '@shared/widgets/upload-video/upload-video.widget';

export const SCHEMA_THIRDS_COMPONENTS = [
  TinymceWidget,
  UEditorWidget,
  MyuploadWidget,
  MyuploadVideoWidget
];

@NgModule({
  declarations: SCHEMA_THIRDS_COMPONENTS,
  entryComponents: SCHEMA_THIRDS_COMPONENTS,
  imports: [
    SharedModule,
    DelonFormModule.forRoot()
  ],
  exports: [
    ...SCHEMA_THIRDS_COMPONENTS
  ]
})
export class JsonSchemaModule {
  constructor(widgetRegistry: WidgetRegistry) {
    widgetRegistry.register(TinymceWidget.KEY, TinymceWidget);
    widgetRegistry.register(UEditorWidget.KEY, UEditorWidget);
    widgetRegistry.register(MyuploadWidget.KEY, MyuploadWidget);
    widgetRegistry.register(MyuploadVideoWidget.KEY, MyuploadVideoWidget);
  }
}
