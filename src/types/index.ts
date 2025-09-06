export interface WillFormData {
  fullName: string;
  address: string;
  dateOfBirth: string;
  executionDate: string;
  beneficiaries: string;
  executor: string;
  executorAddress: string;
  executorPhone: string;
  specialInstructions: string;
  witnessRequired: string;
}

export interface PoAFormData {
  principalName: string;
  principalAddress: string;
  principalPhone: string;
  principalDOB: string;
  attorneyName: string;
  attorneyAddress: string;
  attorneyPhone: string;
  scopeOfAuthority: string;
  effectiveDate: string;
  duration: string;
}

export type DocumentType = 'will' | 'poa';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'date' | 'textarea' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
}