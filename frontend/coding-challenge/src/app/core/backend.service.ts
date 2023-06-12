import { Injectable } from '@angular/core';
import { Challenge } from '../shared/models/challenge';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { adminLoginCreds } from '../shared/models/loginCreds';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private backendURL = "http://localhost:8000";

  constructor(private http: HttpClient) { }

  /*---------------------------------------------
  Applicant API Calls
  -----------------------------------------------*/

  public loginWithAppKey(applicationKey: string):Observable<any>{
    return this.http.post(this.backendURL + "/api/application/loginWithKey/" + applicationKey,{});
  }

  public getStatus(applicantToken: string | null): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + applicantToken);
    return this.http.get(this.backendURL + "/api/application/getApplicationStatus/", {'headers': headers});
  }

  public getChallengeApp(applicantToken: string | null): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + applicantToken);
    return this.http.get(this.backendURL + "/api/application/challenges/", {'headers': headers});
  }

  public uploadChallenge(applicationToken: string | null, operatingSystem: string, programmingLang: string, zipFile: File): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + applicationToken)
                                     .set('Content-Disposition', "attatchment; filename=" + zipFile.name)
                                     .set('OperatingSystem', operatingSystem)
                                     .set('ProgrammingLanguage', programmingLang);
    const body = new FormData();
    body.append('dataZip', zipFile);
    console.log(body);
    return this.http.post(this.backendURL + '/api/application/uploadSolution/', body, {'headers': headers});
  }

  public submitChallenge(applicationToken: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + applicationToken);
    return this.http.get(this.backendURL+'/api/application/submitChallenge/', {'headers': headers});
  }

  public startChallenge(applicantToken: string|null): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + applicantToken);
    return this.http.get(this.backendURL + "/api/application/startChallenge/", {'headers': headers});
  }


  /*---------------------------------------------
  Admin API Calls
  -----------------------------------------------*/


  public loginAdmin(username: string, password: string): Observable<any>{
    const body: adminLoginCreds = {username: username, password: password};
    return this.http.post(this.backendURL + "/api/admin/login/", body);
  }

  public changePassword(adminToken: string | null, oldPassword: string, newPassword: string): Observable<any> {
    const body = {"oldPassword": oldPassword, "newPassword": newPassword};
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    return this.http.put(this.backendURL + "/api/admin/changePassword/", body, {'headers': headers});
  }

  public getApplication(adminToken: string|null, applicationId: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    return this.http.get(this.backendURL + "/api/admin/applications/" + applicationId, {'headers': headers});
  }

  public getApplications(adminToken: string, applicationStatus?: number): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    if(typeof applicationStatus === 'undefined'){
      return this.http.get(this.backendURL + "/api/admin/applications/", {'headers': headers});
    }else {
      const params = new HttpParams().set('applicationStatus', applicationStatus);
      return this.http.get(this.backendURL + "/api/admin/applications", {'headers': headers, params:params});
    }
  }

  public editApplication(adminToken: string|null, applicationId: string, applicationStatus?: number, challengeId?: number, extendDays?: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    const body = {};
    if(typeof applicationStatus !== 'undefined'){
      Object.assign(body, {applicationStatus: applicationStatus});
    }
    if(typeof challengeId !== 'undefined'){
      Object.assign(body, {challengeId: challengeId});
    }
    if(typeof extendDays !== 'undefined'){
      Object.assign(body, {expiry: extendDays});
    }
    return this.http.put(this.backendURL + "/api/admin/applications/" + applicationId, body, {'headers': headers});
  }

  public deleteApplication(adminToken: string, applicationId: string): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    return this.http.delete(this.backendURL + "/api/admin/applications/" + applicationId, {'headers': headers});
  }

  public getResult(adminToken: string|null, applicationId: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    return this.http.get(this.backendURL + "/api/admin/applications/results/" + applicationId, {'headers': headers});
  }

  public getChallengeAdm(adminToken: string|null, challengeId: number): Observable<any>{
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    return this.http.get(this.backendURL + "/api/admin/challenges/" + challengeId, {'headers': headers});
  }

  public getChallenges(adminToken: string|null): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    return this.http.get(this.backendURL + "/api/admin/challenges/", {'headers': headers});
  }

  public createChallenge(adminToken: string|null, challenge: Challenge): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    const body = {challengeHeading: challenge.challengeHeading, challengeText: challenge.challengeText};
    return this.http.post(this.backendURL + "/api/admin/challenges/", body, {'headers': headers});
  }

  public editChallenge(adminToken: string|null, challenge: Challenge): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    const body = {challengeHeading: challenge.challengeHeading, challengeText: challenge.challengeText};
    return this.http.put(this.backendURL + "/api/admin/challenges/" + challenge.id, body, {'headers': headers});
  }

  public deleteChallenge(adminToken: string|null, challengeId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', "Token " + adminToken);
    return this.http.delete(this.backendURL + "/api/admin/challenges/" + challengeId, {'headers': headers});
  }

  /*---------------------------------------------
  Time Functions
  -----------------------------------------------*/

  public calcRemainingTime(currentTime: number, expiryTime: number): string {
    if(!Number.isFinite(currentTime) || !Number.isFinite(expiryTime)){
      return "calculation Error"
    }
    expiryTime = Math.floor(expiryTime * 1000);
    let timeDelta = (expiryTime - currentTime) / 1000;
    if(timeDelta > 0){
      const days = Math.floor(timeDelta / (60 * 60 * 24));
      timeDelta -= days * 3600 * 24;
      const hours = Math.floor(timeDelta / 3600);
      timeDelta -= hours * 3600;
      const minutes = Math.floor(timeDelta / 60);
      return days + " days " + hours + " hours " + minutes + " minutes";
    }else {
      return "expired"
    }
  }
}
