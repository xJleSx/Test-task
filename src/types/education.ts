export interface EducationDocument {
  name: string;
  type: string;
  dataURL: string;
}

export interface EducationEntry {
  id: number;
  institution: string;
  specialty: string;
  startYear: number;
  endYear?: number | null;
  studyForm: 'full-time' | 'part-time' | 'mixed' | 'distance';
  documents: EducationDocument[];
}

export interface EducationStore {
  entries: EducationEntry[];
  addEntry: (entry: Omit<EducationEntry, 'id'>) => void;
  updateEntry: (id: number, updatedEntry: Partial<Omit<EducationEntry, 'id'>>) => void;
  removeEntry: (id: number) => void;
}