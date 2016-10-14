import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, ModalController, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { GaragePage } from '../pages/garage/garage';
import { AuthProvider } from '../providers/auth';

@Component({
  templateUrl: 'app.html'
})
export class HomeAutomationMobileApp {
  @ViewChild(Nav) nav: Nav;

  // make HomePage the root (or first) page
  rootPage: any = HomePage;
  pages: Array<{title: string, component: any, requiresAuthentication: boolean}>;

  constructor(
    public platform: Platform,
    public menuController: MenuController,
    public modalController: ModalController,
    public authProvider: AuthProvider) {

    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Home', component: HomePage, requiresAuthentication: false },
      { title: 'Garage', component: GaragePage, requiresAuthentication: true },
      { title: 'Log Out', component: HomePage, requiresAuthentication: false },
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // The platform is ready and our plugins are available
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menuController.close();

    if (page.title === 'Log Out') {
      this.authProvider.logOut();
      this.nav.setRoot(page.component);
      return;
    }

    if (!page.requiresAuthentication) {
      this.nav.setRoot(page.component);
      return;
    }

    this.authProvider.isAuthenticated()
      .then((authStatus) => {
        if (authStatus.isAuthenticated) {
          this.nav.setRoot(page.component);
        }
        else {
          this.showLogin(page.component);
        }
      });
  }

  showLogin(component: any) {
    let modal = this.modalController.create(LoginPage);

    modal.onDidDismiss(data => {
      if (data.successful) {
        this.nav.setRoot(component);
      }
    });

    modal.present();
  }
}
