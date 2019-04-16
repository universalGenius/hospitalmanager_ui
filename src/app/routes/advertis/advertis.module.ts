import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { AdvertisRoutingModule } from './advertis-routing.module';
import { AdvertisPcBannerComponent } from './pc-banner/pc-banner.component';
import { AdvertisAppBannerComponent } from './app-banner/app-banner.component';
import { AdvertisPcBannerEditComponent } from './pc-banner-edit/pc-banner-edit.component';
import { AdvertisAppBannerEditComponent } from './app-banner-edit/app-banner-edit.component';
import { AdvertisHomePageSortingComponent } from './home-page-sorting/home-page-sorting.component';
import { AdvertisHotShopsSortingComponent } from './hot-shops-sorting/hot-shops-sorting.component';
import { AdvertisHotSearchComponent } from './hot-search/hot-search.component';
import { AdvertisAdvertisingSpaceComponent } from './advertising-space/advertising-space.component';
import { AdvertisHomePageSortingEditComponent } from './home-page-sorting-edit/home-page-sorting-edit.component';
import { AdvertisHotShopsSortingEditComponent } from './hot-shops-sorting-edit/hot-shops-sorting-edit.component';
import { AdvertisHotSearchEditComponent } from './hot-search-edit/hot-search-edit.component';
import { AdvertisAdvertisingSpaceEditComponent } from './advertising-space-edit/advertising-space-edit.component';
import { AdvertisAdvertisingDetailComponent } from './advertising-detail/advertising-detail.component';
import { AdvertisAdvertisingDetailEditComponent } from './advertising-detail-edit/advertising-detail-edit.component';

const COMPONENTS = [
  AdvertisPcBannerComponent,
  AdvertisAppBannerComponent,
  AdvertisHomePageSortingComponent,
  AdvertisHotShopsSortingComponent,
  AdvertisHotSearchComponent,
  AdvertisAdvertisingSpaceComponent,
  AdvertisAdvertisingDetailComponent];
const COMPONENTS_NOROUNT = [
  AdvertisPcBannerEditComponent,
  AdvertisAppBannerEditComponent,
  AdvertisHomePageSortingEditComponent,
  AdvertisHotShopsSortingEditComponent,
  AdvertisHotSearchEditComponent,
  AdvertisAdvertisingSpaceEditComponent,
  AdvertisAdvertisingDetailEditComponent];

@NgModule({
  imports: [
    SharedModule,
    AdvertisRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class AdvertisModule { }
