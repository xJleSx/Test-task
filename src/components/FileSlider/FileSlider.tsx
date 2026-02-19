import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './FileSlider.module.scss';

interface FileSliderProps {
  files: File[];
  onRemove: (index: number) => void;
}

export const FileSlider: React.FC<FileSliderProps> = ({ files, onRemove }) => {
  if (!files.length) {
    return <div className={styles.empty}>Нет загруженных документов</div>;
  }

  return (
    <div className={styles.sliderWrapper}>
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: `.${styles.prevButton}`,
          nextEl: `.${styles.nextButton}`,
        }}
        spaceBetween={8}
        slidesPerView={1}
        breakpoints={{
          400: { slidesPerView: 2 },
          600: { slidesPerView: 3 }
        }}
        className={styles.swiper}
        watchOverflow={true}
      >
        {files.map((file, index) => (
          <SwiperSlide key={index}>
            <div className={styles.fileCard}>
              <span className={styles.icon}>📄</span>
              <span className={styles.name} title={file.name}>
                {file.name}
              </span>
              <button
                type="button"
                className={styles.removeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(index);
                }}
                title="Удалить файл"
              >
                ✕
              </button>
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