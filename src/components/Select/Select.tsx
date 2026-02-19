import React, { useState, useRef, useEffect } from 'react';
import styles from './Select.module.scss';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  hideRequiredStar?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  required = false,
  hideRequiredStar = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className={styles.selectContainer} ref={ref}>
      <div
        className={`${styles.selected} ${isOpen ? styles.open : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.selectedText}>{selectedLabel}</span>
        <span className={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
        {required && !hideRequiredStar && <span className={styles.required}>*</span>}
      </div>
      {isOpen && (
        <ul className={styles.options}>
          {options.map(opt => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={opt.value === value ? styles.selectedOption : ''}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};