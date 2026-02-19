import React, { useState, useRef, useEffect } from 'react';
import { useEducationStore } from '../../store/educationStore';
import { Button } from '../../components/Button/Button';
import { EducationForm } from '../../components/EducationForm/EducationForm';
import { DocSlider } from '../../components/DocSlider/DocSlider';
import styles from './EducationPage.module.scss';

const studyFormLabels: Record<string, string> = {
  'full-time': 'Очное (дневное обучение)',
  'part-time': 'Заочное',
  'mixed': 'Очно-заочное',
  'distance': 'Дистанционное'
};

const EducationPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { entries, removeEntry } = useEducationStore();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleDeleteEntry = (id: number) => {
    if (window.confirm('Удалить запись об образовании?')) {
      removeEntry(id);
    }
  };

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const { scrollLeft, scrollWidth, clientWidth } = container;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [entries]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollAmount = 300;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Образование</h1>
        <Button
          variant="add"
          onClick={() => setIsModalOpen(true)}
          icon={<span>+</span>}
        >
          Добавить образование
        </Button>
      </div>

      {entries.length > 0 ? (
        <div className={styles.cardsContainerWrapper}>
          {canScrollLeft && (
            <button
              className={`${styles.scrollButton} ${styles.scrollLeft}`}
              onClick={() => scroll('left')}
              aria-label="Прокрутить влево"
            >
              ‹
            </button>
          )}
          <div
            className={styles.cardsContainer}
            ref={scrollContainerRef}
            onScroll={checkScroll}
          >
            {entries.map(entry => (
              <div key={entry.id} className={styles.entryCard}>
                <div className={styles.entryHeader}>
                  <h3 title={entry.institution}>{entry.institution}</h3>
                  <button
                    className={styles.deleteEntryButton}
                    onClick={() => handleDeleteEntry(entry.id)}
                    title="Удалить запись"
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.entryDetails}>
                  <p className={styles.specialty}>{entry.specialty}</p>
                  <p className={styles.studyForm}>{studyFormLabels[entry.studyForm]}</p>
                  <p className={styles.years}>
                    {entry.startYear} — {entry.endYear || 'н.в.'} год
                  </p>
                </div>
                <div className={styles.documentsSection}>
                  <DocSlider documents={entry.documents} />
                </div>
              </div>
            ))}
          </div>
          {canScrollRight && (
            <button
              className={`${styles.scrollButton} ${styles.scrollRight}`}
              onClick={() => scroll('right')}
              aria-label="Прокрутить вправо"
            >
              ›
            </button>
          )}
        </div>
      ) : (
        <p className={styles.empty}>Нет добавленных образований</p>
      )}

      <EducationForm isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default EducationPage;