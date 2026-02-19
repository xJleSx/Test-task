import React, { useState, useRef, useEffect } from 'react';
import { useEducationStore } from '../../store/educationStore';
import { Button } from '../../components/Button/Button';
import { EducationFormModal } from '../../components/EducationFormModal/EducationFormModal';
import { DocumentSlider } from '../../components/DocumentSlider/DocumentSlider';
import styles from './EducationPage.module.scss';

const studyFormLabels: Record<string, string> = {
  'full-time': 'Очная',
  'part-time': 'Заочная',
  'mixed': 'Очно-заочная',
  'distance': 'Дистанционная'
};

const EducationPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { entries, removeEntry } = useEducationStore(); // удалили updateEntry, так как не используется

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
          Добавить
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
                  <h3>{entry.institution}</h3>
                  <button
                    className={styles.deleteEntryButton}
                    onClick={() => handleDeleteEntry(entry.id)}
                    title="Удалить запись"
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.entryDetails}>
                  <p><strong>Специальность:</strong> {entry.specialty}</p>
                  <p><strong>Годы:</strong> {entry.startYear} - {entry.endYear || 'н.в.'}</p>
                  <p><strong>Форма:</strong> {studyFormLabels[entry.studyForm]}</p>
                </div>
                <div className={styles.documentsSection}>
                  <h4>Документы</h4>
                  {entry.documents.length > 0 ? (
                    <DocumentSlider documents={entry.documents} />
                  ) : (
                    <p className={styles.noDocuments}>Нет документов</p>
                  )}
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

      <EducationFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default EducationPage;