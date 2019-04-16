import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfoCertificateCheckComponent } from './certificate-check/certificate-check.component';
import { InfoLoginMessageComponent } from './login-message/login-message.component';
import { InfoAccountForbiddenComponent } from './account-forbidden/account-forbidden.component';
import { InfoLogoutManageComponent } from './logout-manage/logout-manage.component';
import { InfoHeadReportComponent } from './head-report/head-report.component';
import { InfoBrandNewsCheckComponent } from './brand-news-check/brand-news-check.component';
import { InfoAppVersionsComponent } from './app-versions/app-versions.component';
import { InfoWebsiteConfigComponent } from './website-config/website-config.component';

const routes: Routes = [

  // { path: 'certificate', component: InfoListComponent }

  { path: 'certificate-check', component: InfoCertificateCheckComponent },
  { path: 'login-message', component: InfoLoginMessageComponent },
  { path: 'account-forbidden', component: InfoAccountForbiddenComponent },
  { path: 'logout-manage', component: InfoLogoutManageComponent },
  { path: 'head-report', component: InfoHeadReportComponent },
  { path: 'brand-news-check', component: InfoBrandNewsCheckComponent },
  { path: 'app-versions', component: InfoAppVersionsComponent },
  { path: 'website-config', component: InfoWebsiteConfigComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InfoRoutingModule { }
