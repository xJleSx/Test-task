import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './DocumentSlider.module.scss';
import { EducationDocument } from '../../types/education';

interface DocumentSliderProps {
  documents: EducationDocument[];
}

export const DocumentSlider: React.FC<DocumentSliderProps> = ({ documents }) => {
  if (!documents.length) {
    return <p className={styles.empty}>Нет загруженных документов</p>;
  }

  const handleDocumentClick = (doc: EducationDocument) => {
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
        spaceBetween={8} /* чуть меньше отступ */
        slidesPerView={1}
        direction="horizontal"
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }}
        className={styles.swiper}
        /* добавлены watchOverflow для корректного скрытия кнопок */
        watchOverflow={true}
      >
        {documents.map((doc, idx) => (
          <SwiperSlide key={idx}>
            <div className={styles.documentCard} onClick={() => handleDocumentClick(doc)}>
              <div className={styles.icon}>📄</div>
              <div className={styles.name} title={doc.name}>{doc.name}</div>
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