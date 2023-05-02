export interface Application {
  applicationId: string;
  applicationKey: string;
  passphrase?: string;
  challengeId: number;
  operatingSystem: string;
  programmingLanguage: string;
  expiryDate: number;
  submissionDate: number;
  githubRepoURL: string;
  status: number;
}
