import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChallengeComponent } from './challenge.component';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { BackendService } from 'src/app/core/backend.service';
import { Router } from '@angular/router';
import { DebugElement } from '@angular/core';
import { Observable, Subscriber, TeardownLogic, throwError } from 'rxjs';

describe('ChallengeComponent', () => {
  let component: ChallengeComponent;
  let fixture: ComponentFixture<ChallengeComponent>;
  let backend: BackendService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        HttpClient,
        MatDialog
      ],
      imports: [
        ChallengeComponent,
        HttpClientModule,
        MatDialogModule
      ]
    }).compileComponents();

    backend = TestBed.inject(BackendService);
    router = TestBed.inject(Router);

    fixture = TestBed.createComponent(ChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('click on intro tab', () => {
    const challengeTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabChallenge')).nativeElement;
    const uploadTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabUpload')).nativeElement;
    const introTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabIntro')).nativeElement;
    const challengeTabStyle: CSSStyleDeclaration = challengeTabElement.style;
    const uploadTabStyle: CSSStyleDeclaration = uploadTabElement.style;
    const introTabStyle: CSSStyleDeclaration = introTabElement.style;

    // Initial state
    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeFalse();

    introTabElement.click();

    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeFalse();
    expect(challengeTabStyle.borderBottom).toBe('none');
    expect(uploadTabStyle.borderBottom).toBe('none');
    expect(introTabStyle.borderBottomStyle).toBe('solid');
    expect(introTabStyle.borderBottomWidth).toBe('2px');
    expect(introTabStyle.borderBottomColor).toBe('black');
  });


  it('click on challenge tab', () => {
    const challengeTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabChallenge')).nativeElement;
    const uploadTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabUpload')).nativeElement;
    const introTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabIntro')).nativeElement;
    const challengeTabStyle: CSSStyleDeclaration = challengeTabElement.style;
    const uploadTabStyle: CSSStyleDeclaration = uploadTabElement.style;
    const introTabStyle: CSSStyleDeclaration = introTabElement.style;

    // Initial state
    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeFalse();

    challengeTabElement.click();

    expect(component.hideContentChallenge).toBeFalse();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeTrue();
    expect(challengeTabStyle.borderBottomStyle).toBe('solid');
    expect(challengeTabStyle.borderBottomWidth).toBe('2px');
    expect(challengeTabStyle.borderBottomColor).toBe('black');
    expect(uploadTabStyle.borderBottom).toBe('none');
    expect(introTabStyle.borderBottom).toBe('none');
  });


  it('click on upload tab', () => {
    const challengeTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabChallenge')).nativeElement;
    const uploadTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabUpload')).nativeElement;
    const introTabElement: HTMLElement = fixture.debugElement.query(By.css('#tabIntro')).nativeElement;
    const challengeTabStyle: CSSStyleDeclaration = challengeTabElement.style;
    const uploadTabStyle: CSSStyleDeclaration = uploadTabElement.style;
    const introTabStyle: CSSStyleDeclaration = introTabElement.style;

    // Initial state
    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeTrue();
    expect(component.hideContentIntro).toBeFalse();

    uploadTabElement.click();

    expect(component.hideContentChallenge).toBeTrue();
    expect(component.hideContentUpload).toBeFalse();
    expect(component.hideContentIntro).toBeTrue();
    expect(challengeTabStyle.borderBottomStyle).toBe('none');
    expect(uploadTabStyle.borderBottomStyle).toBe('solid');
    expect(uploadTabStyle.borderBottomWidth).toBe('2px');
    expect(uploadTabStyle.borderBottomColor).toBe('black');
    expect(introTabStyle.borderBottomStyle).toBe('none');
  });


  it('display time correctly', () => {
    const timeParagraph = fixture.debugElement.query(By.css('#time')).nativeElement;
    const initialRemainingTimeHTML = "<b>Remaining Time:</b> No data available!"
    expect(timeParagraph.innerHTML).toBe(initialRemainingTimeHTML);

    /**
     * Time only gets calculated inside ngOnInit
     * --> Difficult to test, so only the correct display of the string is tested
     */

    component.time = 4 + " days " + 12 + " hours " + 36 + " minutes";
    fixture.detectChanges();

    const updatedRemainingTimeHTML = `<b>Remaining Time:</b> ${component.time}`;
    expect(timeParagraph.innerHTML).toBe(updatedRemainingTimeHTML);
  });


  it('display challenge text correctly', () => {
    const challengeTextDiv = fixture.debugElement.query(By.css('#textChallenge')).nativeElement;
    const initialChallengeTextHTML = "<b>No data available!</b><br><br> No data available! "
    expect(challengeTextDiv.innerHTML).toBe(initialChallengeTextHTML);

    component.challengeText = "I am another text for testing purposes";
    component.heading = "I am a text for testing purposes";
    fixture.detectChanges();

    const updatedChallengeTextHTML = `<b>${component.heading}</b><br><br> ${component.challengeText} `
    expect(challengeTextDiv.innerHTML).toBe(updatedChallengeTextHTML);
  });


  it('store selected "programming language" correctly', () => {
    const programmingLanguageSelect: HTMLSelectElement = fixture.debugElement.query(By.css('#selectProgLang')).nativeElement;
    const programmingLanguageSelectOptions: HTMLOptionsCollection = programmingLanguageSelect.options;

    let currentOptionNode: HTMLOptionElement = programmingLanguageSelectOptions[0];
    expect(currentOptionNode.disabled).toBeTrue();
    expect(currentOptionNode.defaultSelected).toBeTrue();
    expect(currentOptionNode.hidden).toBeTrue();
    expect(component.pl).toBe('default');

    const programmingLanguages = ['java', 'c', 'python', 'rust'];

    // Leave out the last option "other" --> own test
    for (let i = 1; i < programmingLanguageSelectOptions.length - 1; i++) {
      currentOptionNode = programmingLanguageSelectOptions[i];
      expect(currentOptionNode.disabled).toBeFalse();
      expect(currentOptionNode.defaultSelected).toBeFalse();
      expect(currentOptionNode.value).toBe(programmingLanguages[i - 1]);
      expect(currentOptionNode.selected).toBeFalse();

      programmingLanguageSelect.value = currentOptionNode.value;
      programmingLanguageSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(currentOptionNode.selected).toBeTrue();
      expect(component.pl).toBe(programmingLanguages[i - 1]);
    }
  });


  it('enable input for "other" programming language', () => {
    const programmingLanguageSelect: HTMLSelectElement = fixture.debugElement.query(By.css('#selectProgLang')).nativeElement;
    const programmingLanguageSelectOptions: HTMLOptionsCollection = programmingLanguageSelect.options;

    const currentOptionNode: HTMLOptionElement = programmingLanguageSelectOptions[programmingLanguageSelectOptions.length - 1];
    expect(currentOptionNode.value).toBe('other');
    expect(component.hideProgLang).toBeTrue();

    programmingLanguageSelect.value = currentOptionNode.value;
    programmingLanguageSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.pl).toBe('other');
    expect(component.hideProgLang).toBeFalse();
  });


  it('store selected operating system correctly', () => {
    const osSelect: HTMLSelectElement = fixture.debugElement.query(By.css('#selectOpSys')).nativeElement;
    const osSelectOptions: HTMLOptionsCollection = osSelect.options;

    let currentOptionNode: HTMLOptionElement = osSelectOptions[0];
    expect(currentOptionNode.disabled).toBeTrue();
    expect(currentOptionNode.defaultSelected).toBeTrue();
    expect(currentOptionNode.hidden).toBeTrue();
    expect(component.os).toBe('default');

    const operatingSystems = ['linux', 'windows', 'macos'];

    //Leave out the last option "other" --> own test
    for (let i = 1; i < osSelectOptions.length - 1; i++) {
      currentOptionNode = osSelectOptions[i];
      expect(currentOptionNode.disabled).toBeFalse();
      expect(currentOptionNode.defaultSelected).toBeFalse();
      expect(currentOptionNode.value).toBe(operatingSystems[i - 1]);
      expect(currentOptionNode.selected).toBeFalse();

      osSelect.value = currentOptionNode.value;
      osSelect.dispatchEvent(new Event('change'));
      fixture.detectChanges();

      expect(currentOptionNode.selected).toBeTrue();
      expect(component.os).toBe(operatingSystems[i - 1]);
    }
  });


  it('enable input for "other" operating system', () => {
    const osSelect: HTMLSelectElement = fixture.debugElement.query(By.css('#selectOpSys')).nativeElement;
    const osSelectOptions: HTMLOptionsCollection = osSelect.options;

    const currentOptionNode: HTMLOptionElement = osSelectOptions[osSelectOptions.length - 1];
    expect(currentOptionNode.value).toBe('other');
    expect(component.hideOpSys).toBeTrue();

    osSelect.value = currentOptionNode.value;
    osSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.os).toBe('other');
    expect(component.hideOpSys).toBeFalse();
  });


  it('display error message when file is already uploaded', () => {
    component.fileArray.push(new File([''], 'first_test.zip', { type: 'application/zip' }));

    const uploadedFile = new DataTransfer();
    uploadedFile.items.add(new File([''], 'test.zip', { type: 'application/zip' }));

    const fileInput: HTMLInputElement = fixture.debugElement.query(By.css('#fileHandler')).nativeElement;
    fileInput.files = uploadedFile.files;
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const fileUploadError: HTMLElement = fixture.debugElement.query(By.css('.msgFileUpload')).nativeElement;
    const errorMsg = 'You already uploaded a file. Please delete that file before uploading another one.';
    const dragAndDropBoy: HTMLElement = fixture.debugElement.query(By.css('#DragnDropBlock')).nativeElement;

    expect(component.hideMsgFileUpload).toBeFalse();
    expect(component.fileArray.length).toBe(1);
    expect(component.msgFileUpload).toBe(errorMsg);
    expect(fileUploadError.innerText).toBe(errorMsg);
    expect(dragAndDropBoy.style.borderColor).toBe('red');
  });


  it('display error message when file is too big', () => {
    const uploadedFile = new DataTransfer();
    const data: ArrayBuffer = new ArrayBuffer(52428899);

    uploadedFile.items.add(new File([data], 'test.zip', { type: 'application/zip' }));

    const fileInput: HTMLInputElement = fixture.debugElement.query(By.css('#fileHandler')).nativeElement;
    fileInput.files = uploadedFile.files;
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const fileUploadError: HTMLElement = fixture.debugElement.query(By.css('.msgFileUpload')).nativeElement;
    const errorMsg = 'The file ' + uploadedFile.files[0].name + ' is too big';
    const dragAndDropBoy: HTMLElement = fixture.debugElement.query(By.css('#DragnDropBlock')).nativeElement;

    expect(component.hideMsgFileUpload).toBeFalse();
    expect(component.fileArray.length).toBe(0);
    expect(component.msgFileUpload).toBe(errorMsg);
    expect(fileUploadError.innerText).toBe(errorMsg);
    expect(dragAndDropBoy.style.borderColor).toBe('red');
  });


  it('display error message when file has the wrong filetype', () => {
    const uploadedFile = new DataTransfer();
    uploadedFile.items.add(new File([''], 'test.tar', { type: 'application/tar' }));

    const fileInput: HTMLInputElement = fixture.debugElement.query(By.css('#fileHandler')).nativeElement;
    fileInput.files = uploadedFile.files;
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const fileUploadError: HTMLElement = fixture.debugElement.query(By.css('.msgFileUpload')).nativeElement;
    const errorMsg = 'The file ' + uploadedFile.files[0].name + ' has the wrong filetype';
    const dragAndDropBoy: HTMLElement = fixture.debugElement.query(By.css('#DragnDropBlock')).nativeElement;

    expect(component.hideMsgFileUpload).toBeFalse();
    expect(component.fileArray.length).toBe(0);
    expect(component.msgFileUpload).toBe(errorMsg);
    expect(fileUploadError.innerText).toBe(errorMsg);
    expect(dragAndDropBoy.style.borderColor).toBe('red');
  });


  it('display error message when file has wrong filetype and is too big', () => {
    const uploadedFile = new DataTransfer();
    const data: ArrayBuffer = new ArrayBuffer(52428899);

    uploadedFile.items.add(new File([data], 'test.tar', { type: 'application/tar' }));

    const fileInput: HTMLInputElement = fixture.debugElement.query(By.css('#fileHandler')).nativeElement;
    fileInput.files = uploadedFile.files;
    fileInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    const fileUploadError: HTMLElement = fixture.debugElement.query(By.css('.msgFileUpload')).nativeElement;
    const errorMsg = 'The file ' + uploadedFile.files[0].name + ' has the wrong filetype and is too big';
    const dragAndDropBoy: HTMLElement = fixture.debugElement.query(By.css('#DragnDropBlock')).nativeElement;

    expect(component.hideMsgFileUpload).toBeFalse();
    expect(component.fileArray.length).toBe(0);
    expect(component.msgFileUpload).toBe(errorMsg);
    expect(fileUploadError.innerText).toBe(errorMsg);
    expect(dragAndDropBoy.style.borderColor).toBe('red');
  });


  it('display uploaded file correctly', () => {
    let uploadedHTMLFilesList: DebugElement = fixture.debugElement.query(By.css('.filesList'));
    // One additional childNode exists because of ngFor
    expect(uploadedHTMLFilesList.nativeElement.childNodes.length).toBe(1);

    const uploadedFile = new DataTransfer();
    const data: ArrayBuffer = new ArrayBuffer(1048576);
    uploadedFile.items.add(new File([data], 'test.zip', { type: 'application/zip' }));

    const fileInput: HTMLInputElement = fixture.debugElement.query(By.css('#fileHandler')).nativeElement;
    fileInput.files = uploadedFile.files;
    component.fileArray.push(uploadedFile.files[0]);
    fixture.detectChanges();

    uploadedHTMLFilesList = fixture.debugElement.query(By.css('.filesList'));

    expect(uploadedHTMLFilesList.nativeElement.childNodes.length).toBe(2);
    expect(uploadedHTMLFilesList.query(By.css('.filename')).nativeElement.innerText).toBe(' test.zip ');
    expect(uploadedHTMLFilesList.query(By.css('.size')).nativeElement.innerText).toBe(' 1.00 MB ');

  });


  it('delete uploaded file correctly', () => {
    let uploadedHTMLFilesList: DebugElement = fixture.debugElement.query(By.css('.filesList'));

    const uploadedFile = new DataTransfer();
    const data: ArrayBuffer = new ArrayBuffer(1048576);
    uploadedFile.items.add(new File([data], 'test.zip', { type: 'application/zip' }));

    let fileInput: HTMLInputElement = fixture.debugElement.query(By.css('#fileHandler')).nativeElement;
    fileInput.files = uploadedFile.files;
    component.fileArray.push(uploadedFile.files[0]);
    fixture.detectChanges();

    expect(uploadedHTMLFilesList.childNodes.length).toBe(2);

    const deleteFileIcon: HTMLElement = fixture.debugElement.query(By.css('.picDelete')).nativeElement;
    expect(deleteFileIcon).toBeTruthy();

    deleteFileIcon.click();
    fixture.detectChanges();

    fileInput = fixture.debugElement.query(By.css('#fileHandler')).nativeElement;
    uploadedHTMLFilesList = fixture.debugElement.query(By.css('.filesList'))
    expect(component.fileArray.length).toBe(0);
    expect(fileInput.files?.length).toBe(0);
    expect(uploadedHTMLFilesList.childNodes.length).toBe(1);
  });


  it('display correct error messages when every data is left out on submit', () => {
    const submitButton: HTMLElement = fixture.debugElement.query(By.css('button')).nativeElement;
    submitButton.click();
    fixture.detectChanges();

    const selectProgLang: HTMLSelectElement = fixture.debugElement.query(By.css('#selectProgLang')).nativeElement;
    const selectOpSys: HTMLSelectElement = fixture.debugElement.query(By.css('#selectOpSys')).nativeElement;
    const fileDragnDrop: HTMLInputElement = fixture.debugElement.query(By.css('#DragnDropBlock')).nativeElement;

    expect(selectProgLang.style.borderColor).toBe('red');
    expect(component.hideMsgProgLang).toBeFalse();
    expect(component.msgProgLang).toBe('Programming language required');

    expect(selectOpSys.style.borderColor).toBe('red');
    expect(component.hideMsgOpSys).toBeFalse();
    expect(component.msgOpSys).toBe('Operating system required');

    expect(fileDragnDrop.style.borderColor).toBe('red');
    expect(component.hideMsgFileUpload).toBeFalse();
    expect(component.msgFileUpload).toBe('No files for upload selected');
  });


  it('display correct error messages when programmin language and OS is selected as "other" but not specified on submit', () => {
    component.pl = 'other';
    component.os = 'other';

    const submitButton: HTMLElement = fixture.debugElement.query(By.css('button')).nativeElement;
    submitButton.click();
    fixture.detectChanges();

    const selectProgLang: HTMLSelectElement = fixture.debugElement.query(By.css('#selectProgLang')).nativeElement;
    const selectOpSys: HTMLSelectElement = fixture.debugElement.query(By.css('#selectOpSys')).nativeElement;

    const inputOtherProgLang: HTMLInputElement = fixture.debugElement.query(By.css('#otherProgLang')).nativeElement;
    const inputOtherOpSys: HTMLInputElement = fixture.debugElement.query(By.css('#otherOpSys')).nativeElement;

    expect(selectProgLang.style.borderColor).toBe('red');
    expect(component.hideMsgProgLang).toBeFalse();
    expect(component.msgProgLang).toBe('Programming language required');
    expect(inputOtherProgLang.style.borderColor).toBe('red');

    expect(selectOpSys.style.borderColor).toBe('red');
    expect(component.hideMsgOpSys).toBeFalse();
    expect(component.msgOpSys).toBe('Operating system required');
    expect(inputOtherOpSys.style.borderColor).toBe('red');
  });


  it('change html correctly before the response of the backend during submit arrives', () => {
    component.pl = 'java';
    component.os = 'linux';
    component.fileArray.push(new File([''], 'test.zip', { type: 'application/zip' }));

    const submitButton: HTMLElement = fixture.debugElement.query(By.css('button')).nativeElement;
    submitButton.click();

    fixture.detectChanges();

    expect(component.hideUpload).toBeTrue();
    expect(component.hideSuccess).toBeTrue();
    expect(component.hideLoading).toBeFalse();
  });


  it('change html correctly after successful submit', () => {
    component.pl = 'java';
    component.os = 'linux';
    component.fileArray.push(new File([''], 'test.zip', { type: 'application/zip' }));

    function successful(this: Observable<any>, subscriber: Subscriber<any>): TeardownLogic {
      subscriber.next('successful');
    }

    spyOn(backend, 'uploadChallenge').and.returnValue(new Observable<any>(successful));

    const submitButton: HTMLElement = fixture.debugElement.query(By.css('button')).nativeElement;
    submitButton.click();

    fixture.detectChanges();

    expect(component.hideUpload).toBeTrue();
    expect(component.hideSuccess).toBeFalse();
    expect(component.hideLoading).toBeTrue();
  });


  it('correctly redirect after error response from backend during submit', () => {
    component.pl = 'java';
    component.os = 'linux';
    component.fileArray.push(new File([''], 'test.zip', { type: 'application/zip' }));

    let err = new HttpErrorResponse({
      error: 'error for testing',
      headers: undefined,
      status: 403,
      statusText: undefined,
      url: undefined
    });

    spyOn(backend, 'uploadChallenge').and.returnValue(throwError(() => err));
    const routerSpy = spyOn(router, 'navigateByUrl');
    const submitButton: HTMLElement = fixture.debugElement.query(By.css('button')).nativeElement;

    submitButton.click();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith('/forbidden');

    err = new HttpErrorResponse({
      error: 'error for testing',
      headers: undefined,
      status: 404,
      statusText: undefined,
      url: undefined
    });

    submitButton.click();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith('/notFound');

    err = new HttpErrorResponse({
      error: 'error for testing',
      headers: undefined,
      status: 500,
      statusText: undefined,
      url: undefined
    });

    submitButton.click();
    fixture.detectChanges();
    expect(routerSpy).toHaveBeenCalledWith('/internalError');
  });


  it('display dialog on question mark click', () => {
    const questionMark: HTMLElement = fixture.debugElement.query(By.css('.questionCircle')).nativeElement;
    questionMark.click();

    fixture.detectChanges();

    const dialog = document.body.querySelector<HTMLInputElement>('.dialog_container');
    expect(dialog).toBeTruthy();
  });


  it('format bytes correctly', () => {
    let formattedBytes: string = component.formatBytes(516);
    expect(formattedBytes).toBe('516');

    formattedBytes = component.formatBytes(1048);
    expect(formattedBytes).toBe('1.02 KB');

    formattedBytes = component.formatBytes(2049576);
    expect(formattedBytes).toBe('1.95 MB');

    formattedBytes = component.formatBytes(1993741824);
    expect(formattedBytes).toBe('1.86 GB');
  });
});
