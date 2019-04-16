import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvertisPcBannerComponent } from './pc-banner/pc-banner.component';
import { AdvertisAppBannerComponent } from './app-banner/app-banner.component';
import { AdvertisHomePageSortingComponent } from './home-page-sorting/home-page-sorting.component';
import { AdvertisHotShopsSortingComponent } from './hot-shops-sorting/hot-shops-sorting.component';
import { AdvertisHotSearchComponent } from './hot-search/hot-search.component';
import { AdvertisAdvertisingSpaceComponent } from './advertising-space/advertising-space.component';
import { AdvertisAdvertisingDetailComponent } from './advertising-detail/advertising-detail.component';

const routes: Routes = [

  { path: 'pc-banner', component: AdvertisPcBannerComponent },
  { path: 'app-banner', component: AdvertisAppBannerComponent },
  { path: 'home-page-sorting', component: AdvertisHomePageSortingComponent },
  { path: 'hot-shops-sorting', component: AdvertisHotShopsSortingComponent },
  { path: 'hot-search', component: AdvertisHotSearchComponent },
  { path: 'advertising-space', component: AdvertisAdvertisingSpaceComponent },
  { path: 'advertising-detail', component: AdvertisAdvertisingDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvertisRoutingModule { }
