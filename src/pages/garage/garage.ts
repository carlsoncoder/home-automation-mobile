import { Component, OnDestroy } from '@angular/core';
import { AlertController, ToastController } from 'ionic-angular';
import { GarageProvider } from '../../providers/garage';
import { GarageStatus } from '../../models/garage-status';

@Component({
  selector: 'page-garage',
  templateUrl: 'garage.html'
})
export class GaragePage implements OnDestroy {

  timer: any;
  garageStatuses: Array<GarageStatus>;
  lastRefreshed: Date;

  constructor(
    public alertController: AlertController,
    public toastController: ToastController,
    public garageProvider: GarageProvider) {
  }

  ionViewDidLoad() {
    // load immediately on view load
    this.loadStatusRecords(null);

    this.enableTimer();
  }

  enableTimer() {
    if (this.timer) {
      clearInterval(this.timer);
    }

    // refresh every 30 seconds
    let intervalTime = 1000 * 30;
    this.timer = setInterval(() => {
      this.loadStatusRecords(null);
    }, intervalTime);
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  doRefresh(refresher) {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.loadStatusRecords(refresher);

    this.enableTimer();
  }

  loadStatusRecords(refresher) {
    this.garageProvider.getStatuses()
      .then((statuses) => {
        this.lastRefreshed = new Date();
        this.garageStatuses = statuses;
        if (refresher) {
          refresher.complete();
        }
      })
      .catch((error) => {
        this.garageStatuses = [];

        if (refresher) {
          refresher.complete();
        }

        let alert = this.alertController.create({
          title: 'Garage Status',
          subTitle: 'Error loading garage status records: ' + error.message,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                return true;
              }
            }
          ]
        });

        alert.present();
      });
  }

  onGarageButtonClicked(event, garageStatus) {
    var shouldOpen: boolean = !garageStatus.isOpen();
    this.garageProvider.performGarageAction(garageStatus.clientId, shouldOpen)
      .then(() => {
        this.enableTimer();
        garageStatus.action = shouldOpen ? 'Opening...' : 'Closing...';
        garageStatus.currentDoorStatus = '...';
        this.presentToast();
      })
      .catch((error) => {
        let alert = this.alertController.create({
          title: 'Garage Status',
          subTitle: 'Error performing action: ' + error.message,
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                return true;
              }
            }
          ]
        });

        alert.present();
      });
  }

  presentToast() {
    let toast = this.toastController.create({
      message: 'Action submitted successfully!',
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }






}
