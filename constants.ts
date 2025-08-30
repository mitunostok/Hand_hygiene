import { ProfessionalCategory, Indication, HHAction, ProfessionalColumn, Opportunity } from './types';

export const PROFESSIONAL_CATEGORY_LABELS: Record<ProfessionalCategory, string> = {
  [ProfessionalCategory.NURSE_MIDWIFE]: '1. Nurse / Midwife',
  [ProfessionalCategory.AUXILIARY]: '2. Auxiliary',
  [ProfessionalCategory.MEDICAL_DOCTOR]: '3. Medical Doctor',
  [ProfessionalCategory.OTHER_HEALTH_CARE_WORKER]: '4. Other Health-Care Worker',
  [ProfessionalCategory.EMPTY]: 'Select Category',
};

export const INDICATION_LABELS: Record<Indication, string> = {
  [Indication.BEF_PAT]: 'Before touching patient',
  [Indication.BEF_ASEPT]: 'Before clean/aseptic procedure',
  [Indication.AFT_BF]: 'After body fluid exposure risk',
  [Indication.AFT_PAT]: 'After touching patient',
  [Indication.AFT_P_SURR]: 'After touching patient surroundings',
};

export const HHACTION_LABELS: Record<HHAction, string> = {
  [HHAction.HR]: 'Hand Rub',
  [HHAction.HW]: 'Hand Wash',
  [HHAction.MISSED]: 'Missed',
  [HHAction.GLOVES]: 'Gloves (Action Missed)',
};

export const DEPARTMENTS = [
  'General Medicine', 'Surgery', 'Pediatrics', 'Obstetrics & Gynaecology', 
  'Emergency', 'Intensive Care Unit (ICU)', 'Oncology', 'Cardiology', 'Other'
];

export const WARDS = [
  'Ward A', 'Ward B', 'Ward C', 'Surgical Ward', 'Medical Ward', 'Pediatric Ward', 'Other'
];


const createInitialOpportunities = (): Opportunity[] =>
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    indications: [],
    action: null,
  }));

export const createInitialColumn = (): ProfessionalColumn => ({
  profCategory: ProfessionalCategory.EMPTY,
  opportunities: createInitialOpportunities(),
});

export const INITIAL_COLUMNS: ProfessionalColumn[] = Array.from({ length: 4 }, createInitialColumn);
