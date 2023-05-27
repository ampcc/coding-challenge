// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { BackendService } from './backend.service';
// import { TestBed, fakeAsync, flush } from '@angular/core/testing';
// import { Challenge } from '../shared/models/challenge';
// import { HttpHeaders } from '@angular/common/http';



// describe('BackendService', () => {
//   let service: BackendService;
//   let httpController: HttpTestingController;
//   let url = 'https://46022e70-68be-4fbf-a4d1-441852e186b1.mock.pstmn.io';
//   let dummyRes = '';
//   let applicationKey = '62ce30b676d95ef439af5e1d84f9161034c67c4a';
//   let applicationId = 'A0000113'
//   let applicationToken = '62ce30b676d95ef439af5e1d84f9161034c67c4a';

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule]
//     });
//     service = TestBed.inject(BackendService);
//     httpController = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpController.verify();
//   });

//   /********************************
//   Applicant API Calls Tests
//   *********************************/

//   describe('getChallenge', () => {
//     it('check Request Method, Headers and Body', () => {
//       let expHeaders = new HttpHeaders().set('Authorization', "Token " + applicationToken);
//       service.getChallengeApp(applicationToken).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/application/challenges/${applicationId}`);
//       expect(testRequest.request.method).toEqual('GET');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('login with Key', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expBody = { applicationId: "A0000113", applicationKey: "62ce30b676d95ef439af5e1d84f9161034c67c4a" }
//       service.loginWithAppKey(applicationKey).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/application/loginWithKey`);
//       expect(testRequest.request.method).toEqual('POST');
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('getStatus', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + applicationToken);
//       service.getStatus(applicationToken).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/application/getApplicationStatus/${applicationId}`);
//       expect(testRequest.request.method).toEqual('GET');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('startChallenge', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + applicationToken);
//       service.startChallenge(applicationToken).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/application/startChallenge`);
//       expect(testRequest.request.method).toEqual('GET');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('submitChallenge', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + applicationToken);
//       service.submitChallenge(applicationToken).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/application/submitChallenge`);
//       expect(testRequest.request.method).toEqual('GET');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

//   /********************************
//   Admin API Calls Tests
//   *********************************/

//   let adminToken = '62ce30b676d95ef439af5e1d84f9161034c67c4a';

//   describe('loginAdmin', () => {
//     it('check Request Method, Headers and Body', () => {
//       var _username = 'admin';
//       var _password = '4F4ayF$1A!&';
//       var expBody = { username: _username, password: _password };
//       service.loginAdmin(_username, _password).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/login`);
//       expect(testRequest.request.method).toEqual('POST');
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('getApplication', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       service.getApplication(adminToken, applicationId).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
//       expect(testRequest.request.method).toEqual('GET');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('getApplications', () => {
//     it('check Request Method, Headers and Body (Without given Application Status)', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       service.getApplications(adminToken).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications`);
//       expect(testRequest.request.method).toEqual('GET');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });

//     it('check Request Method, Headers and Body (With given Application Status)', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       var applicationStatus = 2;
//       service.getApplications(adminToken, 2).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications?applicationStatus=${applicationStatus}`);
//       expect(testRequest.request.method).toEqual('GET');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('editApplications', () => {
//     it('check Request Method, Headers and Body (Without any optional Parameters)', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       var expBody = { application: {} };
//       service.editApplication(adminToken, applicationId).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
//       expect(testRequest.request.method).toEqual('PUT');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });

//     it('check Request Method, Headers and Body (With given Application Status)', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       var expBody = { application: { applicationStatus: 2 } };
//       service.editApplication(adminToken, applicationId, 2).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
//       expect(testRequest.request.method).toEqual('PUT');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });

//     it('check Request Method, Headers and Body (With given challenge ID)', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       var expBody = { application: { challengeId: 4 } };
//       service.editApplication(adminToken, applicationId, undefined, 4).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
//       expect(testRequest.request.method).toEqual('PUT');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });

//     it('check Request Method, Headers and Body (With given challenge ID)', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       var expBody = { application: { extendDays: 5 } };
//       service.editApplication(adminToken, applicationId, undefined, undefined, 5).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
//       expect(testRequest.request.method).toEqual('PUT');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });

//     it('check Request Method, Headers and Body (With given application Status and challengeId)', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       var expBody = { application: { applicationStatus: 2, challengeId: 4 } };
//       service.editApplication(adminToken, applicationId, 2, 4, undefined).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
//       expect(testRequest.request.method).toEqual('PUT');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });

//     it('check Request Method, Headers and Body (With given application Status and extend Days)', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       var expBody = { application: { applicationStatus: 2, extendDays: 5 } };
//       service.editApplication(adminToken, applicationId, 2, undefined, 5).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
//       expect(testRequest.request.method).toEqual('PUT');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });

//     it('check Request Method, Headers and Body (With all optional Parameters)', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       var expBody = { application: { applicationStatus: 2, challengeId: 4, extendDays: 5 } };
//       service.editApplication(adminToken, applicationId, 2, 4, 5).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
//       expect(testRequest.request.method).toEqual('PUT');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('deleteApplication', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       service.deleteApplication(adminToken, applicationId).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications/${applicationId}`);
//       expect(testRequest.request.method).toEqual('DELETE');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('getResult', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       service.getResult(adminToken, applicationId).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/applications/results/${applicationId}`);
//       expect(testRequest.request.method).toEqual('GET');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('getChallenge', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       service.getChallengeAdm(adminToken, 2).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/challenges/2`);
//       expect(testRequest.request.method).toEqual('GET');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('getChallenges', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       service.getChallenges(adminToken).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/challenges`);
//       expect(testRequest.request.method).toEqual('GET');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('createChallenge', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       var expBody = { challenge: { challengeHeading: "Testheading", challengeText: "Testtext" } };
//       var challenge: Challenge = { id: 0, challengeHeading: "Testheading", challengeText: "Testtext" };
//       service.createChallenge(adminToken, challenge).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/challenges`);
//       expect(testRequest.request.method).toEqual('POST');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('editChallenge', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       var expBody = { challenge: { challengeHeading: "HeadingTest", challengeText: "Texttest" } };
//       var challenge: Challenge = { id: 0, challengeHeading: "HeadingTest", challengeText: "Texttest" };
//       service.editChallenge(adminToken, challenge).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/challenges/0`);
//       expect(testRequest.request.method).toEqual('PUT');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       expect(testRequest.request.body).toEqual(expBody);
//       testRequest.flush(dummyRes);
//     });
//   });

//   describe('deleteChallenge', () => {
//     it('check Request Method, Headers and Body', () => {
//       var expHeaders = new HttpHeaders().set('Authorization', "Token " + adminToken);
//       service.deleteChallenge(adminToken, 2).subscribe((res) => {
//         expect(res).toEqual(dummyRes);
//       });
//       const testRequest = httpController.expectOne(`${url}/api/admin/challenges/2`);
//       expect(testRequest.request.method).toEqual('DELETE');
//       expect(testRequest.request.headers).toEqual(expHeaders);
//       testRequest.flush(dummyRes);
//     });
//   });

// });
