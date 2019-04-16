import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { InfoRoutingModule } from './info-routing.module';
import { InfoCertificateCheckComponent } from './certificate-check/certificate-check.component';
import { InfoLoginMessageComponent } from './login-message/login-message.component';
import { InfoAccountForbiddenComponent } from './account-forbidden/account-forbidden.component';
import { InfoLogoutManageComponent } from './logout-manage/logout-manage.component';
import { InfoHeadReportComponent } from './head-report/head-report.component';
import { InfoBrandNewsCheckComponent } from './brand-news-check/brand-news-check.component';
import { InfoForbiddenAccountEditComponent } from './forbidden-account-edit/forbidden-account-edit.component';
import { InfoLogoutEditComponent } from './logout-edit/logout-edit.component';
import { InfoHeadReportEditComponent } from './head-report-edit/head-report-edit.component';
import { InfoBrandNewsCheckFailComponent } from './brand-news-check-fail/brand-news-check-fail.component';
import { InfoBrandNewsContentComponent } from './brand-news-content/brand-news-content.component';
import { InfoAppVersionsComponent } from './app-versions/app-versions.component';
import { InfoAppVersionsEditComponent } from './app-versions-edit/app-versions-edit.component';
import { InfoWebsiteConfigComponent } from './website-config/website-config.component';
import { InfoWebsiteConfigEditComponent } from './website-config-edit/website-config-edit.component';

const COMPONENTS = [
  InfoCertificateCheckComponent,
  InfoLoginMessageComponent,
  InfoAccountForbiddenComponent,
  InfoLogoutManageComponent,
  InfoHeadReportComponent,
  InfoBrandNewsCheckComponent,
  InfoAppVersionsComponent,
  InfoWebsiteConfigComponent];
const COMPONENTS_NOROUNT = [
  InfoForbiddenAccountEditComponent,
  InfoLogoutEditComponent,
  InfoHeadReportEditComponent,
  InfoBrandNewsCheckFailComponent,
  InfoBrandNewsContentComponent,
  InfoAppVersionsEditComponent,
  InfoWebsiteConfigEditComponent];

@NgModule({
  imports: [
    SharedModule,
    InfoRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class InfoModule { }
