export interface Applicant {
  applicantId: number;
  applicantKey: string;
  passphrase?: string;
  challengeId: number;
  operatingSystem: string;
  programmingLanguage: string;
  expiryDate: string;
  submissionDate: string;
  githubRepoURL: string;
  status: number;
}
