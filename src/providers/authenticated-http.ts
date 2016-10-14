import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticatedHttpProvider {

  constructor(public http: Http) {}

  public get(url: string, token: string) : Observable<Response> {
    let requestHeaders = this.createAuthorizationHeaders(token);
    return this.http.get(url, { headers: requestHeaders });
  }

  public post(url: string, token: string, data: any) : Observable<Response> {
    let requestHeaders = this.createAuthorizationHeaders(token);
    return this.http.post(url, data, { headers: requestHeaders });
  }

  createAuthorizationHeaders(token: string) : Headers {
    let headers = new Headers();
    let authHeaderValue = 'Bearer ' + token;
    headers.append('Authorization', authHeaderValue);

    return headers;
  }
}
