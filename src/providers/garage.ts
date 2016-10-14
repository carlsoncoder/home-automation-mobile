import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { AppConfig } from '../config/app-config';
import { GarageStatus } from '../models/garage-status';
import { AuthProvider } from '../providers/auth';
import { AuthenticatedHttpProvider } from '../providers/authenticated-http';

@Injectable()
export class GarageProvider {

  constructor(public authenticatedHttpProvider: AuthenticatedHttpProvider, public authProvider: AuthProvider) {}

  public getStatuses() : Promise<Array<GarageStatus>> {
    return new Promise<Array<GarageStatus>>((resolve, reject) => {
      this.authProvider.getToken()
        .then((token) => {
          var url = AppConfig.BaseHomeAutomationUrl + 'garage/status';
          this.authenticatedHttpProvider.get(url, token)
            .map(res => <Array<GarageStatus>>(res.json()))
            .subscribe((statuses) => {
              let revivedStatuses: Array<GarageStatus> = new Array<GarageStatus>();
              statuses.forEach((status) => {
                // The "map" operation simply maps to an object of GarageStatus that has all the same fields
                // It does NOT "hydrate" the methods on the object.  So instead, we make new instances of GarageStatus
                // using it's constructor, by pulling the properties off the objects returned and mapped from the web service
                var newStatus = new GarageStatus(status.currentDoorStatus, null, status.sortOrder, status.description, status.clientId);

                if (status.lastHealthCheckDateTime) {
                  // date string comes from server in UTC - we convert it to the local device time here
                  var localDate = new Date(status.lastHealthCheckDateTime);
                  newStatus.lastHealthCheckDateTime = localDate;
                }

                revivedStatuses.push(newStatus);
              });

              revivedStatuses.sort(function(a, b) {
                return a.sortOrder - b.sortOrder;
              });

              resolve(revivedStatuses);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public performGarageAction(clientId: string, shouldOpen: boolean) : Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.authProvider.getToken()
        .then((token) => {
          var url = AppConfig.BaseHomeAutomationUrl;
          if (shouldOpen) {
            url = url + 'garage/open';
          }
          else {
            url = url + 'garage/close';
          }

          var body = { clientId: clientId };

          this.authenticatedHttpProvider.post(url, token, body)
            .subscribe(
              (response) => {
                resolve();
              },
              (error) => {
                reject(new Error(error.json().message));
              });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
