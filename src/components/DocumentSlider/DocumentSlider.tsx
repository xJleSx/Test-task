import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './DocumentSlider.module.scss';
import { EducationDocument } from '../../types/education';

interface DocumentSliderProps {
  documents: EducationDocument[];
  onDeleteDocument?: (index: number) => void;
}

export const DocumentSlider: React.FC<DocumentSliderProps> = ({ documents, onDeleteDocument }) => {
  if (!documents.length) {
    return <p className={styles.empty}>Нет загруженных документов</p>;
  }

  const handleDocumentClick = (doc: EducationDocument, e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.deleteButton}`)) {
      return;
    }
    const link = document.createElement('a');
    link.href = doc.dataURL;
    link.download = doc.name;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className={styles.sliderWrapper}>
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `.${styles.prevButton}`,
          nextEl: `.${styles.nextButton}`,
        }}
        spaceBetween={10}
        slidesPerView="auto"  /* авто-ширина, чтобы слайды подстраивались под контент */
        className={styles.swiper}
      >
        {documents.map((doc, idx) => (
          <SwiperSlide key={idx} className={styles.slide}> {/* добавили класс */}
            <div className={styles.documentCard} onClick={(e) => handleDocumentClick(doc, e)}>
              <span className={styles.icon}>📄</span>
              <span className={styles.name} title={doc.name}>{doc.name}</span>
              {onDeleteDocument && (
                <button
                  className={styles.deleteButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDocument(idx);
                  }}
                  title="Удалить документ"
                >
                  ✕
                </button>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className={`${styles.navButton} ${styles.prevButton}`} aria-label="Previous slide">
        ‹
      </button>
      <button className={`${styles.navButton} ${styles.nextButton}`} aria-label="Next slide">
        ›
      </button>
    </div>
  );
};