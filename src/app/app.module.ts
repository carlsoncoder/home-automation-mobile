import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomeAutomationMobileApp } from './app.component';
import { AuthProvider } from '../providers/auth';
import { GarageProvider } from '../providers/garage';
import { AuthenticatedHttpProvider } from '../providers/authenticated-http';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { GaragePage } from '../pages/garage/garage';

@NgModule({
  declarations: [
    HomeAutomationMobileApp,
    HomePage,
    LoginPage,
    GaragePage
  ],
  imports: [
    IonicModule.forRoot(HomeAutomationMobileApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    HomeAutomationMobileApp,
    HomePage,
    LoginPage,
    GaragePage
  ],
  providers: [
    Storage,
    AuthProvider,
    GarageProvider,
    AuthenticatedHttpProvider
  ]
})
export class AppModule {}
