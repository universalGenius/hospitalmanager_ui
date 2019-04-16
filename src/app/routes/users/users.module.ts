import { NgModule } from '@angular/core';
import { SharedModule } from '@shared';
import { UsersRoutingModule } from './users-routing.module';
import { UsersUsersListComponent } from './users-list/users-list.component';
import { UsersBrandComponent } from './brand/brand.component';
import { UsersMessageComponent } from './message/message.component';
import { UsersBrandEditComponent } from './brand-edit/brand-edit.component';
import { UsersCompanyComponent } from './company/company.component';
import { UsersCompanyEditComponent } from './company-edit/company-edit.component';
import { UsersUsersDetailComponent } from './users-detail/users-detail.component';
import { UsersUsersPhotoEditComponent } from './users-photo-edit/users-photo-edit.component';
import { UsersUsersSetphoneComponent } from './users-setphone/users-setphone.component';
import { UsersUsersSendmessageComponent } from './users-sendmessage/users-sendmessage.component';
import { UsersBrandDetailComponent } from './brand-detail/brand-detail.component';
import { UsersEnterprisesComponent } from './enterprises/enterprises.component';
import { UsersCompanyDetailComponent } from './company-detail/company-detail.component';
import { UsersBrandFakeComponent } from './brand-fake/brand-fake.component';
import { UsersBrandFakeEditComponent } from './brand-fake-edit/brand-fake-edit.component';
import { UsersBrandSortEditComponent } from './brand-sort-edit/brand-sort-edit.component';

const COMPONENTS = [
  UsersUsersListComponent,
  UsersBrandComponent,
  UsersMessageComponent,
  UsersCompanyComponent,
  UsersEnterprisesComponent,
  UsersBrandFakeComponent];
const COMPONENTS_NOROUNT = [
  UsersBrandEditComponent,
  UsersCompanyEditComponent,
  UsersUsersDetailComponent,
  UsersUsersPhotoEditComponent,
  UsersUsersSetphoneComponent,
  UsersUsersSendmessageComponent,
  UsersBrandDetailComponent,
  UsersCompanyDetailComponent,
  UsersBrandFakeEditComponent,
  UsersBrandSortEditComponent];



@NgModule({
  imports: [
    SharedModule,
    UsersRoutingModule
  ],
  declarations: [
    ...COMPONENTS,
    ...COMPONENTS_NOROUNT
  ],
  entryComponents: COMPONENTS_NOROUNT
})
export class UsersModule { }


