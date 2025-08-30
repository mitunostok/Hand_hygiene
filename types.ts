export enum Indication {
  BEF_PAT = 'bef-pat',
  BEF_ASEPT = 'bef-asept',
  AFT_BF = 'aft-b.f.',
  AFT_PAT = 'aft-pat.',
  AFT_P_SURR = 'aft.p.surr.',
}

export enum HHAction {
  HR = 'HR',
  HW = 'HW',
  MISSED = 'missed',
  GLOVES = 'gloves',
}

export enum ProfessionalCategory {
  NURSE_MIDWIFE = '1',
  AUXILIARY = '2',
  MEDICAL_DOCTOR = '3',
  OTHER_HEALTH_CARE_WORKER = '4',
  EMPTY = '',
}

export interface Opportunity {
  id: number;
  indications: Indication[];
  action: HHAction | null;
}

export interface ProfessionalColumn {
  profCategory: ProfessionalCategory;
  opportunities: Opportunity[];
}

export interface User {
  email: string;
  passwordHash: string; // In a real app, never store plain text passwords
  name: string; // Observer's name
  facility: string;
  country: string;
  city: string;
}

export interface AuditSession {
  id: string; // unique id for the session
  facility: string;
  service: string;
  ward: string;
  department: string;
  country: string;
  city: string;
  periodNumber: string;
  sessionNumber: string;
  observer: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionDuration: number; // in minutes
  columns: ProfessionalColumn[];
  observerEmail: string; // Link session to a user
}
