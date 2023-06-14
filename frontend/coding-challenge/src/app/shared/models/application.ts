export interface Application {
  applicationId: string;
  applicationKey: string;
  passphrase?: string;
  challengeId: number;
  operatingSystem: string;
  programmingLanguage: string;
  expiry: number;
  submission: number;
  githubRepo: string;
  status: number;
}
