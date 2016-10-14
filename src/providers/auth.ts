import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import { AuthenticationStatus } from '../models/authentication-status';
import { AppConfig } from '../config/app-config';
import 'rxjs/add/operator/map';


@Injectable()
export class AuthProvider {

  private static readonly TOKEN_IDENTIFIER = 'homeAutomationMobile-auth-jwt-token';

  constructor(public http: Http, public storage: Storage) {}

  public isAuthenticated() : Promise<AuthenticationStatus> {
    return new Promise<AuthenticationStatus>((resolve) => {
      this.getToken()
        .then(token => {
          let username = this.usernameFromToken(token);
          let authStatus = new AuthenticationStatus(true, username, '');
          resolve(authStatus);
        })
        .catch(error => {
          let authStatus = new AuthenticationStatus(false, '', error.message);

          // this is intentional, we don't want to reject here, we want to resolve with the AuthStatus object
          // and let the caller use that to figure out what to do next
          resolve(authStatus);
        });
    });
  }

  public getToken() : Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.storage.get(AuthProvider.TOKEN_IDENTIFIER)
        .then((token) => {
          if (token == null || typeof(token) == 'undefined' || token == 'undefined' || token == '') {
            reject(new Error('No authentication token was found'));
          }
          else if (this.isTokenExpired(token)) {
            // remove the token from storage
            this.logOut();
            reject(new Error('Authentication token has expired'));
          }
          else {
            resolve(token);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public login(username: string, password: string) : Promise<string> {

    return new Promise<boolean>((resolve, reject) => {
      var loginUrl = AppConfig.BaseHomeAutomationUrl + 'login';
      var body = {username: username, password: password};

      this.http.post(loginUrl, body)
        .map(res => res.json())
        .subscribe(
          (data) => {
            this.setToken(data.token);
            resolve(data.token);
          },
          (error) => {
            reject(new Error(error.json().message));
          });
    });
  }

  public logOut() {
    this.storage.remove(AuthProvider.TOKEN_IDENTIFIER);
  }

  setToken(token: string) {
    this.storage.set(AuthProvider.TOKEN_IDENTIFIER, token);
  }

  isTokenExpired(token) {
    let payload = JSON.parse(window.atob(token.split('.')[1]));
    return payload.exp < Date.now() / 1000;
  }

  usernameFromToken(token) : string {
    let payload = JSON.parse(window.atob(token.split('.')[1]));
    return payload.username;
  }
}
