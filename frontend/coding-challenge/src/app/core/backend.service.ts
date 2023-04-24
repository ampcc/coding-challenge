import { Injectable } from '@angular/core';
import { Admin } from '../shared/models/admin';
import { Application } from '../shared/models/application';
import { Challenge } from '../shared/models/challenge';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { adminLoginCreds, applicationLoginCreds } from '../shared/models/loginCreds';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private backendURL = "https://46022e70-68be-4fbf-a4d1-441852e186b1.mock.pstmn.io";

  constructor(private http: HttpClient) { }

  /*---------------------------------------------
  Applicant API Calls
  -----------------------------------------------*/

  public loginWithAppKey(_applicationKey: string, _applicationId: string):Observable<any>{
    var body: applicationLoginCreds = {applicationId: _applicationId, applicationKey: _applicationKey}
    return this.http.post(this.backendURL + "/api/application/loginWithKey", body);
  }

  public loginWithPassphrase(_passphrase: string): Observable<any>{
    const headers = new HttpHeaders().set('passphrase', _passphrase);
    return this.http.get(this.backendURL + "/api/application/loginWithPassphrase", {'headers': headers});
  }
  public getStatus(_applicantToken: string | null): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + _applicantToken);
    return this.http.get(this.backendURL + "/api/application/getApplicationStatus", {'headers': headers});
  }

  public getChallengeApp(_applicantToken: string, _applicationId: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + _applicantToken);
    return this.http.get(this.backendURL + "/api/application/challenges/" + _applicationId, {'headers': headers});
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

  public getApplication(_adminToken: string, _applicationId: string): Observable<any>{
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.get(this.backendURL + "/api/admin/applications/" + _applicationId, {'headers': headers});
  }

  public getApplications(_adminToken: string, _applicationStatus?: number): Observable<any>{
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    if(typeof _applicationStatus === 'undefined'){
      return this.http.get(this.backendURL + "/api/admin/applications", {'headers': headers});
    }else {
      return this.http.get(this.backendURL + "/api/admin/applications", {'headers': headers, params:{applicationStatus: _applicationStatus}});
    }
  }

  public editApplication(_adminToken: string, _applicationId: string, _applicationStatus?: number, _challengeId?: number, _extendDays?: number): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    var body = {application: {}};
    if(typeof _applicationStatus !== 'undefined'){
      Object.assign(body.application, {applicationStatus: _applicationStatus});
    }
    if(typeof _challengeId !== 'undefined'){
      Object.assign(body.application, {challengeId: _challengeId});
    }
    if(typeof _extendDays !== 'undefined'){
      Object.assign(body.application, {extendDays: _extendDays});
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

  public getChallengeAdm(_adminToken: string, _challengeId: number): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.get(this.backendURL + "/api/admin/challenges/" + _challengeId, {'headers': headers});
  }

  public getChallenges(_adminToken: string): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.get(this.backendURL + "/api/admin/challenges", {'headers': headers});
  }

  public createChallenge(_adminToken: string, _challenge: Challenge): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    var body = {challenge:{challengeHeading: _challenge.challengeHeading, challengeText: _challenge.challengeText}};
    return this.http.post(this.backendURL + "/api/admin/challenges", body, {'headers': headers});
  }

  public editChallenge(_adminToken: string, _challenge: Challenge): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    var body = {challenge:{challengeHeading: _challenge.challengeHeading, challengeText: _challenge.challengeText}};
    return this.http.put(this.backendURL + "/api/admin/challenges/" + _challenge.challengeId, body, {'headers': headers});
  }

  public deleteChallenge(_adminToken: string, _challengeId: number): Observable<any> {
    var headers = new HttpHeaders().set('Authorization', "Token " + _adminToken);
    return this.http.delete(this.backendURL + "/api/admin/challenges/" + _challengeId, {'headers': headers});
  }
}
