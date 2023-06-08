import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BackendService } from './backend.service';
import { TestBed, fakeAsync, flush } from '@angular/core/testing';
import { Challenge } from '../shared/models/challenge';
import { HttpHeaders } from '@angular/common/http';




describe('BackendService', () => {
  let service: BackendService;
  let httpController: HttpTestingController;
  let url = 'http://localhost:8000';
  let dummyRes = '';
  let applicationKey = '62ce30b676d95ef439af5e1d84f9161034c67c4a';
  let applicationId = 'A0000113'
  let applicationToken = '62ce30b676d95ef439af5e1d84f9161034c67c4a';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BackendService);
    httpController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  /********************************
  Applicant API Calls Tests
  *********************************/

  describe('getChallenge', () => {
    it('check Request Method, Headers and Body', () => {
      let expHeaders = new HttpHeaders().set('Authorization', "Token " + applicationToken);
      service.getChallengeApp(applicationToken).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/application/challenges/`);
      expect(testRequest.request.method).toEqual('GET');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  describe('login with Key', () => {
    it('check Request Method, Headers and Body', () => {
      service.loginWithAppKey(applicationKey).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/application/loginWithKey/${applicationKey}`);
      expect(testRequest.request.method).toEqual('POST');
      testRequest.flush(dummyRes);
    });
  });

  describe('getStatus', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + applicationToken);
      service.getStatus(applicationToken).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/application/getApplicationStatus/`);
      expect(testRequest.request.method).toEqual('GET');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  describe('startChallenge', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + applicationToken);
      service.startChallenge(applicationToken).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/application/startChallenge/`);
      expect(testRequest.request.method).toEqual('GET');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  describe('uploadChallenge', () => {
    it('check Request Method, Headers and Body', () => {
      var oS = "MACOS";
      var pL = "Python";
      const testFile = new File(["test123"], "test.zip");
      const expHeaders = new HttpHeaders().set('Authorization', "Token " + applicationToken)
                                     .set('Content-Disposition', `attatchment; filename=${testFile.name}`)
                                     .set('OperatingSystem', oS)
                                     .set('ProgrammingLanguage', pL);
      const expBody  = new FormData();
      expBody.append('dataZip', "test123");
      service.uploadChallenge(applicationToken, oS, pL, testFile).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/application/uploadSolution/`);
      expect(testRequest.request.method).toEqual('POST');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });
  });

  describe('submitChallenge', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + applicationToken);
      service.submitChallenge(applicationToken).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/application/submitChallenge/`);
      expect(testRequest.request.method).toEqual('GET');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  /********************************
  Admin API Calls Tests
  *********************************/

  let adminToken = '62ce30b676d95ef439af5e1d84f9161034c67c4a';

  describe('loginAdmin', () => {
    it('check Request Method, Headers and Body', () => {
      var _username = 'admin';
      var _password = '4F4ayF$1A!&';
      var expBody = { username: _username, password: _password };
      service.loginAdmin(_username, _password).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/login/`);
      expect(testRequest.request.method).toEqual('POST');
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });
  });

  describe('getApplication', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      service.getApplication(adminToken, applicationId).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
      expect(testRequest.request.method).toEqual('GET');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  describe('changePassword', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var oldPw = "Test123";
      var newPw = "Test321";
      const expBody = {oldPassword: oldPw, newPassword: newPw};
      service.changePassword(adminToken, oldPw, newPw).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/changePassword/`);
      expect(testRequest.request.method).toEqual('PUT');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });
  });

  describe('getApplications', () => {
    it('check Request Method, Headers and Body (Without given Application Status)', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      service.getApplications(adminToken).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/`);
      expect(testRequest.request.method).toEqual('GET');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });

    it('check Request Method, Headers and Body (With given Application Status)', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var applicationStatus = 2;
      service.getApplications(adminToken, 2).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications?applicationStatus=${applicationStatus}`);
      expect(testRequest.request.method).toEqual('GET');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  describe('editApplications', () => {
    it('check Request Method, Headers and Body (Without any optional Parameters)', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var expBody = {};
      service.editApplication(adminToken, applicationId).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
      expect(testRequest.request.method).toEqual('PUT');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });

    it('check Request Method, Headers and Body (With given Application Status)', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var expBody = {applicationStatus: 2 };
      service.editApplication(adminToken, applicationId, 2).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
      expect(testRequest.request.method).toEqual('PUT');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });

    it('check Request Method, Headers and Body (With given challenge ID)', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var expBody = {challengeId: 4 };
      service.editApplication(adminToken, applicationId, undefined, 4).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
      expect(testRequest.request.method).toEqual('PUT');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });

    it('check Request Method, Headers and Body (With given challenge ID)', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var expBody = {expiry: 5 };
      service.editApplication(adminToken, applicationId, undefined, undefined, 5).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
      expect(testRequest.request.method).toEqual('PUT');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });

    it('check Request Method, Headers and Body (With given application Status and challengeId)', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var expBody = {applicationStatus: 2, challengeId: 4 };
      service.editApplication(adminToken, applicationId, 2, 4, undefined).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
      expect(testRequest.request.method).toEqual('PUT');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });

    it('check Request Method, Headers and Body (With given application Status and extend Days)', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var expBody = {applicationStatus: 2, expiry: 5 };
      service.editApplication(adminToken, applicationId, 2, undefined, 5).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
      expect(testRequest.request.method).toEqual('PUT');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });

    it('check Request Method, Headers and Body (With all optional Parameters)', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var expBody = {applicationStatus: 2, challengeId: 4, expiry: 5 };
      service.editApplication(adminToken, applicationId, 2, 4, 5).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
      expect(testRequest.request.method).toEqual('PUT');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });
  });

  describe('deleteApplication', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      service.deleteApplication(adminToken, applicationId).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
      expect(testRequest.request.method).toEqual('DELETE');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  describe('getResult', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      service.getResult(adminToken, applicationId).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/applications/results/${applicationId}`);
      expect(testRequest.request.method).toEqual('GET');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  describe('getChallenge', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var challId = 2;
      service.getChallengeAdm(adminToken, challId).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/challenges/${challId}`);
      expect(testRequest.request.method).toEqual('GET');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  describe('getChallenges', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      service.getChallenges(adminToken).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/challenges/`);
      expect(testRequest.request.method).toEqual('GET');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  describe('createChallenge', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var expBody = { challengeHeading: "Testheading", challengeText: "Testtext" };
      var challenge: Challenge = { id: 0, challengeHeading: "Testheading", challengeText: "Testtext" };
      service.createChallenge(adminToken, challenge).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/challenges/`);
      expect(testRequest.request.method).toEqual('POST');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });
  });

  describe('editChallenge', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      var expBody = {challengeHeading: "HeadingTest", challengeText: "Texttest" };
      var challenge: Challenge = { id: 0, challengeHeading: "HeadingTest", challengeText: "Texttest" };
      service.editChallenge(adminToken, challenge).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/challenges/0`);
      expect(testRequest.request.method).toEqual('PUT');
      expect(testRequest.request.headers).toEqual(expHeaders);
      expect(testRequest.request.body).toEqual(expBody);
      testRequest.flush(dummyRes);
    });
  });

  describe('deleteChallenge', () => {
    it('check Request Method, Headers and Body', () => {
      var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
      service.deleteChallenge(adminToken, 2).subscribe((res) => {
        expect(res).toEqual(dummyRes);
      });
      const testRequest = httpController.expectOne(`${url}/api/admin/challenges/2`);
      expect(testRequest.request.method).toEqual('DELETE');
      expect(testRequest.request.headers).toEqual(expHeaders);
      testRequest.flush(dummyRes);
    });
  });

  /********************************
  Time Functions Tests
  *********************************/

  describe('calcRemainingTime', () => {
    it('currentTime < expiryTime', () => {
      var curTime = new Date().getTime();
      var expiryTime = curTime / 1000;
      curTime = curTime - (60 * 60 * 24 * 1000);
      var expectedRes = "1 days 0 hours 0 minutes";
      var result = service.calcRemainingTime(curTime, expiryTime);
      expect(result).toEqual(expectedRes);
    });

    it('currentTime > expiryTime', () => {
      var curTime = new Date().getTime();
      var expiryTime = curTime / 1000;
      curTime = curTime + (60 * 60 * 24 * 1000);
      var expectedRes = "expired";
      var result = service.calcRemainingTime(curTime, expiryTime);
      expect(result).toEqual(expectedRes);
    });

    it('currentTime == expiryTime', () => {
      var curTime = new Date().getTime();
      var expiryTime = curTime / 1000;
      var expectedRes = "expired";
      var result = service.calcRemainingTime(curTime, expiryTime);
      expect(result).toEqual(expectedRes);
    });
  });

});
