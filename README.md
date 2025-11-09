## Ссылка на деплой 
 [Open app on Netlify](https://hilarious-zabaione-c6eb8d.netlify.app)
Чат-приложение
Проект чат-приложения, разработанный с использованием Vite, Handlebars и TypeScript.
Deployed Site
https://your-project-name.netlify.app
Страницы проекта

Главная страница (Авторизация)
Регистрация
Список чатов
Настройки профиля
Ошибка 404
Ошибка 500

Технологии

Vite — сборщик проекта
Handlebars — шаблонизатор
TypeScript — типизация
SCSS — препроцессор CSS
ESLint — линтер кода
Stylelint — линтер стилей

Установка
bashnpm install
Команды
Разработка
Запуск dev-сервера на порту 3000:
bashnpm run dev
Сборка и запуск продакшн
bashnpm run start
Сборка проекта
bashnpm run build
Preview собранного проекта
bashnpm run preview
Линтинг
bashnpm run lint
npm run lint:fix
Структура проекта
├── src/
│   ├── pages/          # Страницы приложения
│   ├── components/     # Переиспользуемые компоненты
│   ├── utils/          # Утилиты
│   ├── styles/         # Глобальные стили
│   ├── assets/         # Статические файлы
│   ├── main.ts         # Точка входа
│   └── vite-env.d.ts   # TypeScript декларации
├── static/             # Статические файлы (копируются как есть)
├── dist/               # Собранный проект (в .gitignore)
├── vite.config.ts      # Конфигурация Vite
├── tsconfig.json       # Конфигурация TypeScript
├── package.json        # Зависимости проекта
└── .gitignore          # Игнорируемые файлы
Deploy
Проект автоматически деплоится на Netlify из ветки deploy.
