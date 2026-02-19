import React, { useRef, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, EducationFormData } from '../../utils/validation';
import { fileToDataURL } from '../../utils/fileUtils';
import { CustomSelect } from '../CustomSelect/CustomSelect';
import { Button } from '../Button/Button';
import { FileSlider } from '../FileSlider/FileSlider';
import { useEducationStore } from '../../store/educationStore';
import styles from './EducationFormModal.module.scss';

const currentYear = new Date().getFullYear();
const maxYear = currentYear + 10;
const yearOptions = Array.from({ length: maxYear - 1980 + 1 }, (_, i) => ({
  value: String(1980 + i),
  label: String(1980 + i)
}));

const studyFormOptions = [
  { value: 'full-time', label: 'Очная' },
  { value: 'part-time', label: 'Заочная' },
  { value: 'mixed', label: 'Очно-заочная' },
  { value: 'distance', label: 'Дистанционная' }
];

interface EducationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EducationFormModal: React.FC<EducationFormModalProps> = ({ isOpen, onClose }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      specialty: '',
      startYear: currentYear,
      endYear: null,
      studyForm: 'full-time',
      documents: []
    }
  });

  useEffect(() => {
    if (isOpen) {
      reset();
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EducationFormData) => {
    const documents = await Promise.all(selectedFiles.map(fileToDataURL));
    const finalData = { ...data, documents };
    useEducationStore.getState().addEntry(finalData);
    reset();
    setSelectedFiles([]);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>Добавить образование</h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Учебное заведение</label>
            <textarea
              {...register('institution')}
              className={errors.institution ? styles.error : ''}
            />
            {errors.institution && <span className={styles.errorMessage}>{errors.institution.message}</span>}
          </div>

          <div className={styles.field}>
            <label>Специальность</label>
            <input
              type="text"
              {...register('specialty')}
              className={errors.specialty ? styles.error : ''}
            />
            {errors.specialty && <span className={styles.errorMessage}>{errors.specialty.message}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>Год начала</label>
              <Controller
                name="startYear"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={yearOptions}
                    value={String(field.value)}
                    onChange={(val) => field.onChange(Number(val))}
                    required
                  />
                )}
              />
              {errors.startYear && <span className={styles.errorMessage}>{errors.startYear.message}</span>}
            </div>

            <div className={styles.field}>
              <label>Год окончания</label>
              <Controller
                name="endYear"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={[{ value: '', label: 'Не выбрано' }, ...yearOptions]}
                    value={field.value ? String(field.value) : ''}
                    onChange={(val) => field.onChange(val ? Number(val) : null)}
                  />
                )}
              />
              {errors.endYear && <span className={styles.errorMessage}>{errors.endYear.message}</span>}
            </div>
          </div>

          <div className={styles.field}>
            <label>Форма обучения</label>
            <Controller
              name="studyForm"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={studyFormOptions}
                  value={field.value}
                  onChange={field.onChange}
                  required
                />
              )}
            />
            {errors.studyForm && <span className={styles.errorMessage}>{errors.studyForm.message}</span>}
          </div>

          <div className={styles.field}>
            <label>Документы</label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.png,.doc,.docx"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <FileSlider files={selectedFiles} onRemove={handleRemoveFile} />
          </div>

          <div className={styles.actions}>
            <Button type="button" variant="secondary" onClick={onClose}>Отмена</Button>
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </div>
    </div>
  );
};