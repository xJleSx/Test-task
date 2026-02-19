import { z } from 'zod';

const currentYear = new Date().getFullYear();
const maxYear = currentYear + 10;

export const educationSchema = z.object({
  institution: z.string().min(1, 'Обязательное поле').max(256),
  specialty: z.string()
    .min(1, 'Обязательное поле')
    .max(256)
    .regex(/^[а-яА-Яa-zA-Z0-9\s]+$/, 'Только буквы и цифры'),
  startYear: z.number().min(1980).max(maxYear).nullable().refine(val => val !== null, { message: 'Обязательное поле' }),
  endYear: z.number().min(1980).max(maxYear).optional().nullable(),
  studyForm: z.enum(['full-time', 'part-time', 'mixed', 'distance'], {
    required_error: 'Обязательное поле',
    invalid_type_error: 'Обязательное поле'
  }).nullable().refine(val => val !== null, { message: 'Обязательное поле' }),
  documents: z.array(z.object({
    name: z.string(),
    type: z.string(),
    dataURL: z.string()
  })).optional().default([])
}).refine(data => {
  if (data.endYear && data.startYear && data.endYear < data.startYear) {
    return false;
  }
  return true;
}, {
  message: 'Год окончания не может быть раньше года начала',
  path: ['endYear']
}).refine(data => {
  if (data.endYear && data.startYear && (data.endYear - data.startYear > 11)) {
    return false;
  }
  return true;
}, {
  message: 'Продолжительность обучения не может превышать 11 лет',
  path: ['endYear']
}).refine(data => {
  if (data.endYear && data.startYear && (data.endYear - data.startYear < 1)) {
    return false;
  }
  return true;
}, {
  message: 'Минимальная продолжительность обучения — 1 год',
  path: ['endYear']
});

export type EducationFormData = z.infer<typeof educationSchema>;