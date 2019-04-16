import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { DataRoutingModule } from './data-routing.module';
import { DataStaticComponent } from './static/static.component';
import { DataDataStatisticsComponent } from './data-statistics/data-statistics.component';
import { DataCategoricalDataComponent } from './categorical-data/categorical-data.component';
import { DataCategoricalDataEditComponent } from './categorical-data-edit/categorical-data-edit.component';
import { DataStaticEditComponent } from './static-edit/static-edit.component';

const COMPONENTS = [
  DataStaticComponent,
  DataDataStatisticsComponent,
  DataCategoricalDataComponent];
const COMPONENTS_NOROUNT = [
  DataCategoricalDataEditComponent,
  DataStaticEditComponent];

@NgModule({
  imports: [
    SharedModule,
    DataRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class DataModule { }
