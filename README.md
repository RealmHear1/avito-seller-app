# Avito Seller - Frontend Test Assignment

Веб-приложение для личного кабинета продавца на Avito с интеграцией AI-ассистента для улучшения описаний объявлений.

## Структура проекта

```
avito-test/
├── client/          # Frontend (React + TypeScript + Vite)
├── server/          # Backend API (Node.js + Fastify)
└── README.md
```

## Технологии

### Frontend
- **React 18.2.0** с TypeScript
- **Vite** для сборки
- **Material UI (MUI)** для компонентов
- **React Router** для навигации
- **TanStack Query** для управления API-запросами
- **React Hook Form + Zod** для форм и валидации
- **ESLint + Prettier** для код-стайла

### Backend
- **Node.js** с Fastify
- **Zod** для валидации данных
- **TypeScript**

## Разработка

### Запуск сервера
```bash
cd server
npm install
npm start
```
Сервер будет доступен на `http://localhost:8080`

### Запуск клиента
```bash
cd client
npm install
npm run dev
```
Приложение будет доступно на `http://localhost:5173`

### Линтинг и форматирование
```bash
cd client
npm run lint      # Проверка кода
npm run lint:fix  # Исправление ошибок
npm run format    # Форматирование кода
```

## API эндпоинты

- `GET /items` - Получение списка объявлений с фильтрацией
- `GET /items/:id` - Получение объявления по ID
- `PUT /items/:id` - Обновление объявления

## Страницы приложения

- `/ads` - Список объявлений с фильтрами и пагинацией
- `/ads/:id` - Детальная информация об объявлении
- `/ads/:id/edit` - Редактирование объявления с AI-ассистентом

## AI-интеграция

Планируется интеграция с **Ollama** для:
- Улучшения описаний объявлений
- Рекомендаций по цене
- Генерации характеристик

