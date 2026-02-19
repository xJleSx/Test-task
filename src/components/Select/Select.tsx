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
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Выберите...',
  required = false,
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
        {selectedLabel}
        {required && <span className={styles.required}>*</span>}
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