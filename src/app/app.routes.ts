import { Routes } from '@angular/router';
import { AuthGuard } from './services/guards/auth-guard.service';
import { RoleGuard } from './services/guards/role-guard.service';
import { DonateComponent } from './components/donation/donate/donate.component';
import { FoodDetailsComponent } from './components/food-details/food-details.component';
import { FoodsComponent } from './components/foods/foods.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { MydonationComponent } from './components/user/mydonation/mydonation.component';
import { MyrequestComponent } from './components/user/myrequest/myrequest.component';
import { OrdersComponent } from './components/user/orders/orders.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RequestDetailComponent } from './components/request-detail/request-detail.component';
import { RequestsComponent } from './components/requests/requests.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { TransactionComponent } from './components/user/mytransaction/transaction.component';
import {RequestFoodComponent} from './components/request-food/request-food.component';
import { FoodCartComponent } from './components/cart/food-cart/food-cart.component';
import { FoodAddressComponent } from './components/checkout/food-address/food-address.component';
import { RequestCartComponent } from './components/cart/request-cart/request-cart.component';
import { RequestAddressComponent } from './components/checkout/request-address/request-address.component';
import { AllOrdersComponent } from './components/admin/all-orders/all-orders.component';
import { AllDonationsComponent } from './components/admin/all-donations/all-donations.component';
import { AllRequestsComponent } from './components/admin/all-requests/all-requests.component';
import { AllTransactionsComponent } from './components/admin/all-transactions/all-transactions.component';

export const routes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    { path: 'donate', component:DonateComponent},
    { path: 'request/food', component:RequestFoodComponent},
    { path: 'login', component:LoginComponent},
    {path: 'signup', component:SignupComponent},
    {path: 'food/available', component:FoodsComponent},
    {path: 'food/:id', component:FoodDetailsComponent},
    {path: 'request/available', component:RequestsComponent},
    {path: 'request/:id', component:RequestDetailComponent},
    {path: 'profile', component:ProfileComponent,canActivate: [AuthGuard]},
    {path: 'orders', component:OrdersComponent,canActivate: [AuthGuard]},
    {path: 'transactions', component:TransactionComponent,canActivate: [AuthGuard]},
    {path: 'my/requests', component:MyrequestComponent,canActivate: [AuthGuard]},
    {path: 'my/donations', component:MydonationComponent,canActivate: [AuthGuard]},
    {path: 'cart/food', component:FoodCartComponent,canActivate: [AuthGuard]},
    {path: 'cart/request', component:RequestCartComponent,canActivate: [AuthGuard]},
    {path: 'cart/food/address', component:FoodAddressComponent,canActivate: [AuthGuard]},
    {path: 'cart/request/address', component:RequestAddressComponent,canActivate: [AuthGuard]},
    {path: 'all/orders', component:AllOrdersComponent,canActivate: [RoleGuard]},
    {path: 'all/donations', component:AllDonationsComponent,canActivate: [RoleGuard]},
    {path: 'all/requests', component:AllRequestsComponent,canActivate: [RoleGuard]},
    {path: 'all/transactions', component:AllTransactionsComponent,canActivate: [RoleGuard]},
    { path: '',   redirectTo: '/home', pathMatch: 'full' },
    
];
