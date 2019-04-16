import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DataStaticComponent } from './static/static.component';
import { DataDataStatisticsComponent } from './data-statistics/data-statistics.component';
import { DataCategoricalDataComponent } from './categorical-data/categorical-data.component';

const routes: Routes = [

  { path: 'data-static', component: DataStaticComponent },
  { path: 'data-statistics', component: DataDataStatisticsComponent },
  { path: 'categorical-data', component: DataCategoricalDataComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataRoutingModule { }
