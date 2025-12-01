# Мессенджер

Веб-приложение мессенджера, разработанное в рамках курса Яндекс.Практикум "Мидл фронтенд-разработчик".

## 🚀 Deployed Site

**Production:** [https://your-project-name.netlify.app](https://deploy-preview-2--hilarious-zabaione-c6eb8d.netlify.app/)



## 📄 Страницы проекта

### Основные страницы

- **[Авторизация]
  - Форма входа с полями `login` и `password`
  - Валидация при отправке формы
  - Ссылка на страницу регистрации

- **[Регистрация]
  - Форма регистрации с полями: `first_name`, `second_name`, `login`, `email`, `password`, `phone`
  - Валидация всех полей по требованиям
  - Ссылка на страницу входа

- **[Мессенджер]
  - Список чатов с аватарами и превью последних сообщений
  - Окно переписки с историей сообщений
  - Поле ввода сообщения (`message`) с валидацией
  - Навигация в настройки профиля

- **[Настройки профиля]
  - Загрузка аватара (`avatar`)
  - Редактирование личной информации: `first_name`, `second_name`, `display_name`, `login`, `email`, `phone`
  - Изменение пароля: `oldPassword`, `newPassword`
  - Валидация всех форм
  - Ссылка обратно к чатам

### Страницы ошибок

- **[404 - Страница не найдена]
- **[500 - Ошибка сервера]

## 🛠 Технологии

### Sprint 2
- **[Vite](https://vitejs.dev/)** — сборщик проекта с fast HMR
- **[TypeScript](https://www.typescriptlang.org/)** — типизация и безопасность кода
- **[Handlebars](https://handlebarsjs.com/)** — шаблонизатор для компонентов
- **[SCSS](https://sass-lang.com/)** — препроцессор CSS с переменными
- **MVC архитектура** — разделение на Model-View-Controller
- **Компонентный подход** — Block + EventBus для управления компонентами
- **ESLint (Airbnb)** — линтинг кода
- **Stylelint** — линтинг стилей

### Ключевые паттерны
- Базовый класс `Block` с жизненными циклами компонентов
- EventBus для управления событиями
- HTTPTransport для работы с API (Promise + XMLHttpRequest)
- Валидация форм с регулярными выражениями
- Компиляция Handlebars шаблонов на клиенте

## 📦 Установка

### Предварительные требования
- Node.js >= 18.0.0
- npm >= 9.0.0

### Установка зависимостей
```bash
# Клонируйте репозиторий
git clone
cd messenger

# Установите зависимости
npm install
```

## 🚀 Команды для работы

### Режим разработки
Запуск dev-сервера с hot-reload на порту 3000:
```bash
npm run dev
```
После запуска проект будет доступен по адресу: **http://localhost:3000**

### Сборка и запуск production
Собирает проект и запускает preview:
```bash
npm run start
```

### Только сборка
Создает production-версию в папке `dist/`:
```bash
npm run build
```

### Preview собранного проекта
Запускает локальный сервер для просмотра собранной версии:
```bash
npm run preview
```

### Проверка кода
```bash
# Проверка TypeScript типов
npm run type-check

# Линтинг JavaScript/TypeScript
npm run lint

# Автоматическое исправление ошибок линтинга
npm run lint:fix

# Линтинг стилей SCSS
npm run stylelint

# Автоматическое исправление ошибок стилей
npm run stylelint:fix
```



## 🔄 Workflow разработки

### Sprint 1 (завершён) ✅
- ✅ Настройка Vite с SCSS и Handlebars
- ✅ Все базовые страницы (авторизация, регистрация, настройки, ошибки)
- ✅ Базовые стили с Flexbox
- ✅ Формы с правильными именами полей
- ✅ Деплой на Netlify

### Sprint 2 (текущий) ✅
- ✅ Внедрён TypeScript
- ✅ Компонентный подход с Block + EventBus
- ✅ MVC архитектура
- ✅ Полноценная страница мессенджера с валидацией
- ✅ Валидация форм по blur и submit
- ✅ HTTPTransport (GET, POST, PUT, DELETE)
- ✅ Сбор данных форм в console.log
- ✅ ESLint (Airbnb) + Stylelint
- ✅ Все страницы через Block компоненты

### Sprint 3 (планируется) 🔲
- 🔲 SPA роутер без перезагрузки страницы
- 🔲 API интеграция
- 🔲 WebSocket для real-time сообщений
- 🔲 Модульные окна
- 🔲 Загрузка файлов и изображений

### Будущие улучшения 🔲
- 🔲 Адаптивная верстка для мобильных устройств
- 🔲 Темная тема
- 🔲 Уведомления о новых сообщениях
- 🔲 Поиск по сообщениям
- 🔲 Группы и каналы

## 📝 Чек-лист Sprint 2

- [x] Создана ветка `sprint_2`
- [x] Внедрён TypeScript
- [x] Создан базовый класс Block с EventBus
- [x] Реализована страница мессенджера со списком чатов и лентой переписки
- [x] Все компоненты (Input, Button) наследуются от Block
- [x] Все страницы (LoginPage, SignUpPage, MessengerPage, SettingsPage, ErrorPage) наследуются от Block
- [x] Валидация всех форм по blur и submit с регулярными выражениями
- [x] HTTPTransport класс (GET, POST, PUT, DELETE) на Promise + XHR
- [x] QueryString с encodeURIComponent
- [x] Сбор данных форм в console.log
- [x] ESLint (Airbnb конфигурация)
- [x] Stylelint
- [x] MVC структура проекта
- [x] Метод `_removeEvents` для предотвращения утечек памяти
- [x] Генерация страниц на клиенте
- [x] Навигация через ссылки
- [x] Обновлён README.md
- [x] Создан Pull Request "Sprint 2"

## 🐛 Известные ограничения

- Нет реального API (используются console.log для демонстрации)
- Нет сохранения данных между сеансами
- Нет адаптивной верстки (будет добавлена в следующих спринтах)
- Навигация через перезагрузку страницы (SPA роутер в Sprint 3)

## 📚 Полезные ссылки

- [Документация Vite](https://vitejs.dev/)
- [Документация TypeScript](https://www.typescriptlang.org/docs/)
- [Документация Handlebars](https://handlebarsjs.com/)
- [Документация SCSS](https://sass-lang.com/documentation)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Stylelint Rules](https://stylelint.io/user-guide/rules/)
- [Курс Яндекс.Практикум](https://practicum.yandex.ru/)

## 👤 Автор

**Ваше имя**
- GitHub: [@Sergei342](https://github.com/Sergei342)
- Проект: [messenger](https://github.com/Sergei342/messenger)

## 📄 Лицензия

Этот проект создан в учебных целях в рамках курса Яндекс.Практикум.

---

**Sprint 2** ✅ — Компонентный подход, TypeScript, MVC архитектура
