import React, { useRef, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { educationSchema, EducationFormData } from '../../utils/validation';
import { fileToDataURL } from '../../utils/fileUtils';
import { CustomSelect } from '../CustomSelect/CustomSelect';
import { Button } from '../Button/Button';
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
    // Очищаем input, чтобы можно было выбрать тот же файл снова
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: EducationFormData) => {
    // Конвертируем файлы в base64
    const documents = await Promise.all(selectedFiles.map(fileToDataURL));
    const finalData = { ...data, documents };
    useEducationStore.getState().addEntry(finalData);
    // Сброс формы и состояния
    reset();
    setSelectedFiles([]);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Добавить образование</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>
              Учебное заведение <span className={styles.requiredStar} title="Обязательное поле">*</span>
            </label>
            <textarea
              {...register('institution')}
              className={errors.institution ? styles.error : ''}
            />
            {errors.institution && <span className={styles.errorMessage}>{errors.institution.message}</span>}
          </div>

          <div className={styles.field}>
            <label>
              Специальность <span className={styles.requiredStar} title="Обязательное поле">*</span>
            </label>
            <input
              type="text"
              {...register('specialty')}
              className={errors.specialty ? styles.error : ''}
            />
            {errors.specialty && <span className={styles.errorMessage}>{errors.specialty.message}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label>
                Год начала <span className={styles.requiredStar} title="Обязательное поле">*</span>
              </label>
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
            <label>
              Форма обучения <span className={styles.requiredStar} title="Обязательное поле">*</span>
            </label>
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
            {selectedFiles.length > 0 && (
              <ul className={styles.fileList}>
                {selectedFiles.map((file, index) => (
                  <li key={index} className={styles.fileItem}>
                    <span className={styles.fileName}>{file.name}</span>
                    <button
                      type="button"
                      className={styles.removeFileButton}
                      onClick={() => handleRemoveFile(index)}
                      title="Удалить файл"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )}
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