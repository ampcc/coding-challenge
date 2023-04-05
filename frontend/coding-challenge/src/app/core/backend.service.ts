import { Injectable } from '@angular/core';
import { Admin } from '../shared/models/admin';
import { Applicant } from '../shared/models/applicant';
import { Challenge } from '../shared/models/challange';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor() { }
  public editApplicant(admin: Admin, applicant: Applicant): boolean {
    return true;
  }

  public getApplicants(admin: Admin): Applicant[] {
    var a : Applicant  = {
      applicantId: 0,
      applicantKey: "",
      challengeId: 0,
      operatingSystem: "",
      programmingLanguage: "",
      expiryDate: "",
      submissionDate: "",
      githubRepoURL: "",
      status: 0
    };
    let res = [a];
    return res;
  }

  public getApplicant(admin : Admin, applicantId: number): Applicant {
    var a : Applicant  = {
      applicantId: 0,
      applicantKey: "",
      challengeId: 0,
      operatingSystem: "",
      programmingLanguage: "",
      expiryDate: "",
      submissionDate: "",
      githubRepoURL: "",
      status: 0
    };
    return a;
  }

  public login(username: string, passwordHash:string): Admin {
    return {adminId: 0, adminKey: "", passwordHash: "", username: ""};
  }

  public getStatus(applicantKey: string): string[]{
    return ["", ""];
  }

  public getChallenge(applicantKey: string): Challenge{
    return {challengeId:0,challengeHeading: "",challengeText:""};
  }

  public uploadChallenge(applicantKey: string, oS: string, pL: string): boolean{
    return true;
  }

  public startChallenge(applicantKey: string): boolean {
    return true;
  }

  public createChallenge(admin: Admin, challengeHead: string, challengeText: string):boolean{
    return true;
  }

  public changePassword(admin: Admin, oldPwHash: string, newPwHash: string): boolean{
    return true;
  }
}
