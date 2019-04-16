import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersUsersListComponent } from './users-list/users-list.component';
import { UsersBrandComponent } from './brand/brand.component';
import { UsersMessageComponent } from './message/message.component';
import { UsersCompanyComponent } from './company/company.component';
import { UsersEnterprisesComponent } from './enterprises/enterprises.component';
import { UsersBrandFakeComponent } from './brand-fake/brand-fake.component';

const routes: Routes = [
  { path: 'person', component: UsersUsersListComponent },
  { path: 'brand', component: UsersBrandComponent},
  { path: 'message', component: UsersMessageComponent },
  { path: 'company', component: UsersCompanyComponent },
  { path: 'enterprises', component: UsersEnterprisesComponent },
  { path: 'brand-fake', component: UsersBrandFakeComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
