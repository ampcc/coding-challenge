import { Injectable } from '@angular/core';
import { Admin } from '../shared/models/admin';
import { Application } from '../shared/models/application';
import { Challenge } from '../shared/models/challenge';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable, min, throwError } from 'rxjs';
import { adminLoginCreds, applicationLoginCreds } from '../shared/models/loginCreds';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private backendURL = "http://localhost:8000";

  constructor(private http: HttpClient) { }

  /*---------------------------------------------
  Applicant API Calls
  -----------------------------------------------*/

  public loginWithAppKey(_applicationKey: string):Observable<any>{
    //var body: applicationLoginCreds = {applicationId: _applicationId, applicationKey: _applicationKey}
    return this.http.post(this.backendURL + "/api/application/loginWithKey/" + _applicationKey,{});
  }

  public loginWithPassphrase(_passphrase: string): Observable<any>{
    const headers = new HttpHeaders().set('passphrase', _passphrase);
    return this.http.get(this.backendURL + "/api/application/loginWithPassphrase", {'headers': headers});
  }
  public getStatus(_applicantToken: string | null): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + _applicantToken);
    return this.http.get(this.backendURL + "/api/application/getApplicationStatus", {'headers': headers});
  }

  public getChallengeApp(_applicantToken: string | null): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + _applicantToken);
    return this.http.get(this.backendURL + "/api/application/challenges", {'headers': headers});
  }

  public uploadChallenge(_applicantKey: string, _oS: string, _pL: string): boolean{
    return true;
  }

  public submitChallenge(_applicationToken: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + _applicationToken);
    return this.http.get(this.backendURL+'/api/application/submitChallenge', {'headers': headers});
  }

  public startChallenge(_applicantToken: string|null): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + _applicantToken);
    return this.http.get(this.backendURL + "/api/application/startChallenge", {'headers': headers});
  }


  /*---------------------------------------------
  Admin API Calls
  -----------------------------------------------*/


  public loginAdmin(_username: string, _password: string): Observable<any>{
    var body: adminLoginCreds = {username: _username, password: _password};
    return this.http.post(this.backendURL + "/api/admin/login", body);
  }

  public changePassword(_adminToken: string | null, _oldPassword: string, _newPassword: string): Observable<any> {
    var body = {"oldPassword": _oldPassword, "newPassword": _newPassword};
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.put(this.backendURL + "/api/admin/changePassword", body, {'headers': headers});
  }

  public getApplication(_adminToken: string|null, _applicationId: string): Observable<any>{
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.get(this.backendURL + "/api/admin/applications/" + _applicationId, {'headers': headers});
  }

  public getApplications(_adminToken: string, _applicationStatus?: number): Observable<any>{
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    if(typeof _applicationStatus === 'undefined'){
      return this.http.get(this.backendURL + "/api/admin/applications", {'headers': headers});
    }else {
      const params = new HttpParams().set('applicationStatus', _applicationStatus);
      return this.http.get(this.backendURL + "/api/admin/applications", {'headers': headers, params:params});
    }
  }

  public editApplication(_adminToken: string | null, _applicationId: string, _applicationStatus?: number, _challengeId?: number, _extendDays?: number): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    var body = {};
    if(typeof _applicationStatus !== 'undefined'){
      Object.assign(body, {applicationStatus: _applicationStatus});
    }
    if(typeof _challengeId !== 'undefined'){
      Object.assign(body, {challengeId: _challengeId});
    }
    if(typeof _extendDays !== 'undefined'){
      Object.assign(body, {extendDays: _extendDays});
    }
    return this.http.put(this.backendURL + "/api/admin/applications/" + _applicationId, body, {'headers': headers});
  }

  public deleteApplication(_adminToken: string, _applicationId: string): Observable<any>{
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.delete(this.backendURL + "/api/admin/applications/" + _applicationId, {'headers': headers});
  }

  public getResult(_adminToken: string, _applicationId: string): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.get(this.backendURL + "/api/admin/applications/results/" + _applicationId, {'headers': headers});
  }

  public getChallengeAdm(_adminToken: string | null, _challengeId: number): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.get(this.backendURL + "/api/admin/challenges/" + _challengeId, {'headers': headers});
  }

  public getChallenges(_adminToken: string | null): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.get(this.backendURL + "/api/admin/challenges", {'headers': headers});
  }

  public createChallenge(_adminToken: string | null, _challenge: Challenge): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    var body = {challenge:{challengeHeading: _challenge.challengeHeading, challengeText: _challenge.challengeText}};
    return this.http.post(this.backendURL + "/api/admin/challenges", body, {'headers': headers});
  }

  public editChallenge(_adminToken: string | null, _challenge: Challenge): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    var body = {challengeHeading: _challenge.challengeHeading, challengeText: _challenge.challengeText};
    return this.http.put(this.backendURL + "/api/admin/challenges/" + _challenge.id, body, {'headers': headers});
  }

  public deleteChallenge(_adminToken: string | null, _challengeId: number): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.delete(this.backendURL + "/api/admin/challenges/" + _challengeId, {'headers': headers});
  }

  // Time functions
  public calcRemainingTime(_currentTime: number, _expiryTime: number): string {
    _expiryTime = Math.floor(_expiryTime * 1000);
    var timeDelta = (_expiryTime - _currentTime) / 1000;
    if(timeDelta > 0){
      var days = Math.floor(timeDelta / (60 * 60 * 24));
      timeDelta -= days * 3600 * 24;
      var hours = Math.floor(timeDelta / 3600);
      timeDelta -= hours * 3600;
      var minutes = Math.floor(timeDelta / 60);
      return days + " days " + hours + " hours " + minutes + " minutes";
    }else {
      return "expired"
    }
  }
}
