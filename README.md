# Образование — управление записями об образовании

Веб-приложение для ведения списка образовательных учреждений с возможностью прикрепления документов.  
Реализовано на **React**, **TypeScript**, **Vite**, **Zustand**, **React Hook Form**, **Zod**, **Swiper** и **SCSS Modules**.

## Функциональность

- Добавление новой записи об образовании (модальное окно с валидацией).
- Удаление записи.
- Кастомные селекты для годов и формы обучения.
- Прикрепление нескольких файлов (PDF, изображения, документы) с предпросмотром в виде слайдера.
- Горизонтальная прокрутка карточек.
- Адаптивный дизайн.

## Технологии

- **React 18** — библиотека для UI.
- **TypeScript** — типизация.
- **Vite** — сборщик и dev-сервер.
- **Zustand** — управление состоянием (хранилище записей).
- **React Hook Form** + **Zod** — формы и валидация.
- **Swiper** — слайдер для документов.
- **SCSS Modules** — стили.

## Установка и запуск

### Требования
- Node.js версии 18 или выше
- npm или yarn

### Шаги

1. Клонируйте репозиторий:

   git clone https://github.com/xJleSx/Test-task

2. Установите зависимости:

   npm install

3. Запустите dev-сервер: 

   npm run dev

4. Откройте в браузере адрес, указанный в терминале

## Структура проекта

 project-root/                         
 ├── .gitignore                                                             
 ├── README.md                                    
 ├── index.html  
 ├── package.json   
 ├── package-lock.json   
 ├── tsconfig.json    
 ├── tsconfig.node.json    
 ├── vite.config.ts    
 ├── vite-env.d.ts    
 └── src/     
     ├── components/  
     │   ├── Button/  
     │   │    ├── Button.tsx  
     │   │    └── Button.module.scss  
     │   ├── Select/  
     │   │    ├── Select.tsx  
     │   │    └── Select.module.scss   
     │   ├── DocSlider/   
     │   │    ├── DocSlider.tsx   
     │   │    └── DocSlider.module.scss  
     │   ├── SelectedFiles/   
     │   │    ├── SelectedFiles.tsx   
     │   │    └── SelectedFiles.module.scss   
     │   └── EducationForm/   
     │        ├── EducationForm.tsx   
     │        └── EducationForm.module.scss   
     ├── pages/   
     │   └── EducationPage/   
     │        ├── EducationPage.tsx   
     │        └── EducationPage.module.scss  
     ├── store/   
     │    └── educationStore.ts  
     ├── types/   
     │    └── education.ts   
     ├── utils/   
     │    ├── fileUtils.ts   
     │    └── validation.ts   
     ├── styles/   
     │    ├── global.scss   
     │    └── variables.scss   
     ├── App.tsx   
     └── main.tsx    
     │   ├── global.scss   
     │   └── variables.scss   
     ├── App.tsx   
     └── main.tsx   
